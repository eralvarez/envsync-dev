"use client";

import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useMutation, useQuery, useQueryClient } from "react-query";

import TableRowForm from "./TableRowForm";
import TableDataRow from "./TableDataRow";
import {
  getAllProjectEnvVarsAction,
  createProjectEnvVarAction,
} from "actions/projectEnvVar";
import QUERY_KEYS from "constants/queryKeys";

export default function ProjectEnvPage({
  projectId,
  projectEnvId,
}: {
  projectId: string;
  projectEnvId: string;
}) {
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

  return (
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

      <pre>{JSON.stringify(formValues, null, 2)}</pre>
    </Stack>
  );
}
