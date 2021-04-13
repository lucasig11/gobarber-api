import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let createAppointment: CreateAppointmentService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('CreateAppointment', () => {
  beforeEach(async () => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2021, 4, 20, 11).getTime());
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2021, 4, 20, 12),
      provider_id: '13',
      user_id: '1313',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should throw an error on date collisions', async () => {
    await createAppointment.execute({
      date: new Date(2021, 4, 20, 12),
      provider_id: '13',
      user_id: '1313',
    });
    await expect(async () =>
      createAppointment.execute({
        date: new Date(2021, 4, 20, 12),
        provider_id: '13',
        user_id: '1313',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    expect(async () => {
      await createAppointment.execute({
        date: new Date(2021, 4, 20, 9),
        provider_id: '13',
        user_id: '1313',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
