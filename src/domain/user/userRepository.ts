import { v4 as uuidv4 } from "uuid";
import { UserInput, IUser } from "./user";
import { UserDataStore } from "./userDataStore";

export class UserRepository {

  constructor(private userDate: UserDataStore) {
    
  }

  create(user: UserInput): IUser {
    const users =this.userDate.read();
    const newUser: IUser = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
    };

    users.push(newUser);
    this.userDate.write(users);

    return newUser;
  }

  findById(id: string): IUser | undefined {
    const users = this.userDate.read();

    return users.find(u => u.id === id);
  }
}
