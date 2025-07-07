import z from "zod";
import { BaseModel } from "../../abstracts/baseModel";

/** 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [Admin, Editor, Viewer]
 *         createdAt:
 *           type: string
 *           format: date-time
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
