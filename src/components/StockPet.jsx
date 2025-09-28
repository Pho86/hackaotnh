import React from "react";
import PetManager from "./PetManager";
import backgroundImg from "../assets/background.png";

export default function StockPet() {
    return (
        <>
            <div className="overflow-hidden h-screen w-screen absolute top-0 left-0 opacity-5 pointer-events-none">
                <div className="bubble one"></div>
                <div className="bubble two"></div>
                <div className="bubble three"></div>
                <div className="bubble four"></div>
                <div className="bubble five"></div>
                <div className="bubble six"></div>
                <div className="bubble seven"></div>
                <div className="bubble eight"></div>
                <div className="bubble nine"></div>
                <div className="bubble ten"></div>
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
