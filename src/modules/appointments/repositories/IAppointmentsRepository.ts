import ICreateAppointmentDTO from '@appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '../dtos/IFindByMonthDTO';
import IFindByDayDTO from '../dtos/IFindByDayDTO';
import Appointment from '../infra/typeorm/entities/Appointments';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findByMonth(date: IFindByMonthDTO): Promise<Appointment[]>;
  findByDay(date: IFindByDayDTO): Promise<Appointment[]>;
}
