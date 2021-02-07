import Appointment from '../infra/typeorm/entities/Appointments';
import ICreateAppointmentDTO from '@appointments/dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
