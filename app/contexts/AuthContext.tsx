import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { type User, getAuth, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";

import PATHS from "constants/paths";
import { isDevEnv } from "utils/env";

interface AuthContextProps {
  user: User | null | undefined;
  hasAuth: boolean | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const auth = getAuth();

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null | undefined>();
  const [hasAuth, setHasAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      const isUserSet = user !== null;
      setHasAuth(isUserSet);

      if (isDevEnv()) {
        console.log(user);
      }
    });

    return () => unsubscribe();
  }, []);

  if (pathname === PATHS.homePath) {
    setTimeout(() => {
      router.replace(PATHS.dashboardPath);
    });
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, hasAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
