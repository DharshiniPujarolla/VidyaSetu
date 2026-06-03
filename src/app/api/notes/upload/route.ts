import { NotesControllers } from '@/modules/notes/notes.controller';

export async function POST(request: Request) {
  return NotesControllers.upload(request);
}
