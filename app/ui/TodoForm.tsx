"use client";

import { useState } from "react";

// Props: parent passes an onAdd callback; disabled is optional
export default function TodoForm({
    onAdd,
    disabled = false,
}: {
    onAdd: (title: string) => void;
    disabled?: boolean;
}) {
    // Always start controlled with an empty string (prevents controlled/uncontrolled errors)
    const [title, setTitle] = useState("");

    // onChange must read from the event -> set string value (NOT the whole event!)
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        // currentTarget is always the element the handler is bound to (safer than target)
        setTitle(e.currentTarget.value);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();                // don't reload the page
        const trimmed = title.trim();      // avoid blank todos
        if (!trimmed) return;
        onAdd(trimmed);                    // tell parent to create
        setTitle("");                      // clear the input after submit
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
            <input
                type="text"
                name="title"
                placeholder="Add a todo"
                value={title}                  // controlled input = value always a string
                onChange={handleChange}        // never pass setState directly here
                disabled={disabled}
                style={{
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    marginRight: 8,
                    width: "70%",
                }}
            />
            <button
                type="submit"
                disabled={disabled}
                style={{
                    padding: "8px 14px",
                    borderRadius: 6,
                    border: "none",
                    background: disabled ? "#ddd" : "#0070f3",
                    color: "white",
                    cursor: disabled ? "not-allowed" : "pointer",
                }}
            >
                {disabled ? "Adding..." : "Add"}
            </button>
        </form>
    );
}
