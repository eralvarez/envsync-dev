import type { NextConfig } from "next";

import { isProdEnv } from "./src/utils/env";

const envCompilerOptions = isProdEnv()
  ? {
      removeConsole: {
        exclude: ["error"],
      },
    }
  : {};

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // typedRoutes: true,
  },
  compiler: {
    ...envCompilerOptions,
    // removeConsole: {
    //   exclude: ["error"],
    // },
  },
};

export default nextConfig;
