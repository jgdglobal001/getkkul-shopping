"use client";
import { persistor, store } from "@/redux/store";
// Removed next-auth SessionProvider for custom session hook
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainLoader from "../MainLoader";
import { UserSyncProvider } from "../UserSyncProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        <UserSyncProvider>{children}</UserSyncProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
