import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import { PiCheckFatFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { viewItems } from '../actions/shop';

const ShopItem = ({ onItemSelect }) => {
    const dispatch = useDispatch();
    const shopData = useSelector((state) => state.shop.items);
    const mineItems = useSelector((state) => state.mine.items);
    
    useEffect(() => {
        dispatch(viewItems());
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
        {
            shopData.map((item) => {

                let filtered = mineItems.filter((bought) => 
                    bought.type == item.type && bought.title == item.title);
                let isBought = filtered.length > 0;
                
                return(
                    <div key={item._id} className="relative mb-3">
                        <img src={item.imageSrc} alt={item.imageAlt} className='w-full h-full'/>
                        <p className='absolute bottom-[20%] left-[27%] text-white text-[12px]'>Level: {item.level}</p>
                        <p className='absolute bottom-[7%] left-[18%] text-white text-[12px]'>Price: {item.price}</p>
                        <div className="absolute bottom-[-20px] left-[25%]">
                        {
                            !isBought ? 
                                <Button className="py-1 px-2 text-sm" color="green" 
                                    onClick={() => onItemSelect(item)}>Buy</Button> : 
                                <PiCheckFatFill size={36} className='text-[green] text-btn4'/>
                        }
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
}

export default ShopItem;