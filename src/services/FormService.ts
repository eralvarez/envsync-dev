import * as yup from "yup";
import { CREATE_METADATA_KEY, UPDATE_METADATA_KEY, BaseFieldConfig } from "decorators/firestore";

import type { InputConfig } from "components/FormFactory";

class FormService {
  get validationSchema(): { create: yup.ObjectSchema<any>; update: yup.ObjectSchema<any> } {
    const createMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(CREATE_METADATA_KEY, this);
    const updateMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(UPDATE_METADATA_KEY, this);

    const validationSchemaMap = new Map();
    [
      ["create", createMetadata],
      ["update", updateMetadata],
    ].forEach((metadataGroup) => {
      const [validationKey, metadataMap] = metadataGroup;
      const currentValidationSchemaMap = new Map();

      Array.from(metadataMap as Map<string, BaseFieldConfig>).forEach((fullPropConfig) => {
        const [propKey, propConfig] = fullPropConfig;
        let propValidation: any = yup;

        if (propConfig.type === "string") {
          propValidation = propValidation.string();
          // yup.string().optional();
        } else if (propConfig.type === "number") {
          propValidation = propValidation.number();
        }

        if (propConfig.required === true) {
          // console.log("YAY");
          propValidation = propValidation.required();
        } else {
          propValidation = propValidation.optional();
        }

        currentValidationSchemaMap.set(propKey, propValidation);
      });

      validationSchemaMap.set(validationKey, yup.object(Object.fromEntries(currentValidationSchemaMap)));
    });

    return {
      create: validationSchemaMap.get("create"),
      update: validationSchemaMap.get("update"),
    };
  }

  get inputConfigs(): { create: InputConfig[]; update: InputConfig[] } {
    const createMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(CREATE_METADATA_KEY, this);
    const updateMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(UPDATE_METADATA_KEY, this);

    const inputConfigMap: Map<string, InputConfig[]> = new Map();
    [
      ["create", createMetadata],
      ["update", updateMetadata],
    ].forEach((metadataGroup) => {
      const inputConfigs: InputConfig[] = [];
      const [indexKey, metadataMap] = metadataGroup as [string, Map<string, BaseFieldConfig>];
      // const currentValidationSchemaMap = new Map();

      Array.from(metadataMap).forEach((fullPropConfig) => {
        const [propKey, propConfig] = fullPropConfig;

        if (propConfig.type === "string") {
          inputConfigs.push({
            name: propKey,
            type: "text",
            label: propConfig.label!,
            helperText: propConfig.helperText,
            placeholder: propConfig.placeholder,
            
          });
        } else if (propConfig.type === "number") {
          inputConfigs.push({
            name: propKey,
            type: "text",
            label: propConfig.label!,
            helperText: propConfig.helperText,
            placeholder: propConfig.placeholder,
          });
        }
      });

      inputConfigMap.set(indexKey as string, inputConfigs);

      // validationSchemaMap.set(validationKey, yup.object(Object.fromEntries(currentValidationSchemaMap)));
    });

    // console.log({ formServiceInputConfig: Object.fromEntries(inputConfigMap) });

    return {
      create: inputConfigMap.get("create")!,
      update: inputConfigMap.get("update")!,
    };
  }
}

export { FormService };
