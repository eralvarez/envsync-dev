"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { PageContainer } from "@toolpad/core";

import FormFactory from "components/FormFactory";
// import { createProjectAction } from "actions/project";
import { useRouter } from "next/navigation";
import PATHS from "constants/paths";
import QUERY_KEYS from "constants/queryKeys";
import ProjectService, { ProjectDto } from "services/ProjectService";
import { useRef } from "react";

const validationSchema = yup.object({
  name: yup.string().required(),
  description: yup.string(),
});

const projectService = new ProjectService();

export default function NewProjectPage() {
  // const { current: projectService } = useRef(new ProjectService());
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createProjectMutation, isLoading } = useMutation(
    projectService.create,
    {
      onSuccess: ({ data, error }) => {
        console.log({ data });
        // if (Boolean(error)) {
        //   alert("something went wrong, try again");
        // } else {
        //   queryClient.invalidateQueries(QUERY_KEYS.getAllProjects);
        //   router.replace(PATHS.dashboardPath);
        // }
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
      const newProject = new ProjectDto(formData);
      createProjectMutation(newProject);
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
    </PageContainer>
  );
}
