import { BaseDataStore } from "./baseDataStore";
import { BaseModel } from "./baseModel";

export abstract class BaseRepository<TType extends BaseModel> {

    constructor(protected data: BaseDataStore<TType>) {

    }

    public create(item: TType): TType {
        const collection = this.data.read();

        collection.push(item);
        this.data.write(collection);

        return item;
    }

    public findById(id: string): TType | undefined {
        const collection = this.data.read();

        return collection.find(r => r.id === id);
    }

    public findAll(): TType[] {
        return this.data.read();
    }

    public update(id: string, item: Partial<TType>): TType | undefined {
        const collection = this.data.read();
        const index = collection.findIndex(r => r.id === id);

        if (index === -1) {
            return undefined;
        }

        const existing = collection[index];
        const updatedItem: TType = {
            ...existing,
            ...item,
            updatedAt: new Date(),
        };

        collection[index] = updatedItem;
        this.data.write(collection);

        return updatedItem;
    }

    public delete(id: string): boolean {
        const collection = this.data.read();
        const index = collection.findIndex(r => r.id === id);

        if (index === -1) {
            return false;
        }

        collection.splice(index, 1);
        this.data.write(collection);

        return true;
    }
}
