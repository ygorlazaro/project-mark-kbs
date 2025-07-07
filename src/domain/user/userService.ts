import { UserInput, IUser } from "./user";
import { UserRepository } from "./userRepository";

export class UserService {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  createUser(data: UserInput): IUser {
    return this.repository.create(data);
  }

  getUserById(id: string): IUser | undefined {
    return this.repository.findById(id);
  }
}
