// "use client";

import * as yup from "yup";
import { useFormik } from "formik";
import {
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
// import { useRouter } from "next/navigation";

import FormFactory from "components/FormFactory";
import PATHS from "constants/paths";
import AuthService from "services/AuthService";

const validationSchema = yup.object({
email: yup.string().email().required(),
  password: yup.string().required(),
});

const authService = new AuthService();

export default function SignInPage() {
  const navigate = useNavigate();
  // const router = useRouter();
  const { mutate: signInMutation, isLoading } = useMutation(
    authService.signIn,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("wrong creds, try again");
        } else {
          navigate(PATHS.dashboardPath);
        }
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (formData) => {
      signInMutation(formData);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        elevation={4}
        sx={(theme) => ({
          width: 380,

          [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginX: 2,
          },
        })}
      >
        <CardContent>
          <Stack direction="column" spacing={2}>
            <Typography variant="h4" align="center">
              Sign in
            </Typography>

            <Stack>
              <FormFactory
                inputConfigs={[
                  {
                    name: "email",
                    type: "email",
                    label: "Email",
                  },
                  {
                    name: "password",
                    type: "password",
                    label: "Password",
                  },
                ]}
                formik={formik}
                validationSchema={validationSchema}
              />

              <Stack direction="column" gap={1}>
                <Button
                  variant="contained"
                  type="button"
                  onClick={formik.submitForm}
                  disabled={isLoading}
                >
                  Sign in
                </Button>
                <Button disabled={isLoading}>Forgot Password?</Button>
                <Button
                  disabled={isLoading}
                  onClick={() => navigate(PATHS.signUpPath)}
                >
                  Don&apos;t have an account? Sign up
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
