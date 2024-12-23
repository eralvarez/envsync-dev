"use client";

import * as yup from "yup";
import { useFormik } from "formik";
import { Button, Stack, Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "@toolpad/core";

import FormFactory from "components/FormFactory";
// import { useRouter } from "next/navigation";
// import { QUERY_KEYS } from "constants/queryKeys";
// import { Organization, OrganizationService } from "services/OrganizationService";
// import { useAuth } from "state/auth";
import { organizationService } from "services";
import { ClassRef } from "types/class";

interface UseCreateProps {
  dataServiceInstance: any;
  DocumentDto?: ClassRef;
  queriesToInvalidate?: string[] | string[][];
  initialValues: Record<string, any>;
  onError: (error: string) => void;
  onSuccess: (data: any) => void;
  onSubmit?: (formData: any) => any;
}

function useCreate({
  dataServiceInstance,
  queriesToInvalidate,
  initialValues,
  onError,
  onSuccess,
  onSubmit,
}: UseCreateProps) {
  const queryClient = useQueryClient();
  const { mutate: createMutation, ...mutationState } = useMutation({
    mutationFn: organizationService.create,
    onSuccess: ({ data, error }) => {
      if (Boolean(error)) {
        // onError callback
        onError(error);
      } else {
        // invalidate queries if passed
        if (queriesToInvalidate !== undefined) {
          const firstQuery = queriesToInvalidate.at(0);

          if (firstQuery !== undefined) {
            if (typeof firstQuery === "string") {
              queryClient.invalidateQueries({
                queryKey: queriesToInvalidate,
              });
            } else {
              queriesToInvalidate.forEach((arrayOfQuery) => {
                queryClient.invalidateQueries({
                  queryKey: arrayOfQuery,
                });
              });
            }
          }
        }

        // onSuccess callback
        onSuccess(data);
      }
    },
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: (dataServiceInstance as any).validationSchema.create,
    onSubmit: (formData) => {
      // take value from callback so we can pass an DTO or anything else
      let customFormData = formData;
      if (onSubmit !== undefined) {
        customFormData = onSubmit(formData);
      }
      console.log({ customFormData });
      // createMutation(customFormData);
      // createOrganizationMutation(newOrganization);
    },
  });

  return {
    formik,
    mutationState,
    createMutation,
  };
}

export default function NewOrganizationPage() {
  const handleFormOnError = () => {alert("nay")};
  const handleFormOnSuccess = () => {alert("yay")};

  const { formik, mutationState } = useCreate({
    dataServiceInstance: organizationService,
    initialValues: { name: "" },
    onError: handleFormOnError,
    onSuccess: handleFormOnSuccess,
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
            inputConfigs={organizationService.inputConfigs.create}
            formik={formik}
            validationSchema={organizationService.validationSchema.create}
          />

          <Stack direction="column" gap={1}>
            <Button variant="contained" type="button" onClick={formik.submitForm} disabled={mutationState.isPending}>
              Create organization
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}
