import { getMongoRepository, MongoRepository } from 'typeorm';
// import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../schemas/Notification';

export default class NotificationsRepository
  implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async read(id: string): Promise<void> {
    const notification = await this.ormRepository.findOne(id);

    if (notification) {
      notification.read = true;
      await this.ormRepository.save(notification);
    }
  }

  public async list(recipient_id: string): Promise<Notification[]> {
    const notifications = await this.ormRepository.find({
      where: {
        recipient_id,
      },
    });

    return notifications;
  }
}
