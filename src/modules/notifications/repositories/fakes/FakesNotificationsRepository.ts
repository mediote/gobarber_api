import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

class FakesNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    this.notifications.push(notification);

    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    return notification;
  }
}

export default FakesNotificationsRepository;
