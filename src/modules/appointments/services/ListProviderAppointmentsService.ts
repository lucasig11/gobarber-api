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
    const appointments = this.appointmentsRepository.findByDay({
      provider_id,
      day,
      month,
      year,
    });

    this.cacheProvider.save('asda', 'safd');

    return appointments;
  }
}
