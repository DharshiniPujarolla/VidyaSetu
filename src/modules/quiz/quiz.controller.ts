import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

import { quizService } from './quiz.service';
import { QuizApiError } from './quiz.types';
import {
  createQuizSchema,
  startQuizSchema,
  submitQuizSchema,
} from './quiz.validator';

const parseJsonBody = async (request: Request) => {
  try {
    return await request.json();
  } catch {
    throw new QuizApiError('Invalid JSON request body', 400);
  }
};

const handleQuizError = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: 'Invalid request body',
        errors: error.issues,
      },
      { status: 400 }
    );
  }

  if (error instanceof QuizApiError) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    {
      message: 'Internal server error',
    },
    { status: 500 }
  );
};

export const createQuizController = async (request: Request) => {
  try {
    const body = await parseJsonBody(request);
    const input = createQuizSchema.parse(body);
    const result = await quizService.createQuiz(input);

    return NextResponse.json(
      {
        message: 'Quiz created successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleQuizError(error);
  }
};

export const startQuizController = async (request: Request) => {
  try {
    const body = await parseJsonBody(request);
    const input = startQuizSchema.parse(body);
    const result = await quizService.startQuiz(input);

    return NextResponse.json(
      {
        message: 'Quiz session started successfully',
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleQuizError(error);
  }
};

export const submitQuizController = async (request: Request) => {
  try {
    const body = await parseJsonBody(request);
    const input = submitQuizSchema.parse(body);
    const result = await quizService.submitQuiz(input);

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      data: result,
    });
  } catch (error) {
    return handleQuizError(error);
  }
};
