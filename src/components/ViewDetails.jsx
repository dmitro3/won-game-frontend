import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { viewItem, wearItem } from '../actions/mine';

const ViewDetails = ({ selectedItemId, onSelectItem }) => {
    const dispatch = useDispatch();
    const indiMineData = useSelector((state) => state.mine.item);
    
    useEffect(() => {
        dispatch(viewItem({id: selectedItemId}));
    },[]);
    
    const handleWear = () => {
        dispatch(wearItem({id: selectedItemId, type: indiMineData.type}));
    }

    console.log("Item selected", indiMineData);
    return (
        <div className="flex justify-between p-3 border">
            <div className="flex gap-5">
                <div className="relative cursor-pointer"> 
                    <img src={indiMineData.imageSrc} alt={indiMineData.imageAlt} className='w-[80px] h-[80px]'/>
                    <div className="absolute bottom-[8%] left-[20%] border rounded-lg px-2 bg-deep-orange-500">Lv. {indiMineData.levelIndex}</div>
                </div>
                <div className="flex flex-col text-start justify-center">
                    <p className="text-white">Type: {indiMineData.type}</p>
                    {
                        indiMineData.type == 'character' &&
                        <p className="text-white">Health: {indiMineData.energy}</p>
                    }
                    {
                        indiMineData.type == 'attack' &&
                        <p className="text-white">Attack: {indiMineData.attribute}</p>
                    }
                    {
                        indiMineData.type == 'defence' &&
                        <p className="text-white">Defence: {indiMineData.attribute}</p>
                    }
                </div>
            </div>
            <div className="flex flex-col justify-center">
                <Button className="text-white px-2 py-1 text-[14px]" color="green" 
                    onClick={handleWear} disabled={indiMineData.isWear ? true : false}>
                    Choose
                </Button>
                {/* <Button className="text-white px-2 py-1 text-[14px]" color="orange">Sell</Button> */}
            </div>
        </div>
    );
}

export default ViewDetails;