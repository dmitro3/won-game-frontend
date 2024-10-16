import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@material-tailwind/react";
import { PiCheckFatFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { viewCharacters } from "../actions/character";

const Character = ({ onItemSelect }) => {
    const dispatch = useDispatch();
    const mineItems = useSelector((state) => state.mine.items);
    const characters = useSelector((state) => state.character.characters);
    
    useEffect(() => {
        dispatch(viewCharacters());
    },[]);

    return (
        <div className="grid grid-cols-2 gap-4 p-4 border-b-2">
        {
            characters.map((character) => {

                let filtered = mineItems.filter((item) => 
                    item.type == 'character' && item.title == character.title);
                let isLock = filtered.length == 0;

                return(
                    <div key={character._id} className="relative mb-3 border">
                        <img src={character.imageSrc} alt={character.imageAlt} className='w-full h-full'/>
                        <div className='absolute bottom-[-5%] border bg-blue-gray-900 w-full'>
                            <div className='flex px-2 justify-between mb-1'>
                                <div className='flex gap-2'>
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[12px]'>{character.energy}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <img 
                                        src="/assets/img/loader.webp"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[12px]'>{character.price}</p>
                                </div>
                            </div>
                            <div className=' px-2 flex justify-between mb-1'>
                                <div className='flex gap-2'>
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[12px]'>{character.attack}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="16px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[12px]'>{character.defence}</p>
                                </div>
                            </div>
                            {
                                isLock ? 
                                    <Button className="py-1 px-2 text-sm" color="green" 
                                        onClick={() => onItemSelect(character)}>Unlock</Button> : 
                                    <PiCheckFatFill size={28} className='text-[green] text-btn4 mx-auto'/>
                            }
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
}

export default Character;