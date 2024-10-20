import React, { useEffect, useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import Animate from "../components/Animate";
import { getRanking } from '../actions/other';

const Leaderboard = () => {

    const data = useSelector((state) => state.other.ranking);
    const dispatch = useDispatch();
    const [type, setType] = useState("tokensEarned");
    const [avatar, setAvatar] = useState("/assets/img/token_click.png");

    useEffect(() => {
        dispatch(getRanking());
    }, [dispatch]);

    const sortedData = [...data].sort((a, b) => b[type] - a[type]);
    const handleSelect = (selectedType) => {
        setType(selectedType);
        if(selectedType == "tokensEarned") setAvatar("/assets/img/token_click.png");
        if(selectedType == "points") setAvatar("/assets/img/tap_click.png");
        if(selectedType == "pointsBalance") setAvatar("/assets/img/battle_click.png");
    };

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white h-[100%] overflow-y-auto pb-[100px]">
                <img src="/assets/img/ranking_header.png" className='w-[350px] h-[100px] mx-auto mt-[30px]' />
                <div className='px-[30px]'>
            {/* <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 rounded-lg shadow-lg h-[100%] overflow-y-auto bg-[url('/assets/img/ranking.png')] bg-contain bg-center bg-no-repeat pt-[22vh] px-[30px]"> */}
                    <div className='flex justify-between mb-4 mt-5'>
                        <img src="/assets/img/tokens.png" className="w-[90px] h-[30px] cursor-pointer border" style={{border: type == "tokensEarned" ? "3px solid" : "none"}} onClick={() => handleSelect('tokensEarned')}/>
                        <img src="/assets/img/taps.png" className='w-[90px] h-[30px] cursor-pointer' style={{border: type == "points" ? "3px solid" : "none"}} onClick={() => handleSelect('points')}/>
                        <img src="/assets/img/battles.png" className='w-[90px] h-[30px] cursor-pointer' style={{border: type == "pointsBalance" ? "3px solid" : "none"}} onClick={() => handleSelect('pointsBalance')}/>
                    </div>

                    {/* Display sorted data */}
                    {sortedData.map((user, idx) => (
                        user && (
                            <div key={idx} className="p-4 bg-deep-orange-400 rounded-lg shadow-lg mb-2 flex justify-between">
                                <div className='flex gap-2 items-center'>
                                    <Typography variant="h6">
                                        {idx + 1}
                                    </Typography>
                                    <img
                                        src={user.avatar ? user.avatar : '/assets/character/man1.png'}
                                        alt="avatar"
                                        className="h-[30px] w-[30px] rounded-full"
                                    />
                                    <Typography variant="h6" color="white">
                                        {user.name}
                                    </Typography>
                                </div>

                                <div className='flex gap-2 items-center'>
                                    <Typography color="yellow" className="font-bold" variant='h6'>
                                        {user[type]} {/* Display the selected type value */}
                                    </Typography>
                                    {/* <img src={avatar} alt="coin" width="20px" height="15px" /> */}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </Animate>
    );
};

export default Leaderboard;
