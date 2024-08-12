import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser } from "~/controllers/userController";
import { handlePrismaError } from "~/utils/prismaErrors";

type ActionData = {
  error?: string;
};

export const action = async ({ request }: { request: Request }) => {
  const formData = new URLSearchParams(await request.text());
  const username = formData.get("username") || "";
  const email = formData.get("email") || "";
  const password = formData.get("password") || "";

  if (!username || !email || !password) {
    return json<ActionData>({ error: "All fields are required" }, { status: 400 });
  }

  // check if username or email are already registered

  try {
    await createUser(username, email, password);
    return redirect("/login");
  } catch (error) {
    return json<ActionData>({ error: `Error creating user: ${handlePrismaError(error)}` }, { status: 500 });
  }
};

export default function Register() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Register</h1>
      <Form method="post">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" name="username" id="username" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" />
        </div>
        {actionData?.error && <div style={{ color: "red" }}>{actionData.error}</div>}
        <button type="submit">Register</button>
      </Form>
    </div>
  );
}
