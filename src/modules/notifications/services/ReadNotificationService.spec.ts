import 'reflect-metadata';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import ReadNotificationService from './ReadNotificationService';

let readNotification: ReadNotificationService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('ReadNotification', () => {
  beforeEach(async () => {
    fakeNotificationsRepository = new FakeNotificationsRepository();

    readNotification = new ReadNotificationService(fakeNotificationsRepository);
  });

  it('should be able to read the notification', async () => {
    const notification = await fakeNotificationsRepository.create({
      content: 'test notification',
      recipient_id: 'testuser',
    });

    await readNotification.execute({
      notification_id: notification.id.toString(),
    });

    const notifications = await fakeNotificationsRepository.list('testuser');

    expect(notifications[0]).toHaveProperty('read', true);
  });
});
