import { Request, Response } from "express";
import { UserModel, UserSchema } from "./userModel";
import { UserService } from "./userService";

export class UserController {
  constructor(private service: UserService) {
  }

  create = (req: Request, res: Response) => {
    const parse = UserSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors });

      return;
    }

    const user = this.service.create(parse.data as UserModel);

    res.status(201).json(user);
  };

  findById = (req: Request, res: Response) => {
    const user = this.service.findById(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      
      return;
    }

    res.json(user);
  };

}
