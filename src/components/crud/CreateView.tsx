"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "@toolpad/core";

import FormFactory from "components/FormFactory";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "constants/queryKeys";
import { Organization } from "services/OrganizationService";
import { useAuth } from "state/auth";
import { organizationService } from "services";

const validationSchema = yup.object({
  name: yup.string().required(),
});

export default function CreateView() {
  const { user } = useAuth();
  // const { current: projectService } = useRef(new ProjectService());
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createOrganizationMutation, isPending } = useMutation({
    mutationFn: organizationService.create,
    onSuccess: ({ data, error }) => {
      if (Boolean(error)) {
        console.log("ERROR ADDING");
        console.log({ data, error });
      } else {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.getAllOrganizations],
        });
        // router.replace(PATHS.dashboardPath);
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (formData) => {
      const newOrganization = new Organization({
        ...formData,
        members: [user?.uid as string],
      });
      createOrganizationMutation(newOrganization);
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
              disabled={isPending}
            >
              Create organization
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
