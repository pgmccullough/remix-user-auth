import { Link } from "@remix-run/react";
import type { FC } from "react";

export const Nav: FC = () => {
  return (
    <nav>
      <Link to="/example/public-page">Public Page</Link>
      <Link to="">Private Page</Link>
    </nav>
  )
}
