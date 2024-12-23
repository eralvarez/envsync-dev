"use client";

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
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import FormFactory from "components/FormFactory";
import { PATHS } from "constants/paths";
import { authService } from "services";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignInPage() {
  const router = useRouter();
  const { mutate: signInMutation, isPending } = useMutation({
    mutationFn: authService.signIn,
    onSuccess: ({ error }) => {
      if (Boolean(error)) {
        alert(error);
      } else {
        router.replace(PATHS.dashboardPath);
      }
    },
  });

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
                  disabled={isPending}
                >
                  Sign in
                </Button>
                <Button disabled={isPending}>Forgot Password?</Button>
                <Button
                  disabled={isPending}
                  onClick={() => router.push(PATHS.signUpPath)}
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