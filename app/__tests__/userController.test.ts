import { createUser } from '~/controllers/userController';
import { prisma } from '~/models/prismaClient';
import { hash } from '~/utils/passwordUtils';

jest.mock('~/models/prismaClient', () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('~/utils/passwordUtils', () => ({
  hash: jest.fn().mockResolvedValue({ salt: 'mockSalt', derivedKey: 'mockDerivedKey' }),
}));

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: 1, username: 'testuser', email: 'test@example.com', password: 'mockDerivedKey', salt: 'mockSalt' });
    (prisma.user.create as jest.Mock) = mockCreate;
    const user = await createUser('testuser', 'test@example.com', 'password');

    expect(user).toEqual({ id: 1, username: 'testuser', email: 'test@example.com', password: 'mockDerivedKey', salt: 'mockSalt' });
    expect(hash).toHaveBeenCalledWith('password');
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'mockDerivedKey',
        salt: 'mockSalt',
      },
    });
  });

  // Add more tests for deleteUser, getUserById, and getAllUsers...
});
