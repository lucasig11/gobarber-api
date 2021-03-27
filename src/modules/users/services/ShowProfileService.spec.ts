import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let usersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(async () => {
    usersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(usersRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await usersRepository.create({
      name: 'TestUser',
      email: 'test@test.com',
      password: '1234',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('TestUser');
    expect(profile.email).toBe('test@test.com');
  });

  it('should throw error on invalid user id', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'invaliduserid',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
