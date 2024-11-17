"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { IconButton, Stack, Typography } from "@mui/material";
import { TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteProjectEnvVarAction,
  editProjectEnvVarAction,
} from "actions/projectEnvVar";

import QUERY_KEYS from "constants/queryKeys";
import { Database } from "types/supabase";
import TableRowForm from "./TableRowForm";

type TableDataRowMode = "VIEW" | "EDIT";

export default function TableDataRow({
  projectEnvVar,
  projectId,
  projectEnvId,
}: {
  projectEnvVar: Partial<
    Database["public"]["Tables"]["project_env_var"]["Row"]
  >;
  projectId: string;
  projectEnvId: string;
}) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<TableDataRowMode>("VIEW");
  const [editForm, setEditForm] = useState<[string, string]>(["", ""]);
  const { mutate: deleteProjectEnvVarActionMutation } = useMutation(
    deleteProjectEnvVarAction,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("something went wrong, try again");
        } else {
          queryClient.invalidateQueries([
            QUERY_KEYS.getAllProjectEnvVars,
            projectId,
            projectEnvId,
          ]);
        }
      },
    }
  );
  const { mutate: editProjectEnvVarActionMutation } = useMutation(
    editProjectEnvVarAction,
    {
      onSuccess: ({ error }) => {
        if (Boolean(error)) {
          alert("something went wrong, try again");
        } else {
          setMode("VIEW");
          queryClient.invalidateQueries([
            QUERY_KEYS.getAllProjectEnvVars,
            projectId,
            projectEnvId,
          ]);
        }
      },
    }
  );

  if (mode === "EDIT") {
    return (
      <TableRowForm
        mode="EDIT"
        envVar={editForm[0]}
        envVarValue={editForm[1]}
        onChange={(...args) => {
          setEditForm(args);
        }}
        onCancel={() => {
          setMode("VIEW");
        }}
        onSave={() => {
          editProjectEnvVarActionMutation({
            projectEnvVar: {
              id: projectEnvVar.id!,
              env_var: editForm[0],
              value: editForm[1],
            },
            projectEnvId,
            projectId,
          });
        }}
      />
    );
  }

  return (
    <TableRow
      key={projectEnvVar.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell scope="row" width="50%">
        <Typography
          sx={{
            "&:hover": {
              cursor: "copy",
            },
          }}
          component="div"
          onClick={() => {
            navigator.clipboard.writeText(projectEnvVar.env_var!);
          }}
        >
          {projectEnvVar.env_var}
        </Typography>
      </TableCell>
      <TableCell width="50%" sx={{ maxWidth: "0px" }}>
        <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
          <Typography
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              "&:hover": {
                cursor: "copy",
              },
            }}
            component="div"
            onClick={() => {
              navigator.clipboard.writeText(projectEnvVar.value!);
            }}
          >
            {projectEnvVar.value}
          </Typography>

          <Stack direction="row" gap={1}>
            <IconButton
              onClick={() => {
                setMode("EDIT");
                setEditForm([projectEnvVar.env_var!, projectEnvVar.value!]);
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              onClick={() => {
                if (confirm("Are you sure you want to remove it?")) {
                  deleteProjectEnvVarActionMutation({
                    projectId,
                    projectEnvId,
                    projectEnvVarId: projectEnvVar.id!,
                  });
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
