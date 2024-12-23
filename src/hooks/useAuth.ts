import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { isDevEnv } from "utils/env";
import { useAuth as useStateAuth } from "state/auth";

export function useAuth() {
  const { user, hasAuth, setUser, setHasAuth } = useStateAuth();
  const auth = getAuth();

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

  return {
    user,
    hasAuth,
  };
}
