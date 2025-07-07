import path from "path";
import { IResource } from "./resource";
import { AbstractDataStore } from "../../abstracts/abstractDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const RESOURCES_FILE = path.join(DATA_FOLDER, "resources.json");

export class ResourceDataStore extends AbstractDataStore<IResource> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = RESOURCES_FILE;
}
