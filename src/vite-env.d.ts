/// <reference types="vite/client" />

/** Typed access to the env vars this app actually reads. */
interface ImportMetaEnv {
  /** Base URL of the contact API. Empty in development, where Vite proxies /api. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
