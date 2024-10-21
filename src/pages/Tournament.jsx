import React, { useEffect } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import Animate from "../components/Animate";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMonsters, setFightMonster } from '../actions/other';
import { showPayment } from '../actions/other';

const Tournament = () => {

    const nav = useNavigate();
    const dispatch = useDispatch();
    const monsters = useSelector((state) => state.other.monster);
    const userData = useSelector((state) => state.earn.user);

    useEffect(() => {
        dispatch(getMonsters());
    }, []);

    const onFight = (monster) => {
        if(userData.tokens < monster.tokenSpend) {
            dispatch(showPayment(true));
            return;
        }
        dispatch(setFightMonster(monster));
        nav("/home/challenge");
    }

    
    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 h-full overflow-y-auto">

                <Typography variant="h3" color="white" className="text-center font-bold mb-6">
                    Tournament
                </Typography>

                {monsters.map((monster, idx) => (
                    <div key={idx} className="p-2 bg-green-600 rounded-lg shadow-lg mb-2 flex gap-2 items-center">
                        <img src={`/assets/monster/mon${monster.avatarIndex + 1}-1.png`} alt="avatar" 
                            className="h-[60px] w-[60px] rounded-lg border-2 border-red-600 bg-blue-gray-600" />
                        <div className='flex flex-grow justify-between'>
                            <div className='flex flex-col text-[12px] text-start'>
                                <p className='font-bold'>{monster.title}</p>
                                <div className='flex justify-between'>
                                    <p>Lv.{monster.levelIndex}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                    <div className='flex gap-1 items-center'>
                                        <img src="/assets/img/heart.png" alt="avatar" className="h-[12px] w-[12px] rounded-full" />
                                        <p>{monster.energyLimit}</p>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <div className='flex gap-1'>
                                        <img src="/assets/challenge/attack.png" alt="avatar" className="h-[14px] w-[14px] rounded-full" />
                                        <p>{monster.attack}</p>
                                    </div>
                                    <div className='flex gap-1'>
                                        <img src="/assets/challenge/defence.png" alt="avatar" className="h-[14px] w-[14px] rounded-full" />
                                        <p>{monster.defense}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col text-start text-[12px]'>
                                <div className='flex gap-2 items-center'>
                                    <img src="/assets/img/coin.webp" alt="avatar" className="h-[14px] w-[14px] rounded-full" />
                                    <p>{monster.tokenEarns}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <img src="/assets/img/loader.webp" alt="avatar" className="h-[14px] w-[14px] rounded-full" />
                                    <p>{monster.tokenSpend}</p>
                                </div>
                                <div className='border rounded-lg bg-deep-orange-800 px-2 cursor-pointer' onClick={()=> onFight(monster)}>
                                    Challenge    
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>
        </Animate>
        
    );
};

export default Tournament;
