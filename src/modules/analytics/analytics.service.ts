import { prisma } from '@/lib/prisma';
import AnalyticsRepository from './analytics.repository';

export default class AnalyticsService {
  static async analytics(userId: string) {
    const { userStats, sessionCount, sessions } =
      await AnalyticsRepository.getOverview(userId);

    const totalAttempts = sessionCount;

    // Derived overall accuracy from totalCorrect / totalQuestions with guard
    const accuracy =
      userStats && userStats.totalQuestions > 0
        ? Number(
            ((userStats.totalCorrect / userStats.totalQuestions) * 100).toFixed(
              2
            )
          )
        : 0;

    const currentStreak = userStats?.currentStreak ?? 0;
    const longestStreak = userStats?.longestStreak ?? 0;
    const lastActivity = userStats?.lastActivityDate?.toISOString() ?? null;

    // Last 7 calendar days in UTC (ending with today)
    const dailyActivity = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const activeDaysSet = new Set(
      sessions
        .map((s) => s.completedAt)
        .filter((d): d is Date => d !== null)
        .map((d) => {
          const copy = new Date(d);
          copy.setUTCHours(0, 0, 0, 0);
          return copy.getTime();
        })
    );

    const mappedDailyActivity = dailyActivity.map((date) => {
      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'UTC',
      });
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      });
      return {
        day: dayName,
        date: dateStr,
        active: activeDaysSet.has(date.getTime()),
      };
    });

    return {
      totalAttempts,
      accuracy,
      currentStreak,
      longestStreak,
      lastActivity,
      dailyActivity: mappedDailyActivity,
    };
  }

  static async updateStatsAndStreak(
    userId: string,
    session: { totalQuestions: number; correctCount: number },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tx?: any
  ) {
    const client = tx || prisma;
    const today = new Date();
    const getStartOfDay = (date: Date) => {
      const d = new Date(date);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    };
    const todayStart = getStartOfDay(today);

    const stats = await client.userStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      // Create path: first quiz ever starts with streak 1
      return await client.userStats.create({
        data: {
          userId,
          totalSessions: 1,
          totalQuestions: session.totalQuestions,
          totalCorrect: session.correctCount,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
        },
      });
    }

    // Update path
    let newCurrentStreak = stats.currentStreak;
    let newLongestStreak = stats.longestStreak;

    if (!stats.lastActivityDate) {
      newCurrentStreak = 1;
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
    } else {
      const lastActivityStart = getStartOfDay(stats.lastActivityDate);
      const diffTime = todayStart.getTime() - lastActivityStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      } else if (diffDays > 1) {
        newCurrentStreak = 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }
      // If diffDays === 0, keep same streak
    }

    return await client.userStats.update({
      where: { userId },
      data: {
        totalSessions: stats.totalSessions + 1,
        totalQuestions: stats.totalQuestions + session.totalQuestions,
        totalCorrect: stats.totalCorrect + session.correctCount,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: today,
      },
    });
  }
}
