import Animate from "../components/Animate";
import React, { useState, useRef, useEffect } from 'react';
import { Progress, Button, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { viewUser, updateUser } from '../actions/earn';
import { getItem, viewAll } from '../actions/mine';
import { useNavigate } from 'react-router-dom';

let interval;
let timePos = 0;
let moveTime = 6;
let fightDuration = 5; // s
let timeDuration = 200; // ms

const Challenge = () => {

    const [mine, setMine] = useState(null);
    const [monster, setMonster] = useState(null);
    const [minePos, setMinePos] = useState(0);
    const [monsterPos, setMonsterPos] = useState(260);  
    const [battleTime, setBattleTime] = useState(10);
    const [userAvatar, setUserAvatar] = useState('/assets/challenge/man1-1.png');
    const [monsterAvatar, setMonsterAvatar] = useState('/assets/challenge/mon1-1.png');
    const [dlgShow, setDlgShow] = useState(true);
    const [backShow, setBackShow] = useState(false);
    const [isWin, setIsWin] = useState(0);

    const nav = useNavigate();

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.earn.user);
    const mineData = useSelector((state) => state.mine.items);
    const selMonster = useSelector((state) => state.other.fightMonster);
    
    useEffect(() => {
        dispatch(viewUser());
        dispatch(getItem());
        dispatch(viewAll());

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let equipped = mineData.filter((item) => item.isWear);

        let attack = 0, defence = 0, health = 0;
        equipped.forEach((equip) => {
            if (equip.type == 'character') health = equip.energy;
            else if (equip.type == 'attack') attack = equip.attribute;
            else if (equip.type == 'defence') defence = equip.attribute;
        });

        if (health < userData.currentEnergy) health = userData.energyLimit;
        if (attack <= 0) attack = 2;
        if (defence <= 0) defence = 1;

        let user = {
            ...userData,
            curHealth: userData.currentEnergy,
            totalHealth: health,
            attack, defence,
        };
        setMine(user);
    }, [userData, mineData]);
    
    useEffect(() => {
        if (!selMonster) return;

        let mon = {
            ...selMonster,
            curHealth: selMonster.energyLimit,
            totalHealth: selMonster.energyLimit,
            tokens: selMonster.tokenEarns,
            attack: selMonster.attack,
            defence: selMonster.defense,
        }
        setMonster(mon);
    }, [selMonster]);

    useEffect(() => {
        if(mine && monster && (mine.curHealth <= 0 || monster.curHealth <= 0)) {

            if (mine.curHealth > 0) setIsWin(1);
            else                    setIsWin(2);
            console.log("Finished", mine, monster);

            setBackShow(() => true);
            if (monster.lastChallenge) {
                dispatch(updateUser({
                    currentEnergy: mine.curHealth,
                    tokens: mine.tokens + monster.tokenEarns,
                    lastChallenge: monster.challengeIndex + 1,
                }));
            } else {
                dispatch(updateUser({
                    currentEnergy: mine.curHealth,
                    tokens: mine.tokens + monster.tokenEarns,
                }));
            }
        } else if (!dlgShow) {
            interval = setTimeout(() => doFightAction(), timeDuration);
        }
    }, [battleTime]);

    const startFighting = () => {
        setDlgShow(false);
        setBackShow(false);
        timePos = 0;
        fightDuration = 0;
        setBattleTime(() => 0);
    }

    const doFightAction = () => {
        if (timePos < moveTime) {
            setMinePos(prevLeft => (prevLeft < window.innerWidth ? prevLeft + 20 : 0));
            setMonsterPos(prevLeft => (prevLeft < window.innerWidth ? prevLeft - 20 : 0));
        } else {
            if ((timePos - moveTime) % 10 == 0) {
                attackAniMine();
            }
            else if ((timePos - moveTime - 5) % 10 == 0) {
                attackAniMonster();
            }
        }

        timePos++;
        setBattleTime(battleTime => battleTime + 1);
        clearTimeout(interval);
    }

    const attackAniMine = () => {
        setUserAvatar("/assets/challenge/man1-2.png");
        let manAttack = Math.floor(mine.attack * 0.85 - monster.defence);
        if (manAttack < 0) manAttack = 1;
        console.log("Man Attack", manAttack, monster.curHealth);
               
        setMonster(cur => {
            let curHealth = cur.curHealth - manAttack * 3;
            if (curHealth < 0) curHealth = 0;
            return {
                ...cur,
                curHealth,
            }
        });

        setTimeout(() => {
            setUserAvatar("/assets/challenge/man1-1.png");
        }, 200);
    }

    const attackAniMonster = () => {
        setMonsterAvatar("/assets/challenge/mon1-2.png");
        let monsterAttack = Math.floor(monster.attack - mine.defence * 0.8);
        if (monsterAttack < 0) monsterAttack = 1;
        console.log("Monster Attack", monsterAttack, mine.curHealth);

        setMine(cur => {
            let curHealth = cur.curHealth - monsterAttack * 3;
            if (curHealth < 0) curHealth = 0;

            return {
                ...cur,
                curHealth,
            }
        });

        setTimeout(() => {
            setMonsterAvatar("/assets/challenge/mon1-1.png");
        }, 200);
    }

    const showResult = () => {

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

    return (
        <Animate>
            
            <div className="max-w-sm mx-auto bg-gray-900 text-white rounded-lg shadow-lg h-full overflow-y-auto relative">

                {
                dlgShow && 
                <div className="w-full h-full p-2 z-10 bg-[#000E] absolute">
                    <div className="bg-blue-gray-500top-0 left-0 z-40 p-2">

                        <div className="flex flex-center justify-between items-center">
                            <div className="flex flex-col justify-start border border-gray-200 py-4 px-2">
                                <img src="/assets/character/man1.png" alt='avatar' 
                                    className="w-[120px] h-[160px] mx-auto"/>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/heart.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{mine && mine.curHealth}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/attack.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{mine && mine.attack}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/defence.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{mine && mine.defence}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/loader.webp" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{mine && mine.tokens}</p>
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
                                    <p className='text-white text-[24px]'>{monster && monster.curHealth}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/attack.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.attack}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/defence.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.defence}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/loader.webp" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px]'>{monster && monster.tokens}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between p-4 mt-5">
                            <Button color="red" className="text-[20px] w-[140px]" onClick={() => startFighting()}>Fight</Button>
                            <Button color="blue" className="text-[20px] w-[140px]" onClick={()=>nav("/home")}>Cancel</Button>
                        </div>

                    </div>
                </div>
                }

                <div className='mt-4'>
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
                                        <p className='text-white text-[14px]'>{mine && mine.tokens}</p>
                                    </div>
                                    <p className="mb-1 text-[14px]">{mine && mine.curHealth} / {mine && mine.totalHealth}</p>
                                </div>
                            </div>
                            <Progress value={mine && (mine.curHealth / mine.totalHealth) * 100} className="bg-gray-500" color='green'/>
                            <div className="flex gap-5 mt-1">
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{mine && mine.attack}</p>
                                </div>
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="18px"
                                        height="14px"
                                    />
                                    <p className='text-white text-[14px]'>{mine && mine.defence}</p>
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
                                        <p className='text-white text-[14px]'>{monster && monster.tokens}</p>
                                    </div>
                                    <p className="mb-1 text-[14px]">{monster && monster.curHealth} / {monster && monster.totalHealth}</p>
                                </div>
                            </div>
                            <Progress value={monster && monster.curHealth / monster.totalHealth * 100} className="bg-gray-500" color='green'/>
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

                    <div className="flex gap-3 justify-center items-center">
                        <h2>Battle Time Left:</h2>
                        <div style={{ textAlign: 'center'}}>
                            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                                {Math.ceil(battleTime / 5).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between relative h-[100px]">
                        <img src={userAvatar} alt='character' className="w-[80px] h-[80px] block" style={{
                            position: 'absolute',
                            left: `${minePos}px`,
                            top: '15px',
                        }}/>
                        <img src={monsterAvatar} alt='character' className="w-[80px] h-[80px] block" style={{
                            position: 'absolute',
                            left: `${monsterPos}px`,
                            top: '15px',
                        }}/>
                    </div>

                    <div className="border bg-[#0000e2] mt-5 w-fit mx-auto py-1 px-5 text-[24px]" 
                        style={{visibility: isWin != 0 ? 'visible' : 'hidden'}}>
                        {backShow && isWin == 1 ? "Win!" : "Lose!"}
                    </div>

                    <div className="border bg-[#0000e2] mt-20 w-fit mx-auto py-1 px-5 text-[24px]" onClick={() => showResult()}>
                        Show Result
                    </div>

                    {/* <div className="flex gap-5 mt-20">
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
                    </div> */}
                </div>

                {
                backShow &&
                <div className="h-full w-full absolute left-[0px] top-[0px]" onClick={() => nav('/home')}>
                </div>
                }
            </div>
        </Animate>
    );
}

export default Challenge;
