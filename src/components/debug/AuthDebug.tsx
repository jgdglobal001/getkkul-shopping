"use client";

import { useAppSession as useSession } from "@/hooks/useAppSession";

const AuthDebug = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-xs text-gray-500">Loading session...</div>;
  }

  if (!session?.user) {
    return <div className="text-xs text-gray-500">No session found</div>;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg max-w-sm z-50">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Name:</strong> {session.user.name || "null"}
        </div>
        <div>
          <strong>Email:</strong> {session.user.email || "null"}
        </div>
        <div>
          <strong>ID:</strong> {session.user.id || "null"}
        </div>
      </div>
      <div className="mt-2 text-xs opacity-70">
        Check console for image loading logs
      </div>
    </div>
  );
};

export default AuthDebug;
