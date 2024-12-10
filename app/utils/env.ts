// const devEnvs = ["development", "dev"];
// const prodEnvs = ["production", "prod"];

const isDevEnv = () => import.meta.env.DEV;

const isProdEnv = () => import.meta.env.PROD;

export { isDevEnv, isProdEnv };
