import { Typography } from "@material-tailwind/react";
import React from "react";

const LeaderboardInfo = ({order, avatar, icon, name, value}) => {

    return (
        <div className="p-4 bg-deep-orange-400 rounded-lg shadow-lg mb-2 flex justify-between">
            <div className='flex gap-2 items-center'>
                <Typography variant="h6">{order}</Typography>
                <img src={avatar}
                    alt="avatar"
                    className="h-[30px] w-[30px] rounded-full"
                />
                <Typography variant="h6" color="white">
                    {name}
                </Typography>
            </div>

            <div className='flex gap-2 items-center'>
                <Typography color="yellow" className="font-bold" variant='h6'>
                    {value}
                </Typography>
                {/* <img src={icon} alt="coin" width="20px" height="15px" /> */}
            </div>
        </div>
);
};

export default LeaderboardInfo;
