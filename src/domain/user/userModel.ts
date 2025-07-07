import z from "zod";
import { BaseModel } from "../../abstracts/baseModel";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: John Doe
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           enum: [Admin, Editor, Viewer]
 *           description: The user's role.
 *           example: Admin
 *       required:
 *         - name
 *         - email
 *         - role
 */
export class UserModel extends BaseModel {
    name: string = "";
    email: string = "";
    role: "Admin" | "Editor" | "Viewer" = "Viewer";
}

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    role: z.enum(["Admin", "Editor", "Viewer"])
});
