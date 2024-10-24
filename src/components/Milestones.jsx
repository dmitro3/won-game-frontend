import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@material-tailwind/react";
import { updateUser, loadUser } from '../actions/user';
import { viewActivity, updateActivity } from '../actions/activity';

const Milestones = () => {
    const [coin, setCoin] = useState(0);
    const [level, setLevel] = useState(0);
    const [earned, setEarned] = useState(0);
    const userData = useSelector((state) => state.user.user);
    const activityData = useSelector((state)=> state.activity.activity);
    const telegramId = useSelector((state)=> state.other.telegramId);
    const username = useSelector((state)=> state.other.username);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(viewActivity({telegramId, username}));
    },[]);

    const isEmpty = (val) => {
        if (!val) return true;
        if (Object.keys(val).length > 0) return false;
        if (val.length > 0) return false;
    
        return true;
    }
    
    useEffect(() => {
        if (!isEmpty(userData)) {
            setCoin(userData.tokens);
            setLevel(userData.levelIndex);
            setEarned(userData.tokensEarned);
        }
    }, [userData]);
  
    useEffect(() => {
    }, [activityData]);

    const receiveDailyReward = () => {
        let data_activity = {isDailyReceived: true};
        dispatch(updateActivity({telegramId, data_activity}));
        let data = {
            tokens: coin + (activityData.continueDate + 1) * 10, levelIndex: level, tokensEarned: earned + (activityData.continueDate + 1) * 10
        }
        dispatch(updateUser({telegramId, data}));
    }
    
    const receiveTapReward = () => {
        let data_activity = {isTapReceived: true};
        dispatch(updateActivity({telegramId, data_activity}));
        let data = {
            tokens: coin + 20, levelIndex: level, tokensEarned: earned + 20
        }
        dispatch(updateUser({telegramId, data}));
    }

    return (
        <div>
            <div className='flex justify-center mt-5'>
                <p className='text-white font-bold text-[36px]'>Rewards</p>
            </div>
            {activityData.continueDate !=0 ?
                <div className='flex justify-between px-2 sm:px-4 border rounded-lg py-1 sm:py-2 mb-4 mt-3'>
                    <div className='flex gap-2 items-center'>
                        <img src="/assets/img/daily.png" alt='weapon' className="w-[40px] h-[40px]"/>
                        <p className='text-white font-extrabold text-[14px]'>{activityData.continueDate + 1} days Login</p>
                    </div>
                    <Button color='green' className='flex gap-1 items-center sm:px-3 px-1 sm:py-2 py-1' onClick={receiveDailyReward} disabled={activityData.isDailyReceived}>
                        <img src="/assets/img/loader.webp" alt='coin' className="w-[20px] h-[20px]" />
                        <p className='text-white text-[16px] px-1 sm:px-2 py-1 sm:py-1'>{(activityData.continueDate+1)*10}</p>
                    </Button>
                </div>:
                <div className='flex justify-between px-2 sm:px-4 border rounded-lg py-1 sm:py-2 mb-4 mt-3'>
                    <div className='flex gap-2 items-center'>
                        <img src="/assets/img/daily.png" alt='weapon' className="w-[40px] h-[40px]"/>
                        <p className='text-white font-extrabold text-[14px]'>Daily Login</p>
                    </div>
                    <Button color='green' className='flex gap-1 items-center sm:px-3 px-1 sm:py-2 py-1' onClick={receiveDailyReward} disabled={activityData.isDailyReceived}>
                        <img src="/assets/img/loader.webp" alt='coin' className="w-[20px] h-[20px]" />
                        <p className='text-white text-[16px]'>{(activityData.continueDate+1)*10}</p>
                    </Button>
                </div>
            }
            {activityData.tapLimit == 0 &&
                <div className='flex justify-between px-4 border rounded-lg py-2 mb-4'>
                <div className='flex gap-2 items-center'>
                    <img src="/assets/img/platinum.webp" alt='tap' className="w-[40px] h-[40px]"/>
                    <p className='text-white font-extrabold text-[14px]'>100 Taps Click</p>
                </div>
                <Button color='green' className='flex gap-1 items-center' onClick={receiveTapReward} disabled={activityData.isTapReceived}>
                    <img src="/assets/img/loader.webp" alt='coin' className="w-[20px] h-[20px]" />
                    <p className='text-white text-[16px]'>20</p>
                </Button>
                </div>
            }
        </div>
        
    );
}

export default Milestones;