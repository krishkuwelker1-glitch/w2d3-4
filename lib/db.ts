import { Todo } from "@/app/types";

/*
export const db = {
    todos: [] as Todo[],
};

*/

const globalForTodos = globalThis as typeof globalThis & { __todos?: Todo[] };
if (!globalForTodos.__todos) globalForTodos.__todos = [];

export const db = { todos: globalForTodos.__todos };
