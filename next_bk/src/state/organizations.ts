import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Organization } from "services/OrganizationService";

type State = {
  selectedOrganization: Organization | null;
};

type Actions = {
  setSelectedOrganization: (organization: Organization | null) => void;
};

const useOrganization = create(
  persist<State & Actions>(
    (set) => ({
      selectedOrganization: null,
      setSelectedOrganization: (organization: Organization | null) =>
        set({ selectedOrganization: organization }),
    }),
    { name: "org-state", storage: createJSONStorage(() => localStorage) }
  )
);

export { useOrganization };
