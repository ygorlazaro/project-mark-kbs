import { UserModel } from "./userModel";
import { UserDataStore } from "./userDataStore";
import { BaseRepository } from "../../abstracts/baseRepository";

export class UserRepository extends BaseRepository<UserModel> {

  constructor(data: UserDataStore) {
    super(data);
  }
}
