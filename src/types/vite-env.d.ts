/// <reference types="vite/client" />

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (
    pattern: string,
    options?: {
      eager?: boolean;
      as?: string;
    },
  ) => Record<string, unknown>;
}
