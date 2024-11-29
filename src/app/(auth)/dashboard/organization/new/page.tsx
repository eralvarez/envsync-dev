"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "react-query";
import { PageContainer } from "@toolpad/core";

import FormFactory from "components/FormFactory";
import { useRouter } from "next/navigation";
import PATHS from "constants/paths";
import QUERY_KEYS from "constants/queryKeys";
import OrganizationService, {
  OrganizationDto,
} from "services/OrganizationService";
import { useAuth } from "contexts/AuthContext";

const validationSchema = yup.object({
  name: yup.string().required(),
});

const organizationService = new OrganizationService();

export default function NewProjectPage() {
  const { user } = useAuth();
  // const { current: projectService } = useRef(new ProjectService());
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createOrganizationMutation, isLoading } = useMutation(
    organizationService.create,
    {
      onSuccess: ({ data, error }) => {
        if (Boolean(error)) {
          alert(error);
        } else {
          // queryClient.invalidateQueries(QUERY_KEYS.getAllProjects);
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
      const newOrganization = new OrganizationDto({
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
              disabled={isLoading}
            >
              Create organization
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
