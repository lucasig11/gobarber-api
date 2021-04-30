import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    this.notifications.push(notification);

    return notification;
  }

  public async delete(id: string): Promise<void> {
    this.notifications = this.notifications.filter(
      notification => notification.id.toString() !== id,
    );
  }

  public async read(id: string): Promise<void> {
    const notification = this.notifications.findIndex(
      n => n.id.toString() === id,
    );
    this.notifications[notification].read = true;
  }

  public async list(user_id: string): Promise<Notification[]> {
    const notifications = this.notifications.filter(notification => {
      return notification.recipient_id === user_id;
    });

    return notifications;
  }
}
