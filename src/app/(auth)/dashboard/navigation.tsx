import { Navigation } from "types/toolpad";
import PATHS from "constants/paths";

const navigation: Navigation[] = [
  {
    segment: PATHS.dashboard,
    title: "Home",
  },
  {
    segment: `${PATHS.dashboard}/about`,
    title: "About",
  },
];

export default navigation;
