import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getExecutionLevels, isValidDAG } from '@/lib/utils';
import { runs } from '@trigger.dev/sdk/v3';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import type { Prisma } from '@prisma/client';
import { executeWorkflowSchema, parseBody } from '@/lib/validations';
import { workflowOrchestratorTask } from '@/trigger/workflowOrchestratorTask';

// POST /api/execute - start a full workflow execution via Trigger.dev orchestrator
export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit check
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`execute:${clientIp}`, RATE_LIMITS.api);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) } }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = parseBody(executeWorkflowSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { workflowId, nodes: rawNodes, edges: rawEdges } = parsed.data;
    const nodes = rawNodes as unknown as { id: string; type: string; data: Record<string, unknown> }[];
    const edges = rawEdges as unknown as { source: string; target: string; sourceHandle?: string; targetHandle?: string }[];

    // Validate DAG
    if (!isValidDAG(nodes, edges)) {
      return NextResponse.json({ error: 'Workflow contains cycles — not a valid DAG' }, { status: 400 });
    }

    // Group nodes by topological level for parallel execution
    const levels = getExecutionLevels(nodes, edges);

    // Create a workflow run record
    const run = await prisma.workflowRun.create({
      data: {
        workflowId: workflowId || 'inline',
        userId: user.id,
        status: 'running',
        scope: 'full',
        nodeResults: {},
        startedAt: new Date(),
      },
    });

    // Trigger the orchestrator task in Trigger.dev — this returns immediately.
    // The long-running workflow execution happens inside Trigger.dev infrastructure,
    // avoiding Vercel serverless function timeouts.
    const handle = await workflowOrchestratorTask.trigger({
      workflowId: workflowId || 'inline',
      runId: run.id,
      nodes,
      edges,
      levels,
    });

    // Persist the Trigger.dev run ID so the GET endpoint can poll for results
    await prisma.workflowRun.update({
      where: { id: run.id },
      data: {
        nodeResults: { _meta: { triggerRunId: handle.id } } as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      runId: run.id,
      triggerRunId: handle.id,
      status: 'running',
    });
  } catch (error) {
    console.error('POST /api/execute error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/execute?runId=xxx - get run status (polls Trigger.dev if still running)
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const runId = searchParams.get('runId');

    if (!runId) {
      return NextResponse.json({ error: 'Run ID required' }, { status: 400 });
    }

    const run = await prisma.workflowRun.findUnique({ where: { id: runId } });
    if (!run) {
      return NextResponse.json({ error: 'Run not found' }, { status: 404 });
    }

    // If already completed/failed in DB, return immediately
    if (run.status !== 'running') {
      return NextResponse.json({
        runId: run.id,
        status: run.status,
        nodeResults: run.nodeResults,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        duration: run.duration,
      });
    }

    // Still running — check Trigger.dev orchestrator status
    const meta = (run.nodeResults as Record<string, unknown>)?._meta as
      | { triggerRunId?: string }
      | undefined;

    if (!meta?.triggerRunId) {
      return NextResponse.json({
        runId: run.id,
        status: 'running',
        nodeResults: run.nodeResults,
        startedAt: run.startedAt,
      });
    }

    try {
      const triggerRun = await runs.retrieve(meta.triggerRunId);

      if (triggerRun.status === 'COMPLETED') {
        const output = triggerRun.output as {
          status: string;
          nodeResults: Record<string, unknown>;
        } | null;

        const completedAt = new Date();
        const updatedRun = await prisma.workflowRun.update({
          where: { id: run.id },
          data: {
            status: output?.status || 'completed',
            nodeResults: (output?.nodeResults || {}) as unknown as Prisma.InputJsonValue,
            completedAt,
            duration: Math.floor(
              (completedAt.getTime() - run.startedAt.getTime()) / 1000
            ),
          },
        });

        return NextResponse.json({
          runId: updatedRun.id,
          status: updatedRun.status,
          nodeResults: updatedRun.nodeResults,
          startedAt: updatedRun.startedAt,
          completedAt: updatedRun.completedAt,
          duration: updatedRun.duration,
        });
      }

      if (triggerRun.status === 'FAILED' || triggerRun.status === 'CANCELED') {
        const errorMsg =
          (triggerRun as unknown as { error?: { message?: string } }).error
            ?.message || 'Workflow execution failed';

        await prisma.workflowRun.update({
          where: { id: run.id },
          data: {
            status: 'failed',
            nodeResults: { error: errorMsg } as unknown as Prisma.InputJsonValue,
            completedAt: new Date(),
          },
        });

        return NextResponse.json({
          runId: run.id,
          status: 'failed',
          error: errorMsg,
        });
      }

      // Still in progress
      return NextResponse.json({
        runId: run.id,
        status: 'running',
        triggerStatus: triggerRun.status,
        startedAt: run.startedAt,
      });
    } catch (triggerError) {
      console.error('Failed to retrieve Trigger.dev run:', triggerError);
      return NextResponse.json({
        runId: run.id,
        status: 'running',
        startedAt: run.startedAt,
      });
    }
  } catch (error) {
    console.error('GET /api/execute error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
