import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Input,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Stack,
  StackProps,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { isDevEnv } from "utils/env";
// import { InputLabel, Stack, TextField, Typography } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { isUndefined } from "lodash";
// import { v4 as uuid } from "uuid";
// import { ChangeEvent } from "react";

// import supabase from "utils/supabase/client";
// import Link from "next/link";

type InputType = "text" | "textarea" | "select" | "datetime" | "file" | "boolean" | "password" | "email";

// enum InputTypeEnum {
//   text = "text",
//   textarea = "textarea",
//   select = "select",
//   datetime = "datetime",
//   file = "file",
//   boolean = "boolean",
//   password = "password",
//   email = "email",
// }

interface SelectOptions {
  id: string;
  label: string;
}

interface BaseInputConfig {
  label: string;
  name: string;
  helperText?: string;
  placeholder?: string;
  enabled?: boolean;
}

// interface InputConfig {
//   type: InputType;
//   label: string;
//   name: string;
//   helperText?: string;
//   placeholder?: string;
//   options?: SelectOptions[];
//   enabled?: boolean;
//   doneText?: string;
//   cancelText?: string;
//   datetimePresentation?: "time" | "date";
//   file?: {
//     accept: string;
//   };
// }
type InputConfig =
  | ({
      type: "text" | "textarea" | "email" | "password" | "boolean" | "datetime" | "file";
    } & BaseInputConfig)
  | ({
      type: "select";
      options: SelectOptions[];
    } & BaseInputConfig);

interface FormProps {
  inputConfigs: InputConfig[];
  formik: ReturnType<typeof useFormik<any>>;
  validationSchema?: yup.ObjectSchema<any>;
  onChange?: (inputName: string, value: any) => void;
  // stackProps?: StackProps;
}

function FormFactory({ inputConfigs, formik, validationSchema, onChange }: Readonly<FormProps>) {
  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   const file = event.target.files![0];
  //   const destinationPath = "images/lands";
  //   const fileName = file.name.split(".").at(0);
  //   const fileType = file.name.split(".").at(-1);
  //   const fileHash = uuid().split("-").at(0);
  //   const fileNameToUpload = `${destinationPath}/${fileName}-${fileHash}.${fileType}`;

  //   // const { error: uploadError } = await supabase.storage
  //   //   .from("files")
  //   //   .upload(fileNameToUpload, file);

  //   // if (uploadError) {
  //   //   alert("Error al subir el archivo");
  //   // } else {
  //   //   const {
  //   //     data: { publicUrl },
  //   //   } = supabase.storage.from("files").getPublicUrl(fileNameToUpload);

  //   //   // console.log({ publicUrl });
  //   //   formik.setFieldValue(field, publicUrl);
  //   // }
  // };

  const getElement = (inputConfig: InputConfig) => {
    // console.log({ validationSchema });
    const isRequired = ((validationSchema?.describe().fields[inputConfig.name] as any).optional ?? false) === false;
    const hasError = (formik.touched[inputConfig.name] && Boolean(formik.errors[inputConfig.name])) ?? false;

    switch (inputConfig.type) {
      case "text": {
        return (
          <Stack direction="column" key={inputConfig.label} spacing={1}>
            <InputLabel
              htmlFor={inputConfig.name}
              error={hasError}
              sx={{
                fontSize: "0.875rem",
              }}
              required={isRequired}
            >
              {inputConfig.label}
            </InputLabel>

            <TextField
              required={isRequired}
              id={inputConfig.name}
              name={inputConfig.name}
              type="text"
              variant="outlined"
              size="small"
              value={formik.values[inputConfig.name]}
              placeholder={inputConfig.placeholder ?? ""}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { sx: { marginLeft: 0 } },
              }}
              helperText={
                hasError ? ((formik.errors[inputConfig.name] as string) ?? "") : (inputConfig.helperText ?? "")
              }
              error={hasError}
            />
          </Stack>
        );
      }
      case "email": {
        return (
          <Stack direction="column" key={inputConfig.label} spacing={1}>
            <InputLabel htmlFor={inputConfig.name} error={hasError}>
              <Typography variant="body2">{inputConfig.label}</Typography>
            </InputLabel>
            <TextField
              required={isRequired}
              id={inputConfig.name}
              name={inputConfig.name}
              type="email"
              variant="outlined"
              size="small"
              value={formik.values[inputConfig.name]}
              placeholder={inputConfig.placeholder ?? ""}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { sx: { marginLeft: 0 } },
              }}
              helperText={
                hasError ? ((formik.errors[inputConfig.name] as string) ?? "") : (inputConfig.helperText ?? "")
              }
              error={hasError}
            />
          </Stack>
        );
      }
      case "password": {
        return (
          <Stack direction="column" key={inputConfig.label} spacing={1}>
            <InputLabel htmlFor={inputConfig.name} error={hasError}>
              <Typography variant="body2">{inputConfig.label}</Typography>
            </InputLabel>
            <TextField
              required={isRequired}
              id={inputConfig.name}
              name={inputConfig.name}
              type="password"
              variant="outlined"
              size="small"
              value={formik.values[inputConfig.name]}
              placeholder={inputConfig.placeholder ?? ""}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { sx: { marginLeft: 0 } },
              }}
              helperText={
                hasError ? ((formik.errors[inputConfig.name] as string) ?? "") : (inputConfig.helperText ?? "")
              }
              error={hasError}
            />
          </Stack>
        );
      }
      case "textarea":
        // return (
        //   <Stack key={inputConfig.label} direction="column" gap={1}>
        //     <Typography component="label" htmlFor={inputConfig.name}>
        //       {inputConfig.label}
        //     </Typography>
        //     <TextField
        //       id={inputConfig.name}
        //       name={inputConfig.name}
        //       value={formik.values[inputConfig.name]}
        //       onChange={formik.handleChange}
        //       fullWidth
        //       multiline
        //       rows={4}
        //       helperText={
        //         Boolean(formik.errors[inputConfig.name])
        //           ? (formik.errors[inputConfig.name] as string)
        //           : ""
        //       }
        //     />
        //   </Stack>
        // );
        return (
          <Stack direction="column" key={inputConfig.label} spacing={1}>
            <InputLabel
              htmlFor={inputConfig.name}
              error={hasError}
              sx={{
                fontSize: "0.875rem",
              }}
              required={isRequired}
            >
              {inputConfig.label}
            </InputLabel>

            <TextField
              required={isRequired}
              id={inputConfig.name}
              name={inputConfig.name}
              type="text"
              multiline
              rows={4}
              variant="outlined"
              size="small"
              value={formik.values[inputConfig.name]}
              placeholder={inputConfig.placeholder ?? ""}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
              slotProps={{
                inputLabel: { shrink: true },
                formHelperText: { sx: { marginLeft: 0 } },
              }}
              helperText={
                hasError ? ((formik.errors[inputConfig.name] as string) ?? "") : (inputConfig.helperText ?? "")
              }
              error={hasError}
            />
          </Stack>
        );
      case "boolean": {
        return (
          <label className="block" key={inputConfig.label}>
            <span className="text-gray-700">
              {inputConfig.label} {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <input
              id={inputConfig.name}
              name={inputConfig.name}
              type="checkbox"
              // value={formik.values[inputConfig.name]}
              checked={formik.values[inputConfig.name]}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
            />
          </label>
        );
        // return (
        //   <Box key={inputConfig.label}>
        //     <FormControlLabel
        //       id={inputConfig.name}
        //       name={inputConfig.name}
        //       checked={formik.values[inputConfig.name]}
        //       control={<Switch color="primary" />}
        //       label={inputConfig.label}
        //       labelPlacement="start"
        //       onChange={formik.handleChange}
        //       sx={{
        //         marginLeft: 0,
        //       }}
        //     />
        //   </Box>
        // );
        // return null;
      }
      case "select": {
        return (
          <label className="block" key={inputConfig.label}>
            <span className="text-gray-700">
              {inputConfig.label} {isRequired && <span className="text-red-500 text-md">*</span>}
            </span>

            <select
              id={inputConfig.name}
              name={inputConfig.name}
              className="block w-full"
              value={formik.values[inputConfig.name]}
              onChange={(event) => {
                const inputValue = event.target.value;
                formik.handleChange(event);

                if (!_.isUndefined(onChange)) {
                  onChange(inputConfig.name, inputValue);
                }
              }}
            >
              <option value="" disabled>
                Choose here
              </option>
              {inputConfig.options!.map((selectOption) => (
                <option key={selectOption.id} value={selectOption.id}>
                  {selectOption.label}
                </option>
              ))}
            </select>

            {formik.touched[inputConfig.name] && Boolean(formik.errors[inputConfig.name]) && (
              <>
                {typeof formik.errors[inputConfig.name] === "string" ? (
                  <span className="text-sm text-red-500">{formik.errors[inputConfig.name] as string}</span>
                ) : null}
              </>
            )}
          </label>
        );
        // return null;
        // if (isUndefined(inputConfig.enabled)) {
        //   return (
        //     <IonItem key={inputConfig.label}>
        //       <IonSelect
        //         label={inputConfig.label}
        //         labelPlacement="stacked"
        //         value={formik.values[inputConfig.name]}
        //         onIonChange={(event) =>
        //           formik.setFieldValue(inputConfig.name, event.detail.value)
        //         }
        //       >
        //         {inputConfig.options!.map((option) => (
        //           <IonSelectOption value={option.id} key={option.id}>
        //             {option.label}
        //           </IonSelectOption>
        //         ))}
        //       </IonSelect>
        //     </IonItem>
        //   );
        // } else {
        //   return Boolean(inputConfig.enabled) ? (
        //     <IonItem key={inputConfig.label}>
        //       <IonSelect
        //         label={inputConfig.label}
        //         labelPlacement="stacked"
        //         value={formik.values[inputConfig.name]}
        //         onIonChange={(event) =>
        //           formik.setFieldValue(inputConfig.name, event.detail.value)
        //         }
        //       >
        //         {inputConfig.options!.map((option) => (
        //           <IonSelectOption value={option.id} key={option.id}>
        //             {option.label}
        //           </IonSelectOption>
        //         ))}
        //       </IonSelect>
        //     </IonItem>
        //   ) : null;
        // }
      }
      case "datetime":
        return null;
      // const datetimeKey = uuid();
      // if (isUndefined(inputConfig.enabled)) {
      //   return (
      //     <IonItem key={inputConfig.label}>
      //       <div
      //         style={{
      //           display: "flex",
      //           flexDirection: "column",
      //           gap: 8,
      //           paddingTop: 6,
      //           paddingBottom: 6,
      //         }}
      //       >
      //         <IonLabel style={{ fontSize: 13 }}>
      //           {inputConfig.label}
      //         </IonLabel>
      //         <div style={{ width: "100%" }}>
      //           <IonDatetimeButton datetime={datetimeKey}></IonDatetimeButton>
      //           <IonModal keepContentsMounted={true}>
      //             <IonDatetime
      //               id={datetimeKey}
      //               presentation={inputConfig.datetimePresentation}
      //               showDefaultButtons
      //               doneText={inputConfig.doneText}
      //               cancelText={inputConfig.cancelText}
      //               value={formik.values[inputConfig.name]}
      //               onIonChange={(event) =>
      //                 formik.setFieldValue(
      //                   inputConfig.name,
      //                   event.detail.value
      //                 )
      //               }
      //             ></IonDatetime>
      //           </IonModal>
      //         </div>
      //       </div>
      //     </IonItem>
      //   );
      // } else {
      //   return Boolean(inputConfig.enabled) ? (
      //     <IonItem key={inputConfig.label}>
      //       <div
      //         style={{
      //           display: "flex",
      //           flexDirection: "column",
      //           gap: 8,
      //           paddingTop: 6,
      //           paddingBottom: 6,
      //         }}
      //       >
      //         <IonLabel style={{ fontSize: 13 }}>
      //           {inputConfig.label}
      //         </IonLabel>
      //         <div style={{ width: "100%" }}>
      //           <IonDatetimeButton datetime={datetimeKey}></IonDatetimeButton>
      //           <IonModal keepContentsMounted={true}>
      //             <IonDatetime
      //               id={datetimeKey}
      //               presentation={inputConfig.datetimePresentation}
      //               showDefaultButtons
      //               doneText={inputConfig.doneText}
      //               cancelText={inputConfig.cancelText}
      //               value={formik.values[inputConfig.name]}
      //               onIonChange={(event) =>
      //                 formik.setFieldValue(
      //                   inputConfig.name,
      //                   event.detail.value
      //                 )
      //               }
      //             ></IonDatetime>
      //           </IonModal>
      //         </div>
      //       </div>
      //     </IonItem>
      //   ) : null;
      // }
      case "file":
        // return (
        //   <Stack key={inputConfig.label} direction="column" gap={1}>
        //     <Typography component="label" htmlFor={inputConfig.name}>
        //       {inputConfig.label}
        //     </Typography>

        //     {formik.values[inputConfig.name] && (
        //       <List>
        //         {typeof formik.values[inputConfig.name] === "string" && (
        //           <ListItem
        //             disableGutters
        //             secondaryAction={
        //               <Stack direction="row">
        //                 <Link
        //                   href={formik.values[inputConfig.name]}
        //                   target="_blank"
        //                 >
        //                   <IconButton aria-label="comment">
        //                     <VisibilityIcon />
        //                   </IconButton>
        //                 </Link>
        //                 <IconButton
        //                   aria-label="comment"
        //                   onClick={() => {
        //                     formik.setFieldValue(inputConfig.name, "");
        //                   }}
        //                 >
        //                   <DeleteIcon />
        //                 </IconButton>
        //               </Stack>
        //             }
        //           >
        //             <ListItemText
        //               primary={formik.values[inputConfig.name]
        //                 .split("/")
        //                 .at(-1)}
        //             />
        //           </ListItem>
        //         )}

        //         {/* {typeof formik.values[inputConfig.name] === "object" && (
        //           <>
        //             {formik.values[inputConfig.name].map(
        //               (item: string, itemIndex: number) => (
        //                 <ListItem
        //                   disableGutters
        //                   secondaryAction={
        //                     <IconButton
        //                       aria-label="comment"
        //                       onClick={() => {
        //                         formik.setFieldValue(inputConfig.name, "");
        //                       }}
        //                     >
        //                       <DeleteIcon />
        //                     </IconButton>
        //                   }
        //                 >
        //                   <ListItemText primary={item.split("/").at(-1)} />
        //                 </ListItem>
        //               )
        //             )}
        //           </>
        //         )} */}
        //       </List>
        //     )}
        //     <Button
        //       component="label"
        //       role={undefined}
        //       variant="contained"
        //       tabIndex={-1}
        //     >
        //       Subir archivo
        //       <Input
        //         type="file"
        //         sx={{ display: "none" }}
        //         inputProps={{
        //           accept: inputConfig.file?.accept,
        //         }}
        //         onClick={(event: any) => (event.target.value = "")}
        //         // onChange={(event) => handleFileChange(event as HTMLInputElement, inputConfig.name)}
        //         onChange={(event) =>
        //           handleFileChange(
        //             event as ChangeEvent<HTMLInputElement>,
        //             inputConfig.name
        //           )
        //         }
        //       />
        //     </Button>
        //   </Stack>
        // );
        return null;

      default:
        break;
    }
    return null;
  };

  return (
    <Stack data-testid="formFactory" direction="column" gap={2} sx={{ marginBottom: 2 }}>
      {inputConfigs.map((inputConfig) => getElement(inputConfig))}

      {isDevEnv() ? <pre>{JSON.stringify(formik.values, null, 2)}</pre> : null}
    </Stack>
  );
}

export default FormFactory;

export type { InputType, SelectOptions, InputConfig, FormProps };
