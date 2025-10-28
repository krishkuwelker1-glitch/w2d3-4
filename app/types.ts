export type Todo = {
    id: string;           // stable key for React
    title: string;        // user-entered text
    completed: boolean;   // UI state
    createdAt: number;    // optional: sorting / debugging
};
