import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";

const jspdfEsmRelative  = "./node_modules/jspdf/dist/jspdf.es.min.js";
const jspdfEsmAbsolute = path.join(
  process.cwd(),
  "node_modules/jspdf/dist/jspdf.es.min.js"
);
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  turbopack: {
    resolveAlias: {
      jspdf: jspdfEsmRelative,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      jspdf: jspdfEsmAbsolute,
    };
    return config;
  },
  async redirects() {
    return [
      { source: "/cv/[id]", destination: "/cv/[id]", permanent: false },
    ];
  },
};

export default withNextIntl(nextConfig);
