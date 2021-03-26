import 'reflect-metadata'
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '131313131313',
    });

    expect(appointment).toHaveProperty('id');
  });

  test("should throw an error on date collisions", async() => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '13',
    });

    expect(async ()  => {
      await createAppointment.execute({
        date: appointmentDate,
        provider_id: '13',
      })
    }).rejects.toBeInstanceOf(AppError);
  });
});