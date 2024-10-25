import React from "react";

const LevelInfo = ({level, color = 'red'}) => {

    return (
        <div className='flex flex-col'>
            <div className={`rounded-t-lg bg-${color}-900 py-1 px-2 text-[24px] text-white text-center`}>Lv.{level.levelIndex}</div>
            <div className={`rounded-b-lg flex flex-col justify-center p-2 bg-${color}-400 lg:px-8 sm:px-1`}>
                <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                    <img src="/assets/img/heart.png" alt='coin' width="14px" height="14px" />
                    <p className='text-white text-[16px]'>{level.energy}</p>
                </div>
                <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                    <img src="/assets/img/loader.webp" alt='coin' width="14px" height="14px" />
                    <p className='text-white text-[16px]'>{level.tapLimit}</p>
                </div>
                <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                    <img src="/assets/img/speed.png" alt='coin' width="14px" height="14px" />
                    <p className='text-white text-[16px]'>{level.tapSpeed}</p>
                </div>
            </div>
        </div>
    );
};

export default LevelInfo;
