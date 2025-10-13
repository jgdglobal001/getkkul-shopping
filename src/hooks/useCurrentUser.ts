import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface NeonUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useCurrentUser(): {
  user: NeonUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  userRole: string;
} {
  const userInfo = useSelector((state: any) => state.getkkul.userInfo);

  return {
    user: userInfo,
    isAdmin: userInfo?.role === "admin",
    isAuthenticated: !!userInfo,
    userId: userInfo?.id || null,
    userRole: userInfo?.role || "user",
  };
}
