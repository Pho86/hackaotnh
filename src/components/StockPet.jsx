import React from 'react';
import PetManager from './PetManager';

const SYMBOL = "AAPL";

export default function StockPet() {
    return <PetManager symbols={[SYMBOL]} />;
}