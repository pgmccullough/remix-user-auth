import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import { getUserBy } from "~/controllers/userController";
import { verify } from "~/utils/passwordUtils";

export const authenticator = new Authenticator<User | null>(sessionStorage, {
    sessionErrorKey: "errorKey",
});

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const username = form.get("username") as string;
        const password = form.get("password") as string;
        if (!username || !password) {
            throw new Error("Username and password are required.");
        }
        const user = await getUserBy('username',username);
        if (!user) {
            throw new Error("User not found.");
        }
        const passwordCheck = await verify(password, user.password, user.salt);
        if (!passwordCheck) {
            throw new Error("Incorrect password.");
        }

        return user;
    }),
    "user-pass"
);