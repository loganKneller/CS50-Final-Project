"use client";

import { useState } from "react";

// cells per each side of the grid.
const SIZE = 16;

// these are the 4 things we're allowing to be in a cell.
type Cell = "empty" | "wall" | "start" | "goal";

const COLORS: Record<Cell, string> = {
  empty: "#ffffff",
  wall: "#333333",
  start: "#e03131",
  goal: "#1971c2",
};

// this is a basic layout with a start in the top left and the goal in the bottom right
function makeGrid(): Cell[] {
  const cells: Cell[] = new Array(SIZE * SIZE).fill("empty");
  cells[0] = "start";
  cells[SIZE * SIZE - 1] = "goal";
  return cells;
}

export default function Home() {
  // The grid itself is an array of length SIZE * SIZE
  // For indexing: Cell (x, y) lives at index y * SIZE + x, since this is a 1d representation of a matrix
  const [cells, setCells] = useState<Cell[]>(makeGrid);

  // Tool that the user is "painting" with
  const [tool, setTool] = useState<Cell>("wall");

  // Called when the user clicks cell number `index`
  function paint(index: number) {
    setCells((old) => {
      const next = [...old];

      if (tool === "start" || tool === "goal") {
        // Erase the old start/end cell when adding a new one
        const existing = next.indexOf(tool);
        if (existing !== -1) next[existing] = "empty";
        next[index] = tool;
      } else if (tool === "wall") {
        // Clicking a wall removes it, clicking anything else makes a wall
        if (next[index] === "start" || next[index] === "goal") return old;
        next[index] = next[index] === "wall" ? "empty" : "wall";
      } else {
        // The eraser
        next[index] = "empty";
      }

      return next;
    });
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Reinforcement Learning Playground</h1>

      {/* Tool picker */}
      <div className="my-4 flex gap-2">
        {(["wall", "start", "goal", "empty"] as Cell[]).map((t) => (
          <button
            key={t}
            onClick={() => setTool(t)}
            className="border px-3 py-1"
            style={{
              fontWeight: tool === t ? "bold" : "normal",
              background: tool === t ? "#eeeeee" : "transparent",
            }}
          >
            {t === "empty" ? "erase" : t}
          </button>
        ))}

        <button onClick={() => setCells(makeGrid())} className="border px-3 py-1">
          reset
        </button>
      </div>

      {/* The grid */}
      <div
        className="inline-grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 28px)`,
          background: "#cccccc",
          border: "1px solid #cccccc",
        }}
      >
        {cells.map((cell, index) => (
          <button
            key={index}
            onClick={() => paint(index)}
            style={{ width: 28, height: 28, background: COLORS[cell] }}
          />
        ))}
      </div>

      {/* this is what we'll send to the backend (Python) later! */}
      <p className="mt-4 text-sm">
        walls: {cells.filter((c) => c === "wall").length}
        {" · "}
        painting with: {tool}
      </p>
    </main>
  );
}
