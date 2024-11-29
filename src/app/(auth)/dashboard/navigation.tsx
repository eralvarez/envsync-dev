import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";

import { Navigation } from "types/toolpad";
import PATHS from "constants/paths";

const navigation: Navigation[] = [
  {
    kind: "header",
    title: "General",
  },
  {
    segment: PATHS.dashboard,
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    kind: "header",
    title: "Organizations",
  },
  {
    segment: PATHS.newOrganization,
    title: "New org",
    icon: <AddIcon />,
  },
  {
    kind: "header",
    title: "Projects",
  },
  {
    segment: PATHS.newProject,
    title: "New project",
    icon: <AddIcon />,
  },
];

export default navigation;
