import { BaseRepository } from "./baseRepository";
import { BaseModel } from "./baseModel";

export abstract class BaseService<TType extends BaseModel, TRepository extends BaseRepository<TType>>  {
    constructor(protected repository: TRepository) {
        
    }

    public create(item: TType): TType {
        return this.repository.create(item);
    }

    public findById(id: string): TType | undefined {
        return this.repository.findById(id);
    }

    public findAll(): TType[] {
        return this.repository.findAll();
    }

    public update(id: string, item: Partial<TType>): TType | undefined {
        return this.repository.update(id, item);
    }

    public delete(id: string): boolean {
        return this.repository.delete(id);
    }
}
