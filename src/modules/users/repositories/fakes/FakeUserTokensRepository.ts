import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { v4 } from 'uuid';

import UserToken from '../../infra/typeorm/entities/UserToken';

export default class FakeUserTokensRepository implements IUsersTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      created_at: Date.now(),
      updated_at: Date.now(),
      user_id,
    })

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(t => t.token === token);

    return userToken;
  }
}
