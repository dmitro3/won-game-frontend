import React, { useEffect, useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import Animate from "../components/Animate";
import { getRanking } from '../actions/other';

const Leaderboard = () => {

    const data = useSelector((state) => state.other.ranking);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getRanking());
    }, []);

    

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 rounded-lg shadow-lg h-[100%] overflow-y-auto bg-[url('/assets/img/ranking.png')] bg-contain bg-center bg-no-repeat pt-[22vh] px-[30px]">
                {data.map((user, idx) => {
                    return (
                        user && <div key={idx} className="p-4 bg-deep-orange-400 rounded-lg shadow-lg mb-2 flex justify-between">
                            <div className='flex gap-2 items-center'>
                                <Typography variant="h6" color={user.id <= 3 ? "red" : "white"}>
                                    {idx + 1}
                                </Typography>
                                <img src={user.avatar ? user.avatar : '/assets/character/man1.png'} alt="avatar" className="h-[30px] w-[30px] rounded-full" />
                                <Typography variant="h6" color="white">
                                    {user.name}
                                </Typography>
                            </div>
                            
                            <div className='flex gap-2 items-center'>
                                <Typography color="yellow" className="font-bold" variant='h6'>
                                    {user.tokens}
                                </Typography>
                                <img src="/assets/img/loader.webp" alt="coin" width="20px" height="15px" />
                            </div>
                            
                        </div>
                    )
                })}
            </div>
            
        </Animate>
        
    );
};

export default Leaderboard;
