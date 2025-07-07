import { BaseRepository } from "./baseRepository";
import { BaseModel } from "./baseModel";

export abstract class BaseService<TModel extends BaseModel, TRepository extends BaseRepository<TModel>> {
    constructor(protected repository: TRepository) {
        
    }

    public create(item: TModel): TModel {
        return this.repository.create(item);
    }

    public findById(id: number): TModel | undefined {
        return this.repository.findById(id);
    }

    public findAll(): TModel[] {
        return this.repository.findAll();
    }

    public update(id: number, item: Partial<TModel>): TModel | undefined {
        return this.repository.update(id, item);
    }

    public delete(id: number): boolean {
        return this.repository.delete(id);
    }
}
