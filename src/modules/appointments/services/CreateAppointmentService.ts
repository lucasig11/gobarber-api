import { isBefore, startOfHour, isWithinInterval, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import IAppointmentsRepository from '@appointments/repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointments';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    date,
    user_id,
    provider_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, new Date(Date.now()))) {
      throw new AppError('Invalid date.');
    }

    if (user_id === provider_id) {
      throw new AppError("You can't book an appointment with yourself.");
    }

    if (!isWithinInterval(appointmentDate.getHours(), { start: 8, end: 17 })) {
      throw new AppError('You must book an appointment between 8AM and 5PM');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento marcado para o dia ${formattedDate}`,
    });

    await this.notificationsRepository.create({
      recipient_id: user_id,
      content: `Você marcou um agendamento para o dia ${formattedDate}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'Y-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
