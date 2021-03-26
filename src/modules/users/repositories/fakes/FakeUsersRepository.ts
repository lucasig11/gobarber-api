import { v4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

export default class UsersRepository implements IUsersRepository {
  private usersArray: User[] = [];

  public async findByID(id: string): Promise<User | undefined> {
    const user = this.usersArray.find(user => user.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.usersArray.find(user => user.email === email);

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {id: v4()}, userData);

    this.usersArray.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const index = this.usersArray.findIndex(findUser => findUser.id === user.id);

    this.usersArray[index] = user;

    return user;
  }
}
