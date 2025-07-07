import { UserModel } from "./userModel";
import { UserDataStore } from "./userDataStore";
import { BaseRepository } from "../../abstracts/baseRepository";

export class UserRepository extends BaseRepository<UserModel> {

  public findByEmail(email: string): UserModel | undefined {
    const collection = this.data.read();

    return collection.find(u => u.email === email);
  }

  constructor(data: UserDataStore) {
    super(data);
  }
}
