import 'reflect-metadata';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAvailabilityService: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAvailabilityService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the provider appointments', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2021, 4, 13, 10),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2021, 4, 13, 11),
    });

    const appointments = await listProviderAvailabilityService.execute({
      provider_id: 'provider-id',
      day: 13,
      month: 5,
      year: 2021,
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
