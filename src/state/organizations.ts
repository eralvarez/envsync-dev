import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { OrganizationDto } from "services/OrganizationService";

type State = {
  selectedOrganization: OrganizationDto | null;
};

type Actions = {
  setSelectedOrganization: (organization: OrganizationDto) => void;
};

const useOrganization = create(
  persist<State & Actions>(
    (set) => ({
      selectedOrganization: null,
      setSelectedOrganization: (organization: OrganizationDto) =>
        set({ selectedOrganization: organization }),
    }),
    { name: "org-state", storage: createJSONStorage(() => localStorage) }
  )
);

export { useOrganization };
