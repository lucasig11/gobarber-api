import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let createAppointment: CreateAppointmentService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2021, 4, 20, 11).getTime());
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2021, 4, 20, 12),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
  });

  it('should throw an error on date collisions', async () => {
    await createAppointment.execute({
      user_id: 'user-id',
      provider_id: 'provider-id',
      date: new Date(2021, 4, 20, 12),
    });

    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: new Date(2021, 4, 20, 12),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: new Date(2021, 4, 20, 9),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw an error if the user is his own provider', async () => {
    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'user-id',
        date: new Date(2021, 4, 20, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw an error if date is out of boundaries (8am - 5pm)', async () => {
    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: new Date(2021, 5, 20, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        user_id: 'user-id',
        provider_id: 'provider-id',
        date: new Date(2021, 5, 20, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
