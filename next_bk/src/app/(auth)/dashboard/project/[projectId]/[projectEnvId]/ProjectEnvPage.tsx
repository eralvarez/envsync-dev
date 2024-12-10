"use client";

import { useState } from "react";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { PageContainer, PageContainerToolbar } from "@toolpad/core";
import { useRouter } from "next/navigation";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DeleteIcon from "@mui/icons-material/Delete";

import TableRowForm from "./TableRowForm";
import TableDataRow from "./TableDataRow";
import {
  getAllProjectEnvVarsAction,
  createProjectEnvVarAction,
} from "actions/projectEnvVar";
import { deleteProjectEnvAction } from "actions/projectEnv";
import QUERY_KEYS from "constants/queryKeys";
import PATHS from "constants/paths";

export default function ProjectEnvPage({
  projectId,
  projectEnvId,
}: {
  projectId: string;
  projectEnvId: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<[string, string][]>([]);
  const { data: projectEnvVarsResponse } = useQuery(
    [QUERY_KEYS.getAllProjectEnvVars, projectId, projectEnvId],
    () => getAllProjectEnvVarsAction({ projectId, projectEnvId })
  );
  const { mutate: createProjectEnvVarActionMutation } = useMutation(
    createProjectEnvVarAction,
    {
      onSuccess: ({ data, error }) => {
        console.log({ data, error });
        if (Boolean(error)) {
          alert("something went wrong, try again");
        } else {
          setFormValues([]);
          queryClient.invalidateQueries([
            QUERY_KEYS.getAllProjectEnvVars,
            projectId,
            projectEnvId,
          ]);
        }
      },
    }
  );
  const { mutate: deleteProjectEnvActionMutation } = useMutation(
    deleteProjectEnvAction,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("something went wrong, try again");
        } else {
          queryClient.invalidateQueries([QUERY_KEYS.getAllProjects]);
          router.replace(PATHS.dashboardPath);
        }
      },
    }
  );

  const getPageToolbar = () => {
    return (
      <PageContainerToolbar>
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(`${projectId}:${projectEnvId}`);
            alert("Environment id has beed copied to clipboard");
          }}
        >
          <FingerprintIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => {
            if (confirm("Are you sure you want to delete this env?")) {
              deleteProjectEnvActionMutation({ projectId, projectEnvId });
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </PageContainerToolbar>
    );
  };

  return (
    <PageContainer slots={{ toolbar: getPageToolbar }}>
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={1}>
          <Button
            variant="contained"
            onClick={() => {
              setFormValues((prevState) => {
                const newState = [...prevState];
                newState.push(["", ""]);
                return newState;
              });
            }}
          >
            Create new env var
          </Button>

          {Boolean(formValues.length) && (
            <Button
              variant="contained"
              onClick={() => {
                createProjectEnvVarActionMutation({
                  envVars: formValues,
                  projectEnvId,
                  projectId,
                });
              }}
            >
              Save env vars
            </Button>
          )}
        </Stack>

        <Stack direction="row" alignItems="center">
          <InfoIcon />
          <Typography variant="body2">
            Click in env var name / env var value to copy it to clipboard
          </Typography>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="50%">Env var</TableCell>
              <TableCell width="50%">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formValues.map((values, formValueIndex) => (
              <TableRowForm
                key={`form${formValueIndex}`}
                envVar={values.at(0) as string}
                envVarValue={values.at(1) as string}
                onChange={(envVar, envVarValue) => {
                  console.log({ envVar, envVarValue });
                  setFormValues((prevState) => {
                    const newState = [...prevState];
                    newState[formValueIndex] = [envVar, envVarValue];
                    return newState;
                  });
                }}
                onDelete={() => {
                  setFormValues((prevState) => {
                    const newState = [...prevState];
                    newState.splice(formValueIndex, 1);
                    return newState;
                  });
                }}
              />
            ))}

            {projectEnvVarsResponse?.data?.map((projectEnvVar) => {
              return (
                <TableDataRow
                  key={projectEnvVar.id}
                  projectEnvVar={projectEnvVar}
                  projectId={projectId}
                  projectEnvId={projectEnvId}
                />
              );
            })}
          </TableBody>
        </Table>
      </Stack>
    </PageContainer>
  );
}
