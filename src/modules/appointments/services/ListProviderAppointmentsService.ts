import { injectable, inject } from 'tsyringe';
import Appointment from '../infra/typeorm/entities/Appointments';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  day: number;
  year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const key = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.retrieve<Appointment[]>(key);

    if (!appointments) {
      appointments = await this.appointmentsRepository.findByDay({
        provider_id,
        day,
        month,
        year,
      });

      await this.cacheProvider.save(key, appointments);
    }

    return appointments;
  }
}
