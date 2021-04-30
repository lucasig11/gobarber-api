import { injectable, inject } from 'tsyringe';

import INotificationsRepository from '../repositories/INotificationsRepository';
import Notification from '../infra/typeorm/schemas/Notification';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListNotificationsService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Notification[]> {
    const notifications = await this.notificationsRepository.list(user_id);

    return notifications;
  }
}
