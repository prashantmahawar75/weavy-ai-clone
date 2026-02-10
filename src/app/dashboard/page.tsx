import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import HomeSidebar from '@/components/workspace/HomeSidebar';
import HomeHeader from '@/components/workspace/HomeHeader';
import WorkflowGrid from '@/components/workspace/WorkflowGrid';

export default async function DashboardPage() {
  const { userId } = await auth();

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

  return (
    <main className="flex h-screen bg-[#0E0E13] text-white">
      <HomeSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HomeHeader />
        <WorkflowGrid />
      </div>
    </main>
  );
}
