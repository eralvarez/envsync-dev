"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";

import FormFactory from "components/FormFactory";
import { createProjectAction } from "actions/project";
import { useRouter } from "next/navigation";
import PATHS from "constants/paths";
import QUERY_KEYS from "constants/queryKeys";

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
});

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createProjectActionMutation, isLoading } = useMutation(
    createProjectAction,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("something went wrong, try again");
        } else {
          queryClient.invalidateQueries(QUERY_KEYS.getAllProjects);
          router.replace(PATHS.dashboardPath);
        }
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema,
    onSubmit: (formData) => {
      createProjectActionMutation(formData);
    },
  });

  return (
    <Box
      sx={(theme) => ({
        width: 380,

        [theme.breakpoints.down("sm")]: {
          width: "100%",
          marginX: 2,
        },
      })}
    >
      <Stack direction="column" spacing={2}>
        <FormFactory
          inputConfigs={[
            {
              name: "name",
              type: "text",
              label: "Name",
            },
            {
              name: "description",
              type: "textarea",
              label: "Description",
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
            Create project
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
