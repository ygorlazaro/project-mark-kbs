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

  public create(item: UserModel): UserModel {
    const emailExists = this.findByEmail(item.email);

    if (emailExists) {
      throw new Error("Email already exists");
    }

    return super.create(item);
  }
}
