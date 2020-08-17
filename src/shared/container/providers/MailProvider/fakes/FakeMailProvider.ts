import IMailProvider from '../models/IMailProvider';
import ISendMailDTo from '../dtos/ISendMailDTO';

export default class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTo[] = [];

  public async sendMail(message: ISendMailDTo): Promise<void> {
    this.messages.push(message);
  }
}
