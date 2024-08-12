import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.REMIX_AUTH_SECRET || ""],
    secure: process.env.NODE_ENV === "production",
  },
});

export default sessionStorage;
export const { getSession, commitSession, destroySession } = sessionStorage;