import 'reflect-metadata';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import ListNotificationsService from './ListNotificationsService';

let listNotifications: ListNotificationsService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('ListNotifications', () => {
  beforeEach(async () => {
    fakeNotificationsRepository = new FakeNotificationsRepository();

    listNotifications = new ListNotificationsService(
      fakeNotificationsRepository,
    );
  });

  it("should be able to list the user's notifications", async () => {
    const notification = await fakeNotificationsRepository.create({
      content: 'test notification',
      recipient_id: 'testuser',
    });

    const notifications = await listNotifications.execute({
      user_id: 'testuser',
    });

    expect(notifications).toEqual([notification]);
  });
});
