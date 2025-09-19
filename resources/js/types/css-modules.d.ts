declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

// Vite environment variables
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_DEBUG: string;
    readonly VITE_APP_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    glob: (pattern: string) => Record<string, () => Promise<any>>;
}
