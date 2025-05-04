
/// <reference types="vite/client" />

interface Window {
  gist?: {
    trigger: (type: string, id: number) => void;
    [key: string]: any;
  };
}
