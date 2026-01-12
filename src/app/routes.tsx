import type { RouteObject } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Dashboard from "../pages/admin/Dashboard";
import AuthGuard from "../guards/AuthGuard";
import RoleGuard from "../guards/RoleGuard";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/cart", element: <Cart /> },
  {
    path: "/checkout",
    element: (
      <AuthGuard>
        <Checkout />
      </AuthGuard>
    )
  },
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <RoleGuard role="admin">
          <Dashboard />
        </RoleGuard>
      </AuthGuard>
    )
  }
];

export default routes;
