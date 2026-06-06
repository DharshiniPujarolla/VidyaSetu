export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActivityDate: string | null;
  todayActive: boolean;
  calendar: ActivityDay[];
}

export interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export class WeakTopicAnalyticsError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'WeakTopicAnalyticsError';
    this.statusCode = statusCode;
  }
}

export interface WeakTopicResult {
  topicName: string;
  topicId: string;
  accuracy: number;
  attempts: number;
  correctAnswers: number;
}

export interface WeakTopicsResponse {
  topics: WeakTopicResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
