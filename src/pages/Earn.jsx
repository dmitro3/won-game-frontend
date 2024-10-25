import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Spinner } from "@material-tailwind/react";
import Milestones from "../components/Milestones";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../actions/user';
import { updateActivity, updateActivityWithUser } from '../actions/activity';
import { showPayment } from '../actions/other';
import { useNavigate } from 'react-router-dom';
import { UPDATE_ACTIVITY_WITH_USER, UPDATE_USER_WITH_LIFE } from '../constants/activityConstants';
import Info from '../components/Info';
import BoostTouch from '../components/BoostTouch';
import Progressbar from '../components/Progressbar';
import TapButton from '../components/TapButton';
import LevelInfo from '../components/LevelInfo';
import CoinIndicator from '../components/CoinIndicator';

const slideUp = keyframes`
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-350px);
    }
`;

const SlideUpText = styled.div`
    position: absolute;
    animation: ${slideUp} 3s ease-out;
    font-size: 2.1em;
    color: #FFFC12a6;
    font-weight: 600;
    left: ${({ x }) => x}px;
    top: ${({ y }) => y}px;
    pointer-events: none; /* To prevent any interaction */
`;

const Earn = () => {
    const [coin, setCoin] = useState(0);
    const [tapped, setTapped] = useState(0);
    const [level, setLevel] = useState(0);
    const [tapLimit, setTapLimit] = useState(0);
    const [tapSpeed, setTapSpeed] = useState(0);
    const [currentEnergy, setCurrentEnergy] = useState(0);
    const [totalEnergy, setTotalEnergy] = useState(0);
    const [prev, setPrev] = useState([]);
    const [next, setNext] = useState([]);
    const [open, setOpen] = useState(false);
    const [rewardOpen, setRewardOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [counts, setCounts] = useState(0);
    const [clicks, setClicks] = useState([]);
    const [mine, setMine] = useState(null);
    const [isUsingHP, setIsUsingHP] = useState(false);
    const imageRef = useRef(null);
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.user);
    const activityData = useSelector((state)=> state.activity.activity);
    const mineData = useSelector((state) => state.mine.items);
    const levelData = useSelector((state)=> state.user.level);
    const telegramId = useSelector((state)=> state.other.telegramId);
    const [pendingUpdates, setPendingUpdates] = useState({});
    const pendingUpdatesRef = useRef({});

    let lockUpdate = false;

    const nav = useNavigate();

    const isEmpty = (val) => {
        if (!val) return true;
        if (Object.keys(val).length > 0) return false;
        if (val.length > 0) return false;

        return true;
    }

    useEffect(() => {
        if (!isEmpty(userData)) {
            setCurrentEnergy(userData.currentEnergy);
            setCounts(userData.points);
            setCoin(userData.tokens);
        }
    }, [userData]);

    useEffect(() => {
        if (!isEmpty(levelData)) {
            setLevel(levelData[0].levelIndex);
            setTotalEnergy(levelData[0].energy);
            setTapSpeed(levelData[0].tapSpeed);
            setPrev(levelData[0]);
            setNext(levelData[1]);
        }
    }, [levelData]);

    useEffect(() => {
        if (!isEmpty(activityData)) {
            setTapLimit(activityData.tapLimit);
        }
    }, [activityData]);
  
    useEffect(() => {
        let equipped = mineData.filter((item) => item.isWear);
        let attack = 0, defence = 0, health = 0, avatar = "";
        equipped.forEach((equip) => {
            if (equip.type == 'character') {health = equip.energy; avatar=equip.imageSrc;}
            else if (equip.type == 'attack') attack = equip.attribute;
            else if (equip.type == 'defence') defence = equip.attribute;
        });
        if (health < userData.energyLimit) health = userData.energyLimit;
        if (attack <= 0) attack = 3;
        if (defence <= 0) defence = 1;

        let user = {
            ...userData,
            curHealth: userData.currentEnergy,
            totalHealth: health,
            attack, defence, avatar
        };
        setMine(user);
        setTotalEnergy(health);
    }, [userData, mineData]);

    const updateLevel = () => {
        if(next.tapBalanceRequired > userData.tokens) {
            handleShowPayment();
        }
        else {
            setCoin((val)=> val-next.tapBalanceRequired);
            let data = {levelIndex: next.levelIndex, tokens: coin - next.tapBalanceRequired, energyLimit: totalEnergy + (next.energy - prev.energy)};
            dispatch(updateUser({telegramId, data}));
            let data_activity = {tapLimit: next.tapLimit};
            dispatch(updateActivity({telegramId, data_activity}));
        }
        handleOpen();
    }

    const handleOpen = () => setOpen((cur) => !cur);
    const handleAlertOpen = () => setAlertOpen((cur) => !cur);
    const handleRewardOpen = () => setRewardOpen((cur) => !cur);


    useEffect(() => {
        pendingUpdatesRef.current = pendingUpdates;
        console.log("Update user", pendingUpdatesRef.current);
    }, [pendingUpdates]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Object.keys(pendingUpdatesRef.current).length > 0 && !lockUpdate) {
                
                dispatch(updateActivityWithUser({
                    telegramId, 
                    data_activity: pendingUpdatesRef.current,
                }, () => lockUpdate = false));
                setPendingUpdates({});
                lockUpdate = true;
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);
  
    const handleClick = (e) => {
        if (tapLimit <= 0) return;

        let updatedEnergy = currentEnergy + tapSpeed;
        if (updatedEnergy > totalEnergy) updatedEnergy = totalEnergy;
      
        setCounts((prev) => prev + tapSpeed);
        setTapped((prev) => prev + tapSpeed);
        setTapLimit((prev) => prev - tapSpeed);
        setCurrentEnergy(()=> updatedEnergy);

        dispatch({
            type: UPDATE_ACTIVITY_WITH_USER,
            payload: {
                limit: tapLimit - tapSpeed,
                energy: updatedEnergy,
            }
        });

        const newUpdates = {
            ...pendingUpdatesRef.current,
            tapLimit: tapLimit - tapSpeed,
            currentEnergy: updatedEnergy,
            levelIndex: level,
            points: counts + tapSpeed,
        };
        setPendingUpdates(newUpdates);

        const { offsetX, offsetY, target } = e.nativeEvent;
        const { clientWidth, clientHeight } = target;
      
        const horizontalMidpoint = clientWidth;
        const verticalMidpoint = clientHeight;
      
        const animationClass =
            offsetX < horizontalMidpoint ? 
                "wobble-left" :
            offsetX > horizontalMidpoint ?
                "wobble-right" : 
            offsetY < verticalMidpoint ? 
                "wobble-top" : 
                "wobble-bottom";
      
        imageRef.current.classList.remove(
            "wobble-top",
            "wobble-bottom",
            "wobble-left",
            "wobble-right"
        );
        imageRef.current.classList.add(animationClass);
      
        setTimeout(() => {
            imageRef.current.classList.remove(animationClass);
        }, 500);
      
        const rect = e.target.getBoundingClientRect();
        const newClick = {
            id: Date.now(),
            x: e.clientX - rect.left,
            y: e.clientY - rect.bottom / 4 * 3,
        };
        setClicks((prevClicks) => [...prevClicks, newClick]);
      
        setTimeout(() => {
            setClicks((prevClicks) => prevClicks.filter((click) => click.id !== newClick.id));
        }, 1000);
    };

    const onFight = () => {
        if(currentEnergy == 0) handleAlertOpen();
        else {
            if (Object.keys(pendingUpdatesRef.current).length > 0) {
                dispatch(updateActivityWithUser({ 
                    telegramId, 
                    data_activity: pendingUpdatesRef.current,
                }));
            }
            console.log("lastChallenge", userData.lastChallenge)
            
            nav('/home/challenge');
        }
    }

    const onTournament = () => {
        if(currentEnergy == 0) handleAlertOpen();
        if (Object.keys(pendingUpdatesRef.current).length > 0) {
            dispatch(updateActivityWithUser({ 
                telegramId, 
                data_activity: pendingUpdatesRef.current,
            }));
        }
        else nav('/home/tournament');
    }

    const handleShowPayment = () => {
        dispatch(showPayment(true));
    }

    const handleEnergy = () => {
        if (mine.lifeItems <= 0) return;
        // if (isUsingHP) return;

        // setIsUsingHP(true);
        let curHealth = (currentEnergy + 100 > totalEnergy) ? totalEnergy : currentEnergy + 100;
        let lifeItems = mine.lifeItems - 1;
        setCurrentEnergy(curHealth);
        setMine((prev)=>{
            return {
                ...prev,
                curHealth: curHealth,
                lifeItems: lifeItems
            }
        });

        dispatch({
            type: UPDATE_USER_WITH_LIFE,
            payload: {
                lifeItems: lifeItems
            }
        });

        const newUpdates = {
            ...pendingUpdatesRef.current,
            currentEnergy: curHealth,
            lifeItems: lifeItems
        };
        setPendingUpdates(newUpdates);
    }

    return (
        <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 h-full overflow-y-auto">

            <div className="flex items-center justify-between mb-1">
                <div className='flex gap-2'>
                    <img src={mine && mine.avatar ? mine.avatar : "/assets/character/man1.png"} alt='Default User' className='w-[44px] h-[54px] border rounded-lg bg-blue-gray-600' />
                    <div className='flex flex-col'>
                        <p className="text-lg font-semibold">{userData.name}</p>
                        <div className='flex gap-2'>
                            <p className="text-md font-semibold text-yellow-500">Lv.{userData.levelIndex}</p>
                            <TapButton text="Up" size='sm' onClick={handleOpen} />
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-1 items-end'>
                    <div className='flex gap-2 items-center'>
                        <img src="/assets/img/loader.webp" alt='coin' width="30px" height="30px" />
                        <p className='text-white text-lg'>{coin}</p>
                        <TapButton text="+" size='sm' onClick={handleShowPayment} />
                    </div>
                    
                    <div className='flex gap-5'>
                        <CoinIndicator icon='/assets/challenge/attack.png' 
                            size='sm' value={mine && mine.attack} iconDelta={4} />
                        <CoinIndicator icon='/assets/challenge/defence.png' 
                            size='sm' value={mine && mine.defence} iconDelta={4} />
                    </div>
                
                    <Dialog size="xs" open={open} className="bg-[#F47E5777]">
                        <DialogHeader className="justify-between">
                            <Typography variant="h4" color="white">
                                Upgrade Level
                            </Typography>
                            <div className='flex justify-center gap-3 items-center'>
                                <img src="/assets/img/loader.webp" alt='coin' width="24px" height="24px" />
                                <p className='text-yellow-600 text-[24px]'>{userData.tokens}</p>
                            </div>
                        </DialogHeader>

                        <DialogBody className="justify-center">
                            <div className='flex gap-5 justify-center px-[20%] items-center mb-5 mt-5'>
                                
                                <LevelInfo level={prev} color='blue' />

                                <img src="/assets/img/arrow.png" alt="arrow" 
                                    className='md:w-[32px] xs:w-[16px] h-[16px]' />
                                
                                <LevelInfo level={next} color='red' />

                            </div>
                        </DialogBody>

                        <DialogFooter className="justify-center gap-10 ">

                            <TapButton onClick={updateLevel} text="Level Up" className='mb-3' boost={next.tapBalanceRequired} />
                            <TapButton onClick={handleOpen} text="Cancel" className='mb-3' />
                        
                        </DialogFooter>
                    </Dialog>
                </div>
            </div>

            <Progressbar current={currentEnergy} total={totalEnergy} />
            
            <div className='mt-6'>
                <Dialog size="sm" open={rewardOpen} className="bg-[#F47E5777] px-4 text-center">
                    <Milestones />
                    <TapButton onClick={handleRewardOpen} text="Close" className='mb-3' />
                </Dialog>
              
                <div className='flex justify-between p-2'>
                    <div className='flex flex-col pl-5 cursor-pointer' onClick={()=> onFight()}>
                        <img src="/assets/img/fight.png" alt='tap' className="w-[100px] h-[120px] block"/>
                        <p className='font-bold mt-1'>Fight</p>
                    </div>
                    <div className='flex flex-col cursor-pointer' onClick={()=> onTournament()}>
                        <img src="/assets/img/tournament1.png" alt='tap' className="w-[100px] h-[120px] block mx-auto"/>
                        <p className='font-bold mt-1 text-center'>Tournament</p>
                    </div>
                </div>

                <Dialog size="sm" open={alertOpen} className="bg-[#F47E5777] px-4 text-center">
                    <p className='text-[24px] text-white font-bold text-center mt-5 mb-5'>You should increase your energy!</p>
                    <TapButton onClick={handleAlertOpen} text="Close" className='mb-3' />
                </Dialog>

                <div className="flex flex-col justify-center items-center mt-[40px] mb-2">
                    <div className="flex justify-center relative">
                        <img src={userData.icon ?? "/assets/img/tap.png"} alt='tap' onPointerDown={handleClick} ref={imageRef} className="w-[180px] h-[160px] block cursor-pointer"/>
                        {clicks.map((click) => (
                            <SlideUpText key={click.id} x={click.x} y={click.y}>
                            +{tapSpeed}
                            </SlideUpText>
                        ))}
                    </div>
                    <div className='flex mt-1'>
                        <Info>{tapped} Clicks / { tapLimit } Taps Limit</Info>
                    </div>
                    
                    <div className='flex w-full px-1 justify-between'>
                        <img src="/assets/img/reward.png" alt='Default User' className='w-[60px] h-[72px] cursor-pointer mt-[-110px]' onClick={handleRewardOpen}/>

                        <BoostTouch 
                            className="mt-[-120px]"
                            onClick={handleEnergy}
                            hidden={mine && mine.lifeItems == 0}
                            src="/assets/img/heart.png"
                            unit={100}
                            isInUsing={isUsingHP}
                            value={mine && mine.lifeItems} />
                    
                    </div>
                
                </div>
            </div>
        </div>
    );
};

export default Earn;