import React from "react";
import CoinIndicator from "./CoinIndicator";

const UserInfo = ({user, color = 'red'}) => {

    return (
        <div className={`flex flex-col justify-start border-[5px] border-${color}-500 py-4 px-2 rounded-lg bg-[#6CF47F66]`}>
            <img src={user && user.avatar ? user.avatar : "/assets/character/man1.png"} alt='avatar' 
                className="w-[120px] h-[160px] mx-auto"/>
            <CoinIndicator className='justify-start' 
                icon="/assets/img/heart.png" value={user && user.curHealth} size='lg' />
            <CoinIndicator className='justify-start' 
                icon="/assets/challenge/attack.png" value={user && user.attack} size='lg' />
            <CoinIndicator className='justify-start' 
                icon="/assets/challenge/defence.png" value={user && user.defence} size='lg' />
            <CoinIndicator className='justify-start' 
                icon="/assets/img/loader.webp" value={user && user.tokens} size='lg' />
        </div>
    );
};

export default UserInfo;
