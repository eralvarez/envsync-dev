import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "firebase/auth";

type State = {
  user: User | null;
  hasAuth: boolean | null;
};

type Actions = {
  setUser: (user: User | null) => void;
  setHasAuth: (hasAuth: boolean | null) => void;
};

const useAuth = create<State & Actions>((set) => ({
  user: null,
  hasAuth: null,
  setUser: (user: User | null) => set({ user }),
  setHasAuth: (hasAuth: boolean | null) => set({ hasAuth }),
}));

export { useAuth };
