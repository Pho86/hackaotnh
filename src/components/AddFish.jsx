import React, { useState } from "react";
import Swimming from "./Swimming";

export default function AddFish() {
  const [fishList, setFishList] = useState([]);

  const handleAddFish = () => {
    const newFish = { x: 960, y: 540 };
    setFishList([...fishList, newFish]);
  };

  return (
    <div>
      <button onClick={handleAddFish}>Add Fish</button>

      {fishList.map((fish) => (
        <Swimming key={fish.id} startX={fish.startX} startY={fish.startY} />
      ))}
    </div>
  );
}
