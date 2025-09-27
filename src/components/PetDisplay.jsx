import React from 'react';


// TODO 
export default function PetDisplay({ mood, isSimulating }) {
    const getPetEmoji = () => {
        switch (mood) {
            case "happy":
                return "😺";
            case "sad":
                return "😿";
            case "neutral":
            default:
                return "😼";
        }
    };

    const getPetAnimation = () => {
        if (isSimulating) {
            return "animate-bounce";
        }
        return "";
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            {/* Pet Display */}
            <div className={`text-6xl ${getPetAnimation()}`}>
                {getPetEmoji()}
            </div>
        </div>
    );
};
