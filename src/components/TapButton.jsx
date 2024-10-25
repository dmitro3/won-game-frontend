import { Spinner } from "@material-tailwind/react";
import React from "react";

const TapButton = ({onClick, text, size, className, busy, boost = 0}) => {

    let clsName = '';

    if (size == 'sm') {
        clsName = 'px-2 border-b-[3px] border-r-[3px]';
    } else if (size == 'lg') {
        clsName = 'min-w-[140px] py-2 border-b-[4px] text-[20px] border-r-[4px]';
    } else {
        clsName = 'min-w-[80px] py-1 border-b-[4px] text-[16px] border-r-[4px]';
    }

    return (
        <button className={`bg-[#FFC658] hover:bg-[#FFC658EE] 
            text-[#C94A0C] font-bold px-2 border-b-[3px] 
            border-r-[3px] border-[#c18f2d] shadow rounded ${clsName} ${className}`} onClick={onClick}>
                <div className="flex justify-center">
                    {busy ? <Spinner /> : text}
                </div>

                {
                    boost > 0 && 
                    <div className='flex justify-center items-center gap-2'>
                        <img src="/assets/img/loader.webp" alt='coin' width="16px" height="16px" />
                        <p>{boost}</p>
                    </div>
                }

        </button>
    );
};

export default TapButton;
