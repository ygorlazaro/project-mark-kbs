import path from "path";
import { ResourceModel } from "./resourceModel";
import { BaseDataStore } from "../../abstracts/baseDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const RESOURCES_FILE = path.join(DATA_FOLDER, "resources.json");

export class ResourceDataStore extends BaseDataStore<ResourceModel> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = RESOURCES_FILE;
}
