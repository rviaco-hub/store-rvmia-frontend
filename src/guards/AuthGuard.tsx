import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  return getToken() ? children : <Navigate to="/login" />;
}
