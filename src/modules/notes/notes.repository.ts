import { prisma } from '@/lib/prisma';

export class NotesRepository {
  static findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  static createNote(data: {
    userId: string;
    title: string;
    content: string | null;
    fileUrl: string | null;
    extractedText: string | null;
  }) {
    return prisma.note.create({
      data,
      select: {
        id: true,
        title: true,
        content: true,
        fileUrl: true,
        extractedText: true,
        createdAt: true,
      },
    });
  }
}
