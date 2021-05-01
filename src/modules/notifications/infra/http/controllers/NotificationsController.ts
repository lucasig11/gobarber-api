import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListNotificationsService from '@modules/notifications/services/ListNotificationsService';
import DeleteNotificationService from '@modules/notifications/services/DeleteNotificationService';
import ReadNotificationService from '@modules/notifications/services/ReadNotificationService';

export default class NotificationsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listNotifications = container.resolve(ListNotificationsService);

    const notifications = await listNotifications.execute({ user_id });

    return response.json(notifications);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { notification_id } = request.query;

    const deleteNotification = container.resolve(DeleteNotificationService);

    if (notification_id) {
      await deleteNotification.execute({
        notification_id: notification_id.toString(),
      });
    }

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { notification_id } = request.body;

    const readNotification = container.resolve(ReadNotificationService);

    await readNotification.execute({ notification_id });

    return response.status(204).json();
  }
}
