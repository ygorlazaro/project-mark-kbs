import { Request, Response } from "express";
import { signToken } from "../../services/authService";
import { UserModel, UserSchema } from "./userModel";
import { UserService } from "./userService";

export class UserController {
  constructor(private service: UserService) { }

  signIn = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });

      return;
    }

    const user = this.service.findByEmail(email);

    if (!user) {
      res.status(401).json({ error: "Invalid email or user not found" });

      return;
    }

    try {
      const token = await signToken(user);

      res.json({ token });
    } catch {
      res.status(500).json({ error: "Failed to sign token" });
    }
  };

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
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });

      return;
    }

    const user = this.service.findById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });

      return;
    }

    res.json(user);
  };

  update = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });

      return;
    }

    const parse = UserSchema.partial().safeParse(req.body);

    if (!parse.success) {
      res.status(400).json({ error: parse.error.errors });

      return;
    }

    const updatedUser = this.service.update(id, parse.data);

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });

      return;
    }

    res.json(updatedUser);
  };

  delete = (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID format" });

      return;
    }

    const success = this.service.delete(id);

    if (!success) {
      res.status(404).json({ error: "User not found" });

      return;
    }

    res.status(204).send();
  };
}
