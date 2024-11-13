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
import { useMutation } from "react-query";

import FormFactory from "components/FormFactory";
import { signInAction } from "actions/auth";
import { useRouter } from "next/navigation";
import PATHS from "constants/paths";

const validationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export default function SignInPage() {
  const router = useRouter();
  const { mutate: signInActionMutation, isLoading } = useMutation(
    signInAction,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("wrong creds, try again");
        } else {
          router.replace(PATHS.dashboardPath);
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
      signInActionMutation(formData);
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
                <Button disabled={isLoading}>Have an account? Sign in</Button>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
