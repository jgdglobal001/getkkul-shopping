import { useEffect } from "react";
import { useAppSession as useSession } from "@/hooks/useAppSession";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "@/redux/getkkulSlice";
import type { RootState } from "@/redux/store";
import type { GetkkulState } from "@/redux/getkkulSlice";

export function useUserSync() {
  const { data: session, status } = useSession();
  const isPending = status === "loading";
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.getkkul.userInfo);

  useEffect(() => {
    const syncUserData = async () => {
      if (isPending) return;

      if (session?.user?.id) {
        // If we don't have user data in store or the session ID doesn't match
        if (!userInfo || userInfo.id !== session.user.id) {
          try {
            const response = await fetch('/api/user/current');
            const firestoreUser = await response.json();
            if (response.ok && firestoreUser) {
              dispatch(addUser(firestoreUser));
            } else {
              // Fallback to session data
              const sessionUser = {
                id: session.user.id,
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
                role: session.user.role || "user",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                emailVerified: true,
                profile: {
                  firstName: session.user.name?.split(" ")[0] || "",
                  lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
                  phone: "",
                  addresses: [],
                },
                preferences: {
                  newsletter: false,
                  notifications: true,
                },
                cart: [],
                wishlist: [],
                orders: [],
              };
              dispatch(addUser(sessionUser));
            }
          } catch (error) {
            console.error("Error syncing user data:", error);
          }
        }
      } else if (!session?.user) {
        // Clear user data when logged out
        if (userInfo) {
          dispatch(removeUser());
        }
      }
    };

    syncUserData();
  }, [session, isPending, dispatch, userInfo]);

  return {
    user: userInfo,
    session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
  };
}
