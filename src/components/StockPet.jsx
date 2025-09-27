import React from "react";
import PetManager from "./PetManager";
import backgroundImg from "../assets/home.png";

export default function StockPet() {
    return (
        <>
            <div className="overflow-hidden h-screen w-screen absolute top-0 left-0 opacity-5">
                <div class="bubble one"></div>
                <div class="bubble two"></div>
                <div class="bubble three"></div>
                <div class="bubble four"></div>
                <div class="bubble five"></div>
                <div class="bubble six"></div>
                <div class="bubble seven"></div>
                <div class="bubble eight"></div>
                <div class="bubble nine"></div>
                <div class="bubble ten"></div>
            </div>
            <div
                style={{
                    backgroundImage: `url(${backgroundImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    minWidth: "100vw",
                    height: "100vh",
                    width: "100vw",
                    overflow: "hidden",
                }}
            >
                <PetManager />
            </div>
        </>
    );
}
