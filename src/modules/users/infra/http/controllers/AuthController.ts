import { Request, Response } from 'express';
import AuthService from '@modules/users/services/AuthService';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

export default class AuthController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authUser = container.resolve(AuthService);

    const { user, token } = await authUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
