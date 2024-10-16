import Animate from "../components/Animate";
import React, { useState, useRef, useEffect } from 'react';
import { Progress, Button, Typography } from "@material-tailwind/react";
import { PiHandTap, PiArrowFatLinesUpFill } from 'react-icons/pi';
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from 'react-redux';
import { viewUser, updateUser } from '../actions/earn';
import { getItem, viewAll } from '../actions/mine';
import { useNavigate } from 'react-router-dom';
import MineCharacter from '../components/MineCharacter';

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

let timer;
let timePos = 0;
const moveTime = 6;
let interval;

const Challenge = () => {
    const [characterPosition, setCharacterPosition] = useState(0);
    const [monsterPosition, setMonsterPosition] = useState(260);
    const [tapped, setTapped] = useState(0);
    const [coin, setCoin] = useState(0);
    const boostCoin = 100;
    const [tapLimit, setTapLimit] = useState(0);
    const [tokensEarned, setTokensEarned] = useState(0);
    const [clicks, setClicks] = useState([]);

    const [manAttack, setManAttack] = useState(40);
    const [manDefence, setManDefence] = useState(30);
    const [monHealth, setMonHealth] = useState(600);
    const [tapSpeed, setTapSpeed] = useState(0);
    const [currentEnergy, setCurrentEnergy] = useState(0);
    const [totalEnergy, setTotalEnergy] = useState(0);
    const imageRef = useRef(null);
    const [battleLimitTime, setBattleLimitTime] = useState(20);
    const [userAvatar, setUserAvatar] = useState('/assets/challenge/man1-1.png');
    const [monsterAvatar, setMonsterAvatar] = useState('/assets/challenge/mon1-1.png');
    const [dlgShow, setdlgShow] = useState("Visible");
    const nav = useNavigate();

    // const monster = {
    //     healthLimit: 1000,
    //     curHealth: 600,
    //     coin: 100,
    //     attack: 50,
    //     defence: 10
    // };
    
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.earn.user);
    const levelData = useSelector((state) => state.earn.level);
    const mineData = useSelector((state) => state.mine.items);
    const monster = useSelector((state) => state.other.fightMonster);
    
    const isEmpty = (val) => {
        if (!val) return true;
        if (Object.keys(val).length > 0) return false;
        if (val.length > 0) return false;

        return true;
    }

    useEffect(() => {
        console.log("Monster", monster);
        console.log("User", userData);
        console.log("Mine", mineData);
        let equipped = mineData.filter((item) => item.isWear);
        console.log("Equipped", equipped);
    }, [monster, userData, mineData]);

    // useEffect(() => {
    //     // Move the element every 10ms
    //     interval = setInterval(() => {
    //         if (timePos < moveTime) {
    //             setCharacterPosition(prevLeft => (prevLeft < window.innerWidth ? prevLeft + 20 : 0));
    //             setMonsterPosition(prevLeft => (prevLeft < window.innerWidth ? prevLeft - 20 : 0));
    //         } else {
    //             if ((timePos - moveTime) % 10 == 0) {
    //                 attackAniMine();
    //             }
    //             else if ((timePos - moveTime - 5) % 10 == 0) {
    //                 attackAniMonster();
    //             }
    //         }
    //         timePos++;
    //     }, 200);
    
    //     return () => clearInterval(interval); // Cleanup interval on component unmount
    // }, []);
    
    useEffect(() => {
        dispatch(viewUser());
        dispatch(getItem());
        dispatch(viewAll());

        // if (timer) clearInterval(timer);

        // timer = setInterval(() => {
        //     setBattleLimitTime((prev) => prev - 1);
        // }, 1000);


    }, []);
    
    useEffect(() => {
        if (battleLimitTime === 0) {

            dispatch(updateUser({
                tokensEarned: tokensEarned + monster.coin,
                tokens: currentEnergy > monHealth ? coin + monster.coin : coin - monster.coin,
                currentEnergy: currentEnergy,
                levelIndex: isEmpty(userData) ? 0 : userData.levelIndex,
            }))
            clearInterval(interval);
            clearInterval(timer);
        }

    }, [battleLimitTime]);

    useEffect(() => {
        if (!isEmpty(userData)) {
            setCurrentEnergy(userData.currentEnergy);
            setCoin(userData.tokens);
            setTokensEarned(userData.tokensEarned)
        }
    }, [userData]);

    useEffect(() => {
        if (!isEmpty(levelData)) {
            setTotalEnergy(levelData.tapBalanceRequired);
            setTapLimit(levelData.tapLimit);
            setTapSpeed(levelData.tapSpeed);
        }
    }, [levelData]);
    

    const handleClick = (e) => {
        if (tapLimit <= 0) return;

        setTapped(prev => prev + tapSpeed);
        setTapLimit(prev => prev - tapSpeed);

        if (currentEnergy < totalEnergy) setCurrentEnergy(prev => prev + tapSpeed);
        
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

    const attackAniMine = () => {
        setUserAvatar("/assets/challenge/man1-2.png");
        setMonHealth((health)=> {
            console.log("Man Attack", manAttack);
            return health - (manAttack - monster.defence);
        });
        setTimeout(() => {
            setUserAvatar("/assets/challenge/man1-1.png");
        }, 200);
    }

    const attackAniMonster = () => {
        setMonsterAvatar("/assets/challenge/mon1-2.png");
        setCurrentEnergy((energy)=>energy - (monster.attack - manDefence));
        setTimeout(() => {
            setMonsterAvatar("/assets/challenge/mon1-1.png");
        }, 200);
    }

    const handleAttack = () => {
        setManAttack((attack) => attack * 2);
    }

    const handleDefence = () => {
        setManDefence((defence) => defence * 2);
    }

    const handleEnergy = () => {
        setCurrentEnergy((energy) => energy + 100);
    }

    const handleDlgShow = () => {
        setdlgShow
    }

    return (
        <Animate>
            
            <div className="max-w-sm mx-auto bg-gray-900 text-white rounded-lg shadow-lg h-full overflow-y-auto relative">

                <div className="w-full h-full p-2 z-10 bg-[#000E] absolute">
                    <div className="bg-blue-gray-500top-0 left-0 z-40 p-2" style={{visibility: dlgShow}}>

                        <div className="flex flex-center justify-between items-center">
                            <div className="flex flex-col justify-start border border-gray-200 py-4 px-2">
                                <img src="/assets/character/man1.png" alt='avatar' 
                                    className="w-[120px] h-[160px] mx-auto"/>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/heart.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{userData && userData.currentEnergy}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/attack.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{userData && userData.attack}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/defence.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{userData && userData.defence}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/loader.webp" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{userData && userData.coin}</p>
                                </div>
                            </div>

                            <Typography variant="h2" className="text-center mb-5 mt-5">
                                VS
                            </Typography>

                            <div className="flex flex-col justify-start border border-gray-200 py-4 px-2">
                                <img src="/assets/monster/mon1-1.png" alt='avatar' 
                                    className="w-[120px] h-[160px] mx-auto"/>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/heart.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.energyLimit}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/attack.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.attack}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/defence.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.defense}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/loader.webp" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.tokenEarns}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between p-4 mt-5">
                            <Button color="red" className="text-[20px] w-[140px]" onClick={()=>setdlgShow("hidd")}>Fight</Button>
                            <Button color="blue" className="text-[20px] w-[140px]" onClick={()=>nav("/home")}>Cancel</Button>
                        </div>

                    </div>
                </div>

                <div className='mt-4'>
                    {/* Display HealthBar */}
                    <div className="flex justify-between items-center">
                        <div className="p-2 w-full">
                            <div className="flex justify-between px-3">
                                <p className="mb-1 text-[14px]">You:</p>
                                <div>
                                    <div className='flex gap-2 items-center'>
                                        <img 
                                            src="/assets/img/loader.webp"
                                            alt='coin' 
                                            width="14px"
                                            height="14px"
                                        />
                                        <p className='text-white text-[14px]'>{coin}</p>
                                    </div>
                                    <p className="mb-1 text-[14px]">{currentEnergy} / {totalEnergy}</p>
                                </div>
                            </div>
                            <Progress value={(currentEnergy / totalEnergy) * 100} className="bg-gray-500" color='green'/>
                            <div className="flex gap-5 mt-1">
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{manAttack}</p>
                                </div>
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="18px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{manDefence}</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="border px-1">VS</p>
                        <div className="p-2 w-full">
                            <div className="flex justify-between px-3">
                                <p className="mb-1 text-[14px]">Mon:</p>
                                <div>
                                    <div className='flex gap-2 items-center'>
                                        <img 
                                            src="/assets/img/loader.webp"
                                            alt='coin' 
                                            width="14px"
                                            height="14px"
                                        />
                                        <p className='text-white text-[14px]'>{monster && monster.coin}</p>
                                    </div>
                                    <p className="mb-1 text-[14px]">{monHealth} / {monster && monster.healthLimit}</p>
                                </div>
                            </div>
                            <Progress value={monster ? (monster.curHealth / monster.healthLimit) * 100 : 0} className="bg-gray-500" color='green'/>
                            <div className="flex gap-5 mt-1 justify-end">
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{monster && monster.attack}</p>
                                </div>
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="18px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{monster && monster.defence}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display battleLimitTime */}
                    <div className="flex gap-3 justify-center items-center">
                        <h2>Battle Time Left:</h2>
                        <div style={{ textAlign: 'center'}}>
                            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                                {battleLimitTime.toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between relative h-[100px]">
                        <img src={userAvatar} alt='character' className="w-[80px] h-[80px] block" style={{
                            position: 'absolute',
                            left: `${characterPosition}px`,
                            top: '15px', // Position the element vertically
                        }}/>
                        <img src={monsterAvatar} alt='character' className="w-[80px] h-[80px] block" style={{
                            position: 'absolute',
                            left: `${monsterPosition}px`,
                            top: '15px', // Position the element vertically
                        }}/>
                    </div>

                    <div className="border bg-[#0000e2] mt-5 w-fit mx-auto py-1 px-5 text-[24px]" 
                        style={{visibility: battleLimitTime == 0 ? 'visible' : 'hidden'}}>
                        {currentEnergy > monHealth ? "Win!" : "Lose!"}
                    </div>

                    <div className="flex gap-5 mt-20">
                        <div className="flex border bg-blue-gray-500 rounded-lg relative cursor-pointer" onClick={handleAttack}>
                            <img src="/assets/weapon/weapon8.png" alt='weapon' className="w-[60px] h-[60px] relative"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px] absolute bottom-0 right-[30%]'>✕5</p>
                        </div>
                        <div className="flex border bg-blue-gray-500 rounded-lg relative cursor-pointer" onClick={handleDefence}>
                            <img src="/assets/shield/shield6.png" alt='weapon' className="w-[60px] h-[60px] relative"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px] absolute bottom-0 right-[30%]'>✕5</p>
                        </div>
                        <div className="flex border bg-blue-gray-500 rounded-lg relative pb-4 cursor-pointer" onClick={handleEnergy}>
                            <img src="/assets/img/heart.png" alt='weapon' className="w-[60px] h-[60px] p-[10px] relative"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px] absolute bottom-0 right-[30%]'>✕5</p>
                        </div>
                    </div>

                    {/* <div>
                        <div className="flex gap-12 justify-center items-center mt-5">
                            <div>
                                <div className="flex justify-center ml-3 mb-3 mt-3">
                                    <img src={userData.icon ?? "/assets/img/bronze.webp"} alt='tap' onPointerDown={handleClick} ref={imageRef} disabled = {btnDisable} className="w-[100px] h-[100px] block cursor-pointer"/>
                                    {clicks.map((click) => (
                                        <SlideUpText key={click.id} x={click.x} y={click.y}>
                                        +{tapSpeed}
                                        </SlideUpText>
                                    ))}
                                </div>
                                <p className="text-center text-xl font-bold">{tapped} Clicks</p>
                            </div>
                            <Button className="py-2 px-4 w-fit justify-center border rounded-lg bg-[#2211ff]" onClick={handleBoost}>
                                <p className="mb-2 text-[20px]">Boost</p>
                                <div className='flex gap-2 items-center'>
                                    <img 
                                        src="/assets/img/loader.webp"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{boostCoin}</p>
                                </div>
                            </Button>
                        </div>

                       
                        <div className="flex justify-center w-full mt-2 mb-4 rounded-md py-1 bg-teal-500 gap-2 items-center">
                            { tapLimit } Taps Left<PiHandTap size={18} className='text-[#ffffff] text-btn4'/>
                        </div>
                    </div> */}
                </div>
            </div>
        </Animate>
    );
}

export default Challenge;
