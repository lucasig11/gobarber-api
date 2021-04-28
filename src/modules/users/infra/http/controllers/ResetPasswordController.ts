import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@users/services/ResetPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;
    console.log(token);
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password,
    });

    return response.status(204).json();
  }
}
