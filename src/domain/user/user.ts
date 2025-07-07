import z from "zod";

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
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "Editor" | "Viewer";
    createdAt: Date;
}

export const UserSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email format"),
    role: z.enum(["Admin", "Editor", "Viewer"])
});

export type UserInput = z.infer<typeof UserSchema>;
