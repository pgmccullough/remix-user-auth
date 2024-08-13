import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import type { User } from "@prisma/client";
import { getAllUsers } from '~/controllers/userController'

export const meta: MetaFunction = () => {
  return [
    { title: "Init Remix with Auth" },
    { name: "description", content: "Basic starting point for user-based Remix" },
  ];
};

export default function Index() {
  const { user, userList } = useLoaderData<{ user?: User, userList?: Array<User> }>() || {}

  if(user.role !== "admin") console.log("you should not have access to this...");

  return (
    <div>
      <h1>Users</h1>
      <p>List of users.</p>
      {userList?.map(userLi => (
        <div key={userLi.id}>
          <div>{userLi.id}</div>
          <div>{userLi.username}</div>
          <div>{userLi.email}</div>
          <div>{userLi.role}</div>
          <div>{String(userLi.confirmed)}</div>
          <div>{userLi.createdAt}</div>
          <div>{userLi.updatedAt}</div>
        </div>
      ))}
    </div>
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  const userList = await getAllUsers()
  return json({ user, userList })
}