import React from "react";
import PetManager from "./PetManager";
import backgroundImg from "../assets/mainbg.png";

export default function StockPet() {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100dvh",
        width: "100dvw",
      }}
    >
      <PetManager />
    </div>
  );
}
