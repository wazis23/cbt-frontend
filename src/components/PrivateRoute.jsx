import { getRole } from "../utils/auth";

export default function PrivateRoute({ children, role }) {
  const userRole = getRole();

  if (!userRole) {
    window.location.href = "/";
    return null;
  }

  if (role && userRole !== role) {
    alert("Tidak punya akses");
    window.location.href = "/";
    return null;
  }

  return children;
}