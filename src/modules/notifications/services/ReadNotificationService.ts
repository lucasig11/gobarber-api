import { injectable, inject } from 'tsyringe';

import INotificationsRepository from '../repositories/INotificationsRepository';

interface IRequest {
  notification_id: string;
}

@injectable()
export default class DeleteNotificationsService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({ notification_id }: IRequest): Promise<void> {
    await this.notificationsRepository.read(notification_id);
  }
}
