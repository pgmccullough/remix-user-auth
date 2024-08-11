import { Prisma } from '@prisma/client';

export const handlePrismaError = (error: unknown): string => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return `PrismaClientKnownRequestError: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return `PrismaClientUnknownRequestError: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    return `PrismaClientRustPanicError: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    return `PrismaClientInitializationError: ${error.message}`;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return `PrismaClientValidationError: ${error.message}`;
  } else if (error instanceof Error) {
    return `Error: ${error.message}`;
  } else {
    return 'An unknown error occurred.';
  }
};
