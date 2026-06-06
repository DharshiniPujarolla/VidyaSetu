import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import {
  parseNcertQuery,
  requireNcertParam,
} from '@/modules/ncert/ncert.validator';

export async function GET(req: Request) {
  try {
    const query = parseNcertQuery(req.url);
    requireNcertParam(query, ['classId', 'class']);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Invalid NCERT request parameters',
          errors: error.issues,
        },
        { status: 400 }
      );
    }

    throw error;
  }

  return NextResponse.json({ classes: [] });
}
