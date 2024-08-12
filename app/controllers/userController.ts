import { prisma } from '~/models/prismaClient';
import { handlePrismaError } from '~/utils/prismaErrors';
import { hash } from '~/utils/passwordUtils';
import { numberGen } from '~/utils/numberGen';

export const createUser = async (username: string, email: string, password: string) => {
  try {
    const { salt, derivedKey } = await hash(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: derivedKey,
        salt,
        confirmCode: numberGen(6)
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${handlePrismaError(error)}`);
  }
};

export const deleteUser = async (userId: number) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    throw new Error(`Error deleting user: ${handlePrismaError(error)}`);
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    return await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
  } catch (error) {
    throw new Error(`Error fetching user: ${handlePrismaError(error)}`);
  }
};

export const getAllUsers = async () => {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    throw new Error(`Error fetching users: ${handlePrismaError(error)}`);
  }
};
