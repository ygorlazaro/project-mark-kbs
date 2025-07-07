import { BaseService } from "../../abstracts/baseService";
import { UserModel } from "./userModel";
import { UserRepository } from "./userRepository";

export class UserService extends BaseService<UserModel, UserRepository> {

  constructor(repository: UserRepository) {
    super(repository);
  }
}
