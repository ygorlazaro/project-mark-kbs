import path from "path";
import { ITopic } from "./topic";
import { AbstractDataStore } from "../../abstracts/abstractDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const TOPICS_FILE = path.join(DATA_FOLDER, "topics.json");

export class TopicDataStore extends AbstractDataStore<ITopic> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = TOPICS_FILE;
}
