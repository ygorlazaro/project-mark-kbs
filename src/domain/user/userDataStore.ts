import path from "path";
import { UserModel } from "./userModel";
import { BaseDataStore } from "../../abstracts/baseDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const USERS_FILE = path.join(DATA_FOLDER, "users.json");

export class UserDataStore extends BaseDataStore<UserModel> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = USERS_FILE;
}
