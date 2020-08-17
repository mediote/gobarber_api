import AppError from '@shared/errors/AppError';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('IHashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }
    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.genarateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
