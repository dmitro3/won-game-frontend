import React, { useState, useRef, useEffect } from 'react';
import { Progress, Button } from "@material-tailwind/react";
import { PiHandTap, PiCheckFatFill } from 'react-icons/pi';
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { viewUser, updateUser } from '../actions/earn';
import { showPayment, getChallenge } from '../actions/other';
import { viewMilestones, updateMilestone } from '../actions/milestone';
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
    color: #ffffffa6;
    font-weight: 600;
    left: ${({ x }) => x}px;
    top: ${({ y }) => y}px;
    pointer-events: none; /* To prevent any interaction */
`;

const saveFlag = false;

const TouchPan = () => {
  // Default image URL
  const [coin, setCoin] = useState(0);
  const [tapped, setTapped] = useState(0);
  const [level, setLevel] = useState(0);
  const [tapLimit, setTapLimit] = useState(100);
  const [tapSpeed, setTapSpeed] = useState(1);
  const [currentEnergy, setCurrentEnergy] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [clicks, setClicks] = useState([]);
  const defaultImage = '/assets/img/user/male-2.webp'; // Replace with your default image URL
  const imageRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.earn.user);
  const levelData = useSelector((state) => state.earn.level);
  const milestoneData = useSelector((state) => state.milestone.milestones);
  const nav = useNavigate();
  
  useEffect(() => {
      dispatch(viewMilestones());
      console.log("View User");
      dispatch(viewUser());
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
          setTotalEnergy(levelData.tapBalanceRequired);
          setTapLimit(levelData.tapLimit);
      }
  }, [levelData]);

  const updatelevel = () => {
      dispatch(updateUser({level: level + 1}));
      setLevel(level + 1);
      setTotalEnergy(level.tapBalanceRequired);
      setTapLimit( userData.tapLimit);
      setImgUrl(userData.icon);
  }

  const handleMilestoneClick = (id) => {
    console.log('Selected item id:', id); // You can see the clicked item's ID in the console
    dispatch(updateMilestone({id: id}));
  }

  const handleClick = (e) => {
    if (tapLimit <= 0) return;

    setTapped(prev => prev + tapSpeed);
    setTapLimit(prev => prev - tapSpeed);

    if (currentEnergy < totalEnergy) {
      setCurrentEnergy(prev => prev + tapSpeed);
      console.log("Current energy", currentEnergy);
      dispatch(updateUser({
        currentEnergy: currentEnergy + tapSpeed,
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
        x: e.clientX - (rect.left/2),
        y: e.clientY,
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
    console.log("User Challenge", userData.lastChallenge);
    dispatch(getChallenge(isSafeValue(userData.lastChallenge, 1)));
    nav('/home/challenge');
  }

  const onTournament = () => {
    nav('/home/tournament');
  }

  const handleShowPayment = () => {
    console.log("Show");
    dispatch(showPayment(true));
  }

  return (
    <div className="max-w-sm mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      {/* User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-500 rounded-full p-2 w-14 h-14 flex items-center justify-center">
            <img 
              src={defaultImage} 
              alt='Default User'
              className='w-[36px] h-[48px]' 
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{userData.name}</h2>
            {/* <p>Knight</p> */}
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <img 
            src="/assets/img/loader.webp"
            alt='coin' 
            width="30px"
            height="30px"
          />
          <p className='text-white text-lg'>{userData.tokens}</p> 
          <Button color='green' size='sm' onClick={handleShowPayment}>+</Button>
        </div>
      </div>

      <div className='mt-4'>
        {/* Taps Left Button */}
        

        <div className="w-full mb-4">
          <p className="mb-1">Energy : {currentEnergy} / {totalEnergy} </p>
          <Progress value={(currentEnergy / totalEnergy) * 100} className="bg-gray-500" color='green'/>
        </div>

        {/* <Button 
          className="w-full mb-4 flex gap-3 justify-center items-center text-[16px] border" 
          color={coin >= levelData.tapBalanceRequired ? "yellow" : "gray"} 
          onClick={updatelevel}
          disabled={level > 6 || coin < levelData.tapBalanceRequired}
        >
          Level Up <PiArrowFatLinesUpFill size={18} className='text-[#000000] text-btn4'/> {levelData.tapBalanceRequired}
        </Button> */}
        {milestoneData.map((item, idx)=>{
          return(
            <div key={idx} className='flex justify-between px-4 border rounded-lg py-2 mb-4'>
              <div className='flex gap-2 items-center'>
                <img src={item.imgSrc} alt='weapon' className="w-[40px] h-[40px]"/>
                <p className='text-white font-extrabold text-[14px]'>{item.title}</p>
              </div>
              {!item.isReceived ?
              <Button color='green' className='flex gap-1 items-center' disabled={item.isFailed}>
                <img 
                    src="/assets/img/loader.webp"
                    alt='coin' 
                    width="20px"
                    height="20px"
                />
                <p className='text-white text-[16px]'>+{item.reward}</p>
              </Button>:
              <PiCheckFatFill size={36} className='text-[green] text-btn4'/>}
            </div>
          )
        })}
        
        <div className='flex justify-between p-2'>
          <div className='flex flex-col cursor-pointer' onClick={()=> onFight()}>
            <img src="/assets/img/fight.png" alt='tap' className="w-[40px] h-[60px] block"/>
            <p className='font-bold mt-1'>Fight</p>
          </div>
          <div className='flex flex-col cursor-pointer' onClick={()=> onTournament()}>
            <img src="/assets/img/tournament.png" alt='tap' className="w-[40px] h-[60px] block mx-auto "/>
            <p className='font-bold mt-1 text-center'>Tournament</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center mt-[-30px] mb-2">
              <div className="flex justify-center">
                  <img src={userData.icon ?? "/assets/img/bronze.webp"} alt='tap' onPointerDown={handleClick} ref={imageRef} className="w-[100px] h-[100px] block cursor-pointer"/>
                  {clicks.map((click) => (
                      <SlideUpText key={click.id} x={click.x} y={click.y}>
                      +{tapSpeed}
                      </SlideUpText>
                  ))}
              </div>
              <p className="text-center text-xl font-bold"> {tapped} Clicks</p>
        </div>

        <div className="flex justify-center w-full mb-4 rounded-md py-1 bg-teal-500 gap-2 items-center">
          { tapLimit } Taps Limit<PiHandTap size={18} className='text-[#ffffff] text-btn4'/>
        </div>
      </div>
    </div>
  );
};

export default TouchPan;
