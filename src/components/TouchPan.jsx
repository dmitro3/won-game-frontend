import React, { useState, useRef, useEffect } from 'react';
import { Progress, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react";
import Milestones from "./Milestones";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateUser } from '../actions/user';
import { viewActivity, updateActivity } from '../actions/activity';
import { showPayment, getChallenge } from '../actions/other';
import { useNavigate } from 'react-router-dom';
import { isSafeValue } from '../utils';

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

const TouchPan = () => {
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
  const [clicks, setClicks] = useState([]);
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const activityData = useSelector((state)=> state.activity.activity);
  const levelData = useSelector((state)=> state.user.level);
  const nav = useNavigate();
  
  useEffect(() => {
      dispatch(loadUser());
      dispatch(viewActivity());
  },[]);
  const isEmpty = (val) => {
    if (!val) return true;
    if (Object.keys(val).length > 0) return false;
    if (val.length > 0) return false;

    return true;
  }

  useEffect(() => {
    if (!isEmpty(userData)) {
        setCurrentEnergy(userData.currentEnergy);
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
        setTapLimit(() => activityData.tapLimit);
    }
  }, [activityData]);

  const updatelevel = () => {
    if(next.tapBalanceRequired > userData.tokens) {
      handleShowPayment();
    }
    else {
      setCoin((val)=> val-next.tapBalanceRequired);
      dispatch(updateUser({levelIndex: next.levelIndex, tokens: coin - next.tapBalanceRequired, energyLimit: next.energy}));
      dispatch(updateActivity({tapLimit: next.tapLimit}));
    }
    handleOpen();
  }

  const handleOpen = () => setOpen((cur) => !cur);
  const handleAlertOpen = () => setAlertOpen((cur) => !cur);
  const handleRewardOpen = () => {
    setRewardOpen((cur) => !cur);
  }

  const handleClick = (e) => {
    if (tapLimit <= 0) return;
    setTapped(prev => prev + tapSpeed);
    setTapLimit(prev => prev - tapSpeed);
    dispatch(updateActivity({tapLimit: tapLimit - tapSpeed}));
    if (currentEnergy < totalEnergy) {
      setCurrentEnergy(prev => prev + tapSpeed);
      dispatch(updateUser({
        currentEnergy: currentEnergy + tapSpeed,
        levelIndex: level
      }));
    }
    
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth;
    const verticalMidpoint = clientHeight;

    const animationClass =
    offsetX < horizontalMidpoint
        ? "wobble-left"
        : offsetX > horizontalMidpoint
        ? "wobble-right"
        : offsetY < verticalMidpoint
        ? "wobble-top"
        : "wobble-bottom";

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
        id: Date.now(), // Unique identifier
        x: e.clientX - (rect.left),
        y: e.clientY - (rect.bottom/4*3),
    };
    setClicks((prevClicks) => [...prevClicks, newClick]);
    // Remove the click after the animation duration
    setTimeout(() => {
    setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
    );
    }, 1000); // Match this duration with the animation duration
  };

  const onFight = () => {
    if(currentEnergy == 0) handleAlertOpen();
    else {
      dispatch(getChallenge(isSafeValue(userData.lastChallenge, 1)));
      nav('/home/challenge');
    }
  }

  const onTournament = () => {
    if(currentEnergy == 0) handleAlertOpen();
    else nav('/home/tournament');
  }

  const handleShowPayment = () => {
    dispatch(showPayment(true));
  }

  return (
    <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 rounded-lg shadow-lg">
      {/* User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className='flex gap-2'>
          <img src='/assets/img/user/male-2.webp' alt='Default User' className='w-[44px] h-[48px] border rounded-lg p-1 bg-blue-gray-600' />
          <div className='flex flex-col'>
            <p className="text-lg font-semibold">{userData.name}</p>
            <p className="text-md font-semibold text-yellow-500">Lv.{userData.levelIndex}</p>
          </div>
        </div>
        <div className='flex flex-col gap-1 items-end w-[65%] relative'>
          <div className='flex gap-2 items-center'>
            <img src="/assets/img/loader.webp" alt='coin' width="30px" height="30px" />
            <p className='text-white text-lg'>{coin}</p> 
            <div className="border rounded-lg px-2 bg-brown-900 hover:bg-green-700 font-bold text-yellow-400 hover:text-white cursor-pointer" onClick={handleShowPayment}>+</div>
          </div>
          <Progress value={(currentEnergy / totalEnergy) * 100} className="bg-gray-500" size="lg" color='red' />
          <p className='absolute bottom-[-8%] left-[10%] text-[14px]'>{currentEnergy} / {totalEnergy}</p>
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
                <div className='rounded-lg flex flex-col'>
                    <div className='bg-blue-900 py-1 px-2 text-[24px] text-white text-center'>Lv.{prev.levelIndex}</div>
                    <div className='flex flex-col justify-center p-2 bg-blue-400 lg:px-8 sm:px-1'>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/heart.png" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{prev.energy}</p>
                        </div>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/loader.webp" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{prev.tapLimit}</p>
                        </div>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/speed.png" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{prev.tapSpeed}</p>
                        </div>
                    </div>
                </div>
                <img src="/assets/img/arrow.png" alt="arrow" className='md:w-[32px] xs:w-[16px] h-[16px]' />
                <div className='rounded-lg flex flex-col'>
                    <div className='bg-red-900 py-1 px-2 text-[24px] text-white text-center'>Lv.{next.levelIndex}</div>
                    <div className='flex flex-col justify-center p-2 bg-red-400 lg:px-8 sm:px-1'>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/heart.png" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{next.energy}</p>
                        </div>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/loader.webp" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{next.tapLimit}</p>
                        </div>
                        <div className='flex justify-center gap-3 rounded-full bg-blue-gray-700 px-4 py-2 mb-2 items-center'>
                            <img src="/assets/img/speed.png" alt='coin' width="14px" height="14px" />
                            <p className='text-white text-[16px]'>{next.tapSpeed}</p>
                        </div>
                    </div>
                </div>
              </div>
            </DialogBody>
            <DialogFooter className="justify-center gap-10 ">
              <Button color='green' onClick={updatelevel} disabled={prev.levelIndex == 6}>
                <p className='text-yellow-500 font-bold text-[14px] mb-1'>Level Up</p>
                <div className='flex justify-center gap-2'>
                  <img src="/assets/img/loader.webp" alt='coin' width="16px" height="16px" />
                  <p className='text-yellow-500 font-bold text-[16px]'>{next.tapBalanceRequired}</p>
                </div>
              </Button>
              <Button onClick={handleOpen} className='py-5 px-8 text-[14px]'>Cancel</Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
      <div className='mt-6'>
        <Dialog size="sm" open={rewardOpen} className="bg-[#F47E5777] px-4">
          <Milestones />
          <Button onClick={handleRewardOpen} className='text-[16px] flex mx-auto mb-3 sm:px-4 sm:py-2 px-2 py-1' color="blue">Close</Button>
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

        <Dialog size="sm" open={alertOpen} className="bg-[#F47E5777] px-4">
          <p className='text-[24px] text-white font-bold text-center mt-5 mb-5'>You should increase your energy!</p>
          <Button onClick={handleAlertOpen} className='text-[16px] flex mx-auto mb-3 sm:px-4 sm:py-2 px-2 py-1' color="blue">Close</Button>
        </Dialog>

        <div className="flex flex-col justify-center items-center mt-[20px] mb-2">
          <div className="flex justify-center relative">
              <img src={userData.icon ?? "/assets/img/tap.png"} alt='tap' onPointerDown={handleClick} ref={imageRef} className="w-[240px] h-[220px] block cursor-pointer"/>
              {clicks.map((click) => (
                  <SlideUpText key={click.id} x={click.x} y={click.y}>
                  +{tapSpeed}
                  </SlideUpText>
              ))}
          </div>
          <div className='flex mt-1'>
            <p className="text-center text-xl font-bold border bg-green-700 rounded-lg px-2 py-1"> {tapped} Clicks</p>
            <p className='border bg-blue-800 px-2 py-1 rounded-lg text-[18px]'>{ tapLimit } Taps Limit</p>
          </div>
          <div className='flex justify-between w-full px-1'>
            <img src="/assets/img/reward.png" alt='Default User' className='w-[60px] h-[72px] cursor-pointer mt-[-100px]' onClick={handleRewardOpen}/>
            <img src="/assets/img/levelup.png" alt='Default User' className='w-[60px] h-[72px] cursor-pointer mt-[-100px]' onClick={handleOpen}/>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TouchPan;
