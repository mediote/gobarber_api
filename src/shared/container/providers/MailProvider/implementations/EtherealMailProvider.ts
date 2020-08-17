import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTo from '../dtos/ISendMailDTO';

interface IMessage {
  to: string;
  body: string;
}

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProivider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const trasnporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
      this.client = trasnporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTo): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe Gobarber',
        address: from?.email || 'mediote90@gmail.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProivider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL : %S', nodemailer.getTestMessageUrl(message));
  }
}
