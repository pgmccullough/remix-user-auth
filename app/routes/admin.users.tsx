import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
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
    console.log(user)
    // need to check for role
    return (
        <div>
        <h1>Users</h1>
        <p>List of users.</p>
        </div>
    );
}

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request);
    return json({ user })
}