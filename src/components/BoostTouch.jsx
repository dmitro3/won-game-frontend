import { Spinner } from "@material-tailwind/react";
import React from "react";

const BoostTouch = ({onClick, hidden, src, unit, isInUsing, value, className}) => {

    return (
        <div className={`flex flex-col bg-[#FFC658EE] rounded-lg relative 
            ursor-pointer h-fit px-1 border-b-[3px] border-r-[3px] border-[#c18f2d] shadow ` + className}
            onClick={onClick} 
            style={{visibility: hidden ? "hidden" : "visible"}}>
            <img src={src} alt='weapon' className="w-[40px] h-[40px] p-[4px]"/>
            <p className='text-deep-orange-900 w-[24px] h-[24px] absolute 
                font-bold text-[12px] rounded-[12px] flex justify-center 
                items-center top-[14px] left-[22px] bg-white/60 leading-[10px]'>+<br/>{unit}</p>
            <p className='text-deep-orange-900 font-extrabold text-[16px] flex mx-auto'>
                {isInUsing ? <Spinner /> : value}
            </p>
        </div>
    );
};

export default BoostTouch;
