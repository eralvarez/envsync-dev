import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  typography: {
    fontFamily: "Inter",
  },
  components: {
    MuiButton: {
      // defaultProps: {
      //   disableElevation: true,
      //   disableRipple: true,
      // },
      styleOverrides: {
        root: {
          textTransform: "unset",
        },
      },
    },
  },
});

export { theme };
