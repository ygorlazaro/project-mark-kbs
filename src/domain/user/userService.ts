import { BaseService } from "../../abstracts/baseService";
import { UserModel } from "./userModel";
import { UserRepository } from "./userRepository";

export class UserService extends BaseService<UserModel, UserRepository> {

  public findByEmail(email: string): UserModel | undefined {
    return this.repository.findByEmail(email);
  }

  constructor(repository: UserRepository) {
    super(repository);
  }
}
