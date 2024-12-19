const devEnvs = ["development", "dev"];
const prodEnvs = ["production", "prod"];

const isDevEnv = () =>
  devEnvs.includes(
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development").toLowerCase()
  );

const isProdEnv = () =>
  prodEnvs.includes(
    (process.env.NEXT_PUBLIC_ENVIRONMENT ?? "production").toLowerCase()
  );

export { isDevEnv, isProdEnv };
