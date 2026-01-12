import { useAuthStore } from "../store/auth.store";

export default function RoleGuard({
  role,
  children
}: {
  role: string;
  children: JSX.Element;
}) {
  const user = useAuthStore(s => s.user);
  return user?.role === role ? children : null;
}
