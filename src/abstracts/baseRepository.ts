import { BaseDataStore } from "./baseDataStore";
import { BaseModel } from "./baseModel";

export abstract class BaseRepository<TModel extends BaseModel> {

    constructor(
        protected data: BaseDataStore<TModel>,
    ) {
    }

    public create(item: TModel): TModel {
        const collection = this.data.read();

        item.id = this.nextId();
        item.createdAt = new Date();
        item.updatedAt = new Date();

        collection.push(item);
        this.data.write(collection);

        return item;
    }

    public findById(id: number): TModel | undefined {
        const collection = this.data.read();

        return collection.find(r => r.id === id);
    }

    public findAll(): TModel[] {
        return this.data.read();
    }

    public update(id: number, item: Partial<TModel>): TModel | undefined {
        const collection = this.data.read();
        const index = collection.findIndex(r => r.id === id);

        if (index === -1) {
            return undefined;
        }

        const existing = collection[index];
        const updatedItem: TModel = {
            ...existing,
            ...item,
            updatedAt: new Date(),
        };

        collection[index] = updatedItem;
        this.data.write(collection);

        return updatedItem;
    }

    public delete(id: number): boolean {
        const collection = this.data.read();
        const index = collection.findIndex(r => r.id === id);

        if (index === -1) {
            return false;
        }

        collection.splice(index, 1);
        this.data.write(collection);

        return true;
    }

    private nextId(): number {
        const collection = this.data.read();
        const maxId = collection.reduce((max, item) => Math.max(max, item.id), 0);

        return maxId + 1;
    }

}
