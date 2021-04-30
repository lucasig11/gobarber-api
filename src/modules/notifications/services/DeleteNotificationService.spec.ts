import 'reflect-metadata';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import DeleteNotificationService from './DeleteNotificationService';

let deleteNotification: DeleteNotificationService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('DeleteNotification', () => {
  beforeEach(async () => {
    fakeNotificationsRepository = new FakeNotificationsRepository();

    deleteNotification = new DeleteNotificationService(
      fakeNotificationsRepository,
    );
  });

  it('should be able to delete the notification', async () => {
    const notification = await fakeNotificationsRepository.create({
      content: 'test notification',
      recipient_id: 'testuser',
    });

    await deleteNotification.execute({
      notification_id: notification.id.toString(),
    });

    const notifications = await fakeNotificationsRepository.list('testuser');

    expect(notifications).toEqual([]);
  });
});
