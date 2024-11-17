"use client";

import { IconButton, Stack, TextField } from "@mui/material";
import { TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

type TableRowFormMode = "EDIT" | "CREATE";

export default function TableRowForm({
  mode = "CREATE",
  envVar,
  envVarValue,
  onChange,
  onDelete = () => {},
  onCancel = () => {},
  onSave = () => {},
}: {
  mode?: TableRowFormMode;
  envVar: string;
  envVarValue: string;
  onChange: (envVar: string, value: string) => void;
  onDelete?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
}) {
  const getActions = () => {
    if (mode === "EDIT") {
      return (
        <>
          <IconButton
            onClick={() => {
              onCancel();
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              onSave();
            }}
          >
            <SaveIcon />
          </IconButton>
        </>
      );
    }

    return (
      <>
        <IconButton
          onClick={() => {
            if (confirm("Are you sure you want to remove it?")) {
              onDelete!();
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        <TextField
          required
          type="text"
          variant="outlined"
          size="small"
          placeholder="New env var"
          value={envVar}
          onChange={(event) => {
            onChange(event.target.value, envVarValue);
          }}
          slotProps={{
            inputLabel: { shrink: true },
            formHelperText: { sx: { marginLeft: 0 } },
          }}
          fullWidth
        />
      </TableCell>
      <TableCell>
        <Stack direction="row" gap={1}>
          <TextField
            required
            type="text"
            variant="outlined"
            size="small"
            placeholder="value"
            value={envVarValue}
            onChange={(event) => {
              onChange(envVar, event.target.value);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              formHelperText: { sx: { marginLeft: 0 } },
            }}
            fullWidth
          />

          <Stack direction="row" gap={1}>
            {getActions()}
          </Stack>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
