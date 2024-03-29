import { User } from '../../domain/User';
import { IdProvider } from '../providers/IdProvider';
import { UserRepository } from '../repositories/UserRepository';

export type CreateUserCommand = Omit<User, 'id'>;

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider,
  ) {}

  async handle(createUserCommand: CreateUserCommand): Promise<void> {
    await this.userRepository.save({
      id: this.idProvider.getId(),
      ...createUserCommand,
    });
  }
}
