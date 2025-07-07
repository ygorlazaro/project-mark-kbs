export class BaseModel {
    private static nextId: number = 1;
    id: number;
    createdAt: Date;
    updatedAt: Date;

    constructor() {
        this.id = BaseModel.nextId++;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static resetId() {
        BaseModel.nextId = 1;
    }
}
