import { User } from '../../domain/User';
import { IdProvider } from '../IdProvider';
import { UserRepository } from '../UserRepository';

export type CreateUserCommand = Omit<User, 'id'>;

export class CreateUserUseCase {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _idProvider: IdProvider
  ) {}

  async handle(createUserCommand: CreateUserCommand): Promise<void> {
    await this._userRepository.save({
      id: this._idProvider.getId(),
      ...createUserCommand,
    });
  }
}
