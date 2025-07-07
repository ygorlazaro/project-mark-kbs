import path from "path";
import { TopicModel } from "./topicModel";
import { BaseDataStore } from "../../abstracts/baseDataStore";

const DATA_FOLDER = process.env.DATA_FOLDER || "./data";
const TOPICS_FILE = path.join(DATA_FOLDER, "topics.json");

export class TopicDataStore extends BaseDataStore<TopicModel> {
    protected dataFolder = DATA_FOLDER;
    protected filePath = TOPICS_FILE;
}
