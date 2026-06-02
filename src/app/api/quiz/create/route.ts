import { createQuizController } from '@/modules/quiz';

export async function POST(request: Request) {
  return createQuizController(request);
}
