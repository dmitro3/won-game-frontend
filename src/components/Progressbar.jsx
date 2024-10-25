import { Progress } from "@material-tailwind/react";
import React from "react";

const Progressbar = ({current, total}) => {

    return (
        <div className='relative'>
            <Progress value={(current / total) * 100} className="bg-gray-500" size="lg" color='red' />
            <p className='absolute bottom-[-5px] left-[40%] text-[14px] font-bold'>{current} / {total}</p>
        </div>
    );
};

export default Progressbar;
