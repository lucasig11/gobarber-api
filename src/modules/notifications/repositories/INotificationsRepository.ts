// import { ObjectID } from 'mongodb';
import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../infra/typeorm/schemas/Notification';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
  list(user_id: string): Promise<Notification[]>;
  delete(id: string): Promise<void>;
  read(id: string): Promise<void>;
}
