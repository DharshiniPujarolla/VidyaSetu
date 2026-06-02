import { startQuizController } from '@/modules/quiz';

export async function POST(request: Request) {
  return startQuizController(request);
}
