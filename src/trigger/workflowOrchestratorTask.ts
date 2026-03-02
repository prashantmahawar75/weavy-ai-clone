import { task } from '@trigger.dev/sdk/v3';
import { llmTask } from './llmTask';
import { cropImageTask } from './cropImageTask';
import { extractFrameTask } from './extractFrameTask';

// ─── Types ──────────────────────────────────────────────────

interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

interface WorkflowEdge {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface NodeResult {
  nodeId: string;
  nodeType: string;
  status: string;
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

interface OrchestratorPayload {
  workflowId: string;
  runId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  levels: string[][];
}

// ─── Orchestrator Task ──────────────────────────────────────

export const workflowOrchestratorTask = task({
  id: 'workflow-orchestrator',
  maxDuration: 300, // 5 minutes
  run: async (payload: OrchestratorPayload) => {
    const { nodes, edges, levels } = payload;
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    const nodeResults: Record<string, NodeResult> = {};
    let failed = false;

    for (const level of levels) {
      if (failed) break;

      // Execute all nodes in this level concurrently
      await Promise.all(
        level.map(async (nodeId) => {
          if (failed) return;

          const node = nodeMap.get(nodeId);
          if (!node) return;

          const startTime = new Date().toISOString();
          nodeResults[nodeId] = {
            nodeId,
            nodeType: node.type,
            status: 'running',
            startedAt: startTime,
          };

          try {
            // Gather inputs from connected source nodes
            const incomingEdges = edges.filter((e) => e.target === nodeId);
            const inputData: Record<string, unknown> = {};

            for (const edge of incomingEdges) {
              const sourceResult = nodeResults[edge.source];
              if (sourceResult?.output) {
                inputData[edge.targetHandle || 'input'] = sourceResult.output;
              }
            }

            let output: unknown = null;

            switch (node.type) {
              case 'text':
                output = { text: node.data.text || '' };
                break;

              case 'uploadImage':
                output = { images: node.data.images || [] };
                break;

              case 'uploadVideo':
                output = { videoUrl: node.data.videoUrl || '' };
                break;

              case 'llm': {
                const llmPayload = {
                  model: (node.data.model as string) || 'gemini-1.5-flash',
                  systemPrompt:
                    (inputData.system_prompt as { text?: string })?.text || '',
                  userMessage:
                    (inputData.user_message as { text?: string })?.text || '',
                  images:
                    (
                      inputData.images as {
                        images?: { imageUrl: string }[];
                      }
                    )?.images?.map((i: { imageUrl: string }) => i.imageUrl) ||
                    [],
                };

                const result = await llmTask.triggerAndWait(llmPayload);
                if (!result.ok) {
                  throw new Error(
                    typeof result.error === 'string'
                      ? result.error
                      : 'LLM task failed'
                  );
                }
                output = result.output;
                break;
              }

              case 'cropImage': {
                const imageInput = inputData.image_url as
                  | {
                      images?: { imageUrl: string }[];
                      outputImageUrl?: string;
                    }
                  | undefined;
                const imageUrl =
                  imageInput?.outputImageUrl ||
                  imageInput?.images?.[0]?.imageUrl;

                const cropPayload = {
                  imageUrl: imageUrl || '',
                  x: Number(
                    (inputData.x_percent as { text?: string })?.text ??
                      node.data.x ??
                      0
                  ),
                  y: Number(
                    (inputData.y_percent as { text?: string })?.text ??
                      node.data.y ??
                      0
                  ),
                  width: Number(
                    (inputData.width_percent as { text?: string })?.text ??
                      node.data.width ??
                      100
                  ),
                  height: Number(
                    (inputData.height_percent as { text?: string })?.text ??
                      node.data.height ??
                      100
                  ),
                };

                const result =
                  await cropImageTask.triggerAndWait(cropPayload);
                if (!result.ok) {
                  throw new Error(
                    typeof result.error === 'string'
                      ? result.error
                      : 'Crop image task failed'
                  );
                }
                output = result.output;
                break;
              }

              case 'extractFrame': {
                const videoInput = inputData.video_url as
                  | { videoUrl?: string }
                  | undefined;
                const extractPayload = {
                  videoUrl: videoInput?.videoUrl || '',
                  timestamp: Number(
                    (inputData.timestamp as { text?: string })?.text ??
                      node.data.timestamp ??
                      0
                  ),
                };

                const result =
                  await extractFrameTask.triggerAndWait(extractPayload);
                if (!result.ok) {
                  throw new Error(
                    typeof result.error === 'string'
                      ? result.error
                      : 'Extract frame task failed'
                  );
                }
                output = result.output;
                break;
              }

              default:
                output = { text: `Unknown node type: ${node.type}` };
            }

            nodeResults[nodeId] = {
              ...nodeResults[nodeId],
              status: 'completed',
              output,
              completedAt: new Date().toISOString(),
            };
          } catch (error) {
            const errorMsg =
              error instanceof Error ? error.message : 'Unknown error';
            nodeResults[nodeId] = {
              ...nodeResults[nodeId],
              status: 'failed',
              error: errorMsg,
              completedAt: new Date().toISOString(),
            };
            failed = true;
          }
        })
      );
    }

    return {
      status: failed ? 'failed' : 'completed',
      nodeResults,
    };
  },
});
