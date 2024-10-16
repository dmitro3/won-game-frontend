import React from "react";

const MineCharacter = ({character, armor, shield}) => {

    return (
        <div className="relative">
            <img src={character ? character : '/assets/character/man1.png'} alt="logo" className="w-[100px]"/>
            <img src={armor ? armor : `/assets/weapon/weapon1.png`} alt="logo" className="w-[70px] absolute top-[55px] left-[calc(50%-85px)] rotate-[-27deg]"/>
            <img src={shield ? shield : `/assets/shield/shield1.png`} alt="logo" className="w-[70px] absolute top-[70px] left-[calc(50%-5px)] rotate-[37deg]"/>
            {/* <img src={character} alt="logo" className="w-[100px]"/>
            <img src={armor} alt="logo" className="w-[70px] absolute top-[75px] left-[calc(50%-85px)] rotate-[-27deg]"/>
            <img src={shield} alt="logo" className="w-[70px] absolute top-[80px] left-[calc(50%-5px)] rotate-[37deg]"/> */}
        </div>
    );
};

export default MineCharacter;
