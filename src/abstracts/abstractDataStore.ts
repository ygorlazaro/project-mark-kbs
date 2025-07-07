import fs from "fs";
import { ensureDataFile } from "../utils/ensureDataFile";

export abstract class AbstractDataStore<T> {
    protected abstract dataFolder: string;
    protected abstract filePath: string;

    read(): T[] {
        ensureDataFile(this.dataFolder, this.filePath);
        const data = fs.readFileSync(this.filePath, "utf-8");

        return JSON.parse(data) as T[];
    }

    write(dataArr: T[]): void {
        ensureDataFile(this.dataFolder, this.filePath);
        fs.writeFileSync(this.filePath, JSON.stringify(dataArr, null, 2), "utf-8");
    }
}
