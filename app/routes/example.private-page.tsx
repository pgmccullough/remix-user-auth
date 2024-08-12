import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import type { User } from "@prisma/client";

export const meta: MetaFunction = () => {
  return [
    { title: "Init Remix with Auth" },
    { name: "description", content: "Basic starting point for user-based Remix" },
  ];
};

export default function Index() {
  const { user } = useLoaderData<{ user?: User }>() || {};
  return (
    <div>
      <h1>Private</h1>
      <p>Hey, you can only see this because you are logged in as {user!.username}!</p>
      <p>People who are not logged in are redirected to the login page.</p>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return json({ user })
}