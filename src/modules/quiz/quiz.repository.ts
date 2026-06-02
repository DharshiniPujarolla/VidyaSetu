import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export const quizRepository = {
  findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  },

  findChapterById(chapterId: string) {
    return prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { id: true },
    });
  },

  findTopicById(topicId: string) {
    return prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });
  },

  findNoteById(noteId: string, userId: string) {
    return prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
        deletedAt: null,
      },
      select: { id: true },
    });
  },

  findQuestionsByChapter(chapterId: string, take: number) {
    return prisma.question.findMany({
      where: {
        topic: {
          chapterId,
        },
      },
      take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        topicId: true,
        type: true,
        difficulty: true,
        questionText: true,
        explanation: true,
        options: {
          select: {
            id: true,
            label: true,
            value: true,
          },
        },
      },
    });
  },

  findQuestionsByTopic(topicId: string, take: number) {
    return prisma.question.findMany({
      where: { topicId },
      take,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        topicId: true,
        type: true,
        difficulty: true,
        questionText: true,
        explanation: true,
        options: {
          select: {
            id: true,
            label: true,
            value: true,
          },
        },
      },
    });
  },

  createQuiz(data: Prisma.QuizUncheckedCreateInput) {
    return prisma.quiz.create({ data });
  },

  findQuizById(quizId: string) {
    return prisma.quiz.findUnique({
      where: { id: quizId },
    });
  },

  createSession(data: Prisma.QuizSessionUncheckedCreateInput) {
    return prisma.quizSession.create({ data });
  },

  findSessionById(sessionId: string) {
    return prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: true,
      },
    });
  },

  findQuestionById(questionId: string) {
    return prisma.question.findUnique({
      where: { id: questionId },
      select: {
        id: true,
        type: true,
      },
    });
  },

  findOptionById(optionId: string) {
    return prisma.option.findUnique({
      where: { id: optionId },
      select: {
        id: true,
        questionId: true,
        isCorrect: true,
      },
    });
  },

  createQuestionResponses(data: Prisma.QuestionResponseCreateManyInput[]) {
    return prisma.questionResponse.createMany({ data });
  },

  updateSession(
    sessionId: string,
    data: Prisma.QuizSessionUncheckedUpdateInput
  ) {
    return prisma.quizSession.update({
      where: { id: sessionId },
      data,
    });
  },
};
