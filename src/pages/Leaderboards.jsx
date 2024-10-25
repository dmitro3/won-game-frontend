import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Animate from "../components/Animate";
import { getRanking } from '../actions/other';
import LeaderboardInfo from '../components/LeaderboardInfo';

const Leaderboard = () => {

    const data = useSelector((state) => state.other.ranking);
    const dispatch = useDispatch();
    const [type, setType] = useState("tokensEarned");
    const [avatar, setAvatar] = useState("/assets/img/token_click.png");

    useEffect(() => {
        dispatch(getRanking());
    }, []);

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

                    <div className='flex justify-between mb-4 mt-5'>
                        <img src="/assets/img/tokens.png" className="w-[90px] h-[30px] cursor-pointer border" style={{border: type == "tokensEarned" ? "1px solid" : "none"}} onClick={() => handleSelect('tokensEarned')}/>
                        <img src="/assets/img/taps.png" className='w-[90px] h-[30px] cursor-pointer' style={{border: type == "points" ? "1px solid" : "none"}} onClick={() => handleSelect('points')}/>
                        <img src="/assets/img/battles.png" className='w-[90px] h-[30px] cursor-pointer' style={{border: type == "pointsBalance" ? "1px solid" : "none"}} onClick={() => handleSelect('pointsBalance')}/>
                    </div>

                    {sortedData.map((user, idx) => (
                        user && 
                            <LeaderboardInfo key={idx} order={idx + 1} 
                                avatar={user.avatar ? user.avatar : '/assets/character/man1.png'} 
                                name={user.name} value={user[type]} />
                    ))}
                    
                </div>
            </div>
        </Animate>
    );
};

export default Leaderboard;
