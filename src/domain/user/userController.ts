import { Request, Response } from "express";
import { UserSchema } from "./user";
import { UserService } from "./userService";

export class UserController {
  constructor(private service: UserService) {
  }

  createUser = (req: Request, res: Response)  => {
    const parse = UserSchema.safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors });

      return;
    }

    const user = this.service.createUser(parse.data);

    res.status(201).json(user);
  };

  getUserById = (req: Request, res: Response) => {
    const user = this.service.getUserById(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      
      return;
    }

    res.json(user);
  };

}
