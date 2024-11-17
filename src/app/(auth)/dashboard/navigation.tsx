import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import HomeIcon from "@mui/icons-material/Home";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
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
    title: "Projects",
  },
  {
    segment: PATHS.newProject,
    title: "New project",
    icon: <AddIcon />,
  },
  // {
  //   segment: `${PATHS.dashboard}/asd`,
  //   title: "Project #1",
  //   icon: <FolderOpenIcon />,
  //   children: [
  //     {
  //       segment: `about`,
  //       title: "Env #1",
  //       icon: <CloudQueueIcon />,
  //     },
  //   ],
  // },

  // {
  //   segment: `${PATHS.dashboard}/about`,
  //   title: "About",
  // },
  // {
  //   kind: "divider",
  // },
];

export default navigation;
