import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf@asdf.com', password: 'asdf' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'adsf' } as User]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUser returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a user if it exists', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throw a NotFoundException when not found a user with the id provided', async () => {
    fakeUsersService.findOne = (id: number) => Promise.resolve(null);
    await expect(controller.findUser('2')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin({ email: 'asd@asd.com', password: 'asdf' }, session);
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
