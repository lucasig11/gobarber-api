import FakeUsersRepository from '@users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let usersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(async () => {
    usersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(usersRepository);
  });

  it('should be able to list the providers, except the local user', async () => {
    const prov1 = await usersRepository.create({
      name: 'Provider1',
      email: 'test@test.com',
      password: '1234',
    });

    const prov2 = await usersRepository.create({
      name: 'Provider2',
      email: 'test2@test.com',
      password: '1234',
    });

    const loggedUser = await usersRepository.create({
      name: 'User',
      email: 'test3@test.com',
      password: '1234',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([prov1, prov2]);
  });
});
