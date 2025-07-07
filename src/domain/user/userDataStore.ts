import path from "path";
import { IUser } from "./user";
import { AbstractDataStore } from "../../abstracts/abstractDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const USERS_FILE = path.join(DATA_FOLDER, "users.json");

export class UserDataStore extends AbstractDataStore<IUser> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = USERS_FILE;
}
