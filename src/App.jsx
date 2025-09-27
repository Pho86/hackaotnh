import AddFish from "./components/addFish";
import Draggable from "./components/Draggable";
import Droppable from "./components/Droppable";
import Swimming from "./components/Swimming";

import { DndContext } from "@dnd-kit/core";
import React, { useState } from "react";

function App() {
  const [parent, setParent] = useState(null);
  const draggable = <Draggable id="draggable">Go ahead, drag me.</Draggable>;

  // game states
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center ">
      {isGameOver ? (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-2xl font-bold">Game Over</h1>
        </div>
      ) : null}
      <div className="fixed top-2 left-2 flex flex-col text-left justify-center ">
        <h1 className="text-2xl font-bold">Time: {time}</h1>
        <h1 className="text-2xl font-bold">Score: {score}</h1>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        {!parent ? draggable : null}
        <Droppable id="droppable">
          {parent === "droppable" ? draggable : "Drop here"}
        </Droppable>
      </DndContext>
      <AddFish />
    </div>
  );

  function handleDragEnd({ over }) {
    setParent(over ? over.id : null);
    setScore(score + 1);
    setTime(time + 1);
  }
}

export default App;
