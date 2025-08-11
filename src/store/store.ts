import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import createSelectors from "./selectors";

type AuthState = {
  accessToken: string | null;
  user: null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  isAuthenticated: () => boolean;
};

const createAuthSlice: StateCreator<AuthState> = (set, get) => ({
  accessToken: null,
  user: null,
  setAccessToken: (token) => {
    set({ accessToken: token });
  },
  clearAccessToken: () => {
    set({ accessToken: null });
  },
  isAuthenticated: () => {
    const token = get().accessToken;
    return !!token;
  },
});

type StoreType = AuthState;

export const useStoreBase = create<StoreType>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
      })),
      {
        name: "teamsync-auth-storage",
        getStorage: () => localStorage, // Changed from sessionStorage to localStorage
      }
    )
  )
);

export const useStore = createSelectors(useStoreBase);
