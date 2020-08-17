import ISendMailDTo from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTo): Promise<void>;
}
