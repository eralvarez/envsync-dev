"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { PageContainer } from "@toolpad/core";

import FormFactory from "components/FormFactory";
import { createProjectEnvAction } from "actions/projectEnv";
import { useRouter } from "next/navigation";
import PATHS from "constants/paths";
import QUERY_KEYS from "constants/queryKeys";

const validationSchema = yup.object({
  name: yup.string().required(),
});

interface NewEnvPageProps {
  projectId: string;
}

export default function NewEnvPage({ projectId }: NewEnvPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createProjectEnvActionMutation, isLoading } = useMutation(
    createProjectEnvAction,
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
    },
    validationSchema,
    onSubmit: (formData) => {
      createProjectEnvActionMutation({ name: formData.name, projectId });
    },
  });

  return (
    <PageContainer>
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
              Create environment
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
