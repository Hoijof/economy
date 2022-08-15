// Extend the NodeJS namespace with Next.js-defined properties
declare namespace NodeJS {
    interface Process {
        /**
         * @deprecated Use `typeof window` instead
         */
        readonly browser: boolean;
    }

    interface ProcessEnv {
        readonly NODE_ENV: "development" | "production" | "test";
    }
}

interface Expense {
    quantity: number;
    type: string;
}
