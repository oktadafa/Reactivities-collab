/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CHAT_URL: string;
  readonly VITE_COMMENT_URL: string;
  readonly VITE_PEER_HOST: string
}

interface ImportMetaEnv {
  readonly env: ImportMetaEnv;
}
