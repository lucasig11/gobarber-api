// import { getDate, getDaysInMonth } from 'date-fns';
import { getHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProvidersDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findByDay({
      provider_id,
      day,
      month,
      year,
    });

    const hourStart = 8;

    const dayArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = dayArray.map(hour => {
      const isAppointmentTaken = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      return {
        hour,
        available:
          !isAppointmentTaken &&
          isAfter(new Date(year, month - 1, day, hour), new Date(Date.now())),
      };
    });

    return availability;
  }
}
