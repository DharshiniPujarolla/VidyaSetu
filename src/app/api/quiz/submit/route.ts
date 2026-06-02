import { submitQuizController } from '@/modules/quiz';

export async function POST(request: Request) {
  return submitQuizController(request);
}
