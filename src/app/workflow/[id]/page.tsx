import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import WorkflowEditorClient from '@/components/editor/WorkflowEditorClient';

interface WorkflowPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  // Get or create user
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: '',
      },
    });
  }

  // Handle "new" workflow
  if (id === 'new') {
    return <WorkflowEditorClient workflowId={null} />;
  }

  // Get existing workflow
  const workflow = await prisma.workflow.findUnique({
    where: { id },
  });

  if (!workflow || workflow.userId !== user.id) {
    redirect('/dashboard');
  }

  return <WorkflowEditorClient workflowId={id} />;
}
