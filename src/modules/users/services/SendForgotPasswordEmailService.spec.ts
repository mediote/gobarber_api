import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPassworEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPassworEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });
  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await sendForgotPassworEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPassworEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should genarate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123123',
    });

    await sendForgotPassworEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
