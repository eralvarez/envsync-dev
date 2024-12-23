import "reflect-metadata";

const CREATE_METADATA_KEY = Symbol.for("createMetadata");
const UPDATE_METADATA_KEY = Symbol.for("updateMetadata");

const defaultValues = {
  string: "",
  number: 0,
};

interface BaseFieldConfig {
  label?: string;
  required?: boolean;
  show?: boolean;
  type?: string;
  helperText?: string;
  placeholder?: string;
  defaultValue?: any;
}

interface FieldConfig extends BaseFieldConfig {
  create?: BaseFieldConfig;
  update?: BaseFieldConfig;
}

function Field(fieldConfig?: Omit<FieldConfig, "type">) {
  return function (target: any, propertyKey: string | symbol, ...args: any): void {
    const propertyType = Reflect.getMetadata("design:type", target, propertyKey);
    // console.log({ target, propertyKey });
    // console.log(Reflect.ownKeys(target));
    // console.log(Reflect.ge(target, propertyKey));

    const createMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(CREATE_METADATA_KEY, target) ?? new Map();
    const updateMetadata: Map<string, BaseFieldConfig> = Reflect.getMetadata(UPDATE_METADATA_KEY, target) ?? new Map();

    const createConfig: BaseFieldConfig = {
      label: String(propertyKey),
      required: false,
      show: true,
      helperText: "",
      placeholder: "",
      defaultValue: null,
      ...fieldConfig,
      ...(fieldConfig?.create ?? {}),
    };
    createMetadata.set(String(propertyKey), {
      ...createConfig,
      type: (propertyType.name as string).toLocaleLowerCase(),
    });

    const updateConfig: BaseFieldConfig = {
      label: String(propertyKey),
      required: false,
      show: true,
      helperText: "",
      placeholder: "",
      defaultValue: null,
      ...fieldConfig,
      ...(fieldConfig?.update ?? {}),
    };
    updateMetadata.set(String(propertyKey), {
      ...updateConfig,
      type: (propertyType.name as string).toLocaleLowerCase(),
    });

    Reflect.defineMetadata(CREATE_METADATA_KEY, createMetadata, target);
    Reflect.defineMetadata(UPDATE_METADATA_KEY, updateMetadata, target);

    // console.log(Reflect.getMetadata("property:value", target, "name"));
    // const initialValue = target[propertyKey];
    // console.log({ initialValue });

    // const privateFieldName = `__${String(propertyKey)}__`;

    // Object.defineProperty(target, propertyKey, {
    //   get() {
    //     return this[privateFieldName];
    //   },
    //   set(newValue: any) {
    //     console.log("SET");
    //     // Update the private field
    //     this[privateFieldName] = newValue;

    //     // Capture metadata: name, type, and value
    //     Reflect.defineMetadata("property:name", propertyKey, target, propertyKey);
    //     Reflect.defineMetadata(
    //       "property:type",
    //       Reflect.getMetadata("design:type", target, propertyKey)?.name,
    //       target,
    //       propertyKey,
    //     );
    //     Reflect.defineMetadata("property:value", newValue, target, propertyKey);
    //   },
    //   enumerable: true,
    //   configurable: true,
    // });
  };
}

export { Field, CREATE_METADATA_KEY, UPDATE_METADATA_KEY };
export type { FieldConfig, BaseFieldConfig };
