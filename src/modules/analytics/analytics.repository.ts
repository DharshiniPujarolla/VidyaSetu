import { prisma } from '@/lib/prisma';

export default class AnalyticsRepository {
  static async getQuizSesssions(userId: string) {
    return await prisma.quizSession.findMany({
      where: {
        userId: userId,
      },
      include: {
        responses: true,
      },
    });
  }

  static async getOverview(userId: string) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const [userStats, sessionCount, sessions] = await Promise.all([
      prisma.userStats.findUnique({
        where: { userId },
      }),
      prisma.quizSession.count({
        where: { userId, completedAt: { not: null } },
      }),
      prisma.quizSession.findMany({
        where: {
          userId,
          completedAt: { gte: sevenDaysAgo },
        },
        select: { accuracy: true, completedAt: true },
      }),
    ]);

    return { userStats, sessionCount, sessions };
  }
}
