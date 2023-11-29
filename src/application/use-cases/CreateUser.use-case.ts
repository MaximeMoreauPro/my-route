import { User } from '@/domain/User.js';
import { IdProvider } from '@/application/providers/IdProvider.js';
import { UserRepository } from '@/application/repositories/UserRepository.js';

export type CreateUserCommand = Omit<User, 'id'>;

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider
  ) {}

  async handle(createUserCommand: CreateUserCommand): Promise<void> {
    await this.userRepository.save({
      id: this.idProvider.getId(),
      ...createUserCommand,
    });
  }
}
