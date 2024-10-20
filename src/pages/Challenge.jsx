import Animate from "../components/Animate";
import React, { useState, useEffect } from 'react';
import { Progress, Button, Dialog } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { viewUser, updateUser } from '../actions/earn';
import { viewActivity, updateActivity } from '../actions/activity';
import { getItem, viewAll } from '../actions/mine';
import { useNavigate } from 'react-router-dom';

let interval;
let timeDuration = 50; // ms
let monsterInterval;
let timerInterval;

const Challenge = () => {
    const [tapLimit, setTapLimit] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [mine, setMine] = useState(null);
    const [monster, setMonster] = useState(null);
    const [wins, setWins] = useState(0);
    const [earned, setEarned] = useState(0);
    const [battleTime, setBattleTime] = useState(0);
    const [aniInterval, setAniInterval] = useState(-1);
    const [manSparks, setManSparks] = useState([]);
    const [monsterSparks, setMonsterSparks] = useState([]);

    const [dlgShow, setDlgShow] = useState(true);
    const [backShow, setBackShow] = useState(false);
    const [isWin, setIsWin] = useState(0);
    const [plusAttr, setPlusAttr] = useState([0,0,0]);
    const boost = [ 40, 30, 200 ];
    const nav = useNavigate();

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.earn.user);
    const mineData = useSelector((state) => state.mine.items);
    const activityData = useSelector((state)=> state.activity.activity);
    const selMonster = useSelector((state) => state.other.fightMonster);
    
    const shootManSpark = () => {
        setManSparks((prev) => [...prev, { id: Date.now(), position: 80 }]);
    };

    const shootMonsterSpark = () => {
        setMonsterSparks((prev) => [...prev, { id: Date.now(), position: 290 }]);
    };

    useEffect(() => {
        dispatch(viewUser());
        dispatch(getItem());
        dispatch(viewAll());
        dispatch(viewActivity());

        return () => clearInterval(interval);
    }, []);

    const isEmpty = (val) => {
        if (!val) return true;
        if (Object.keys(val).length > 0) return false;
        if (val.length > 0) return false;
    
        return true;
    }

    const handleOpen = () => {
        setOpen((cur) => !cur);
    }

    const handleWinner = () => {
        dispatch(updateUser({
            currentEnergy: mine.curHealth,
            tokens: mine.tokens + monster.tokenEarns,
            lastChallenge: monster.challengeIndex + 1,
            levelIndex: userData.levelIndex,
            pointsBalance: wins + 1,
            tokensEarned: earned + monster.tokenEarns,
        }));
        setOpen((cur) => !cur);
        nav('/home');
    }

    const handleLoser = () => {
        console.log("mine, monster", mine, monster);
        dispatch(updateUser({
            currentEnergy: mine.curHealth,
            tokens: mine.tokens - monster.tokens,
            lastChallenge: monster.challengeIndex,
            levelIndex: userData.levelIndex
        }));
        setOpen((cur) => !cur);
        nav('/home');
    }

    useEffect(() => {
        if (!isEmpty(activityData)) {
            setTapLimit(() => activityData.tapLimit);
        }
    }, [activityData]);

    useEffect(() => {
        if (!isEmpty(userData)) {
            setWins(userData.pointsBalance);
            setEarned(userData.tokensEarned);
        }
    }, [userData]);

    useEffect(() => {
        let equipped = mineData.filter((item) => item.isWear);

        let attack = 0, defence = 0, health = 0, avatar = "";
        equipped.forEach((equip) => {
            if (equip.type == 'character') {health = equip.energy; avatar=equip.imageSrc;}
            else if (equip.type == 'attack') attack = equip.attribute;
            else if (equip.type == 'defence') defence = equip.attribute;
        });

        if (health < userData.currentEnergy) health = userData.energyLimit;
        if (attack <= 0) attack = 3;
        if (defence <= 0) defence = 1;

        let user = {
            ...userData,
            curHealth: userData.currentEnergy,
            totalHealth: health,
            attack, defence, avatar
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
        // Monster shoots a spark every 3 seconds
        monsterInterval = setInterval(() => {
            shootMonsterSpark();
        }, 800);
    
        return () => {
            clearInterval(monsterInterval);
            clearInterval(timerInterval);
        };
    }, []);

    const handleShoot = () => {
        if (tapLimit <= 0) return;
        shootManSpark(); // Shoot a spark on each button click
        setTapLimit(prev => prev - 1);
        dispatch(updateActivity({tapLimit: tapLimit - 1}));
    };

    useEffect(() => {
        if(mine && monster && (mine.curHealth <= 0 || monster.curHealth <= 0)) {

            if (mine.curHealth > 0) setIsWin(1);
            else                    setIsWin(2);
            clearTimeout(interval);
            clearInterval(monsterInterval);
            clearInterval(timerInterval);
            handleOpen();

            setBackShow(() => true);
        } else if (!dlgShow) {
            interval = setTimeout(() => doFightAction(), timeDuration);
        }
    }, [aniInterval]);

    const startFighting = () => {
        setDlgShow(false);
        setBackShow(false);
        // timePos = 0;
        // fightDuration = 0;

        setBattleTime(() => 0);
        setAniInterval(() => 1);
        
        timerInterval = setInterval(() => setBattleTime((prev) => prev + 1), 1000);
    }

    const doFightAction = () => {
        setManSparks((prevSparks) =>
            prevSparks.map((spark) => ({ ...spark, position: spark.position + 20 }))
        );
        setMonsterSparks((prevSparks) =>
            prevSparks.map((spark) => ({ ...spark, position: spark.position - 20 }))
        );
    
        setManSparks((prevSparks) => {
            return prevSparks.filter((spark) => {
                if (spark.position >= 310) {
                    let rand = Math.random();
                    let manAttack = Math.floor(mine.attack * 0.85 - monster.defence * (1 + rand));
                    if (manAttack < 0) manAttack = 1;
                    setMonster(cur => {
                        let curHealth = cur.curHealth - manAttack * 3;
                        if (curHealth < 0) curHealth = 0;
                        return {
                            ...cur,
                            curHealth,
                        }
                    });
                    return false;
                }
                return true; 
            });
        });
    
        setMonsterSparks((prevSparks) => {
            return prevSparks.filter((spark) => {
                if (spark.position <= 30) {
                    let rand = Math.random();
                    let monsterAttack = Math.floor(monster.attack + (1 + rand) - mine.defence * 0.8);
                    if (monsterAttack < 0) monsterAttack = 1;
                    setMine(cur => {
                        let curHealth = cur.curHealth - monsterAttack * 3;
                        if (curHealth < 0) curHealth = 0;
            
                        return {
                            ...cur,
                            curHealth,
                        }
                    });
                    return false;
                }
                return true;
            });
        });

        setAniInterval(aniInterval => aniInterval + 1);
        clearTimeout(interval);
    }

    const handleAttack = () => {
        setPlusAttr((val) => {
            val[0] += boost[0];
            return val;
        });

        setMine(cur => {
            let curAttack = cur.attack + boost[0];
            let attackItems = cur.attackItems - 1;
            dispatch(updateUser({
                levelIndex: userData.levelIndex,
                attackItems: attackItems
            }));
            return {
                ...cur,
                curAttack,
                attackItems
            }
        });
    }

    const handleDefence = () => {
        setPlusAttr((val) => {
            val[1] += boost[1];
            return val;
        });
        setMine(cur => {
            let curDefence = cur.defence + boost[1];
            let defenceItems = cur.defenceItems - 1;
            dispatch(updateUser({
                levelIndex: userData.levelIndex,
                defenceItems: defenceItems
            }));
            return {
                ...cur,
                curDefence,
                defenceItems
            }
        });
    }

    const handleEnergy = () => {
        setPlusAttr((val) => {
            val[2] += boost[2];
            return val;
        });
        setMine(cur => {
            let curHealth = cur.curHealth + boost[2];
            let lifeItems = cur.lifeItems - 1;
            dispatch(updateUser({
                levelIndex: userData.levelIndex,
                lifeItems: lifeItems
            }));
            return {
                ...cur,
                curHealth,
                lifeItems
            }
        });
    }

    return (
        <Animate>
            
            <div className="max-w-sm mx-auto bg-[#64ECEE55] bg-fixed text-white h-full overflow-y-auto relative bg-[url('/assets/img/fields/6.png')] bg-contain bg-center bg-no-repeat">
                {
                dlgShow && 
                <div className="w-full h-full p-2 z-10 bg-[#000E] absolute bg-[url('/assets/img/bg_vs.png')] bg-center bg-contain bg-no-repeat">
                    <div className="bg-blue-gray-500top-0 left-0 z-40 p-2">
                        <div className="flex flex-center justify-between items-center mt-[20px] px-3">
                            <div className="flex flex-col justify-start border-[5px] border-blue-500 py-4 px-2 rounded-lg bg-[#6CF47F66]">
                                <img src={mine ? mine.avatar : "/assets/character/man1.png"} alt='avatar' 
                                    className="w-[120px] h-[160px] mx-auto"/>
                                <div className="flex gap-2 items-center mt-5">
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

                            <div className="flex flex-col justify-start border-[5px] border-red-500 py-4 px-2 rounded-lg bg-[#6CF47F66]">
                                <img src="/assets/monster/monster1.png" alt='avatar' 
                                    className="w-[120px] h-[160px] mx-auto"/>
                                <div className="flex gap-2 items-center mt-5">
                                    <img src="/assets/img/heart.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px] font-bold'>{monster && monster.curHealth}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/attack.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px] font-bold'>{monster && monster.attack}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/challenge/defence.png" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px] font-bold'>{monster && monster.defence}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <img src="/assets/img/loader.webp" alt='avatar' className="w-[22px] h-[22px]"/>
                                    <p className='text-white text-[24px] font-bold'>{monster && monster.tokens}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between p-4 mt-10">
                            <button class="bg-[#FFC658] hover:bg-[#FFC658EE] text-[#C94A0C] text-[20px] py-2 font-bold px-6 border-b-[4px] border-r-[4px] border-[#c18f2d] shadow rounded w-[140px]" onClick={() => startFighting()}>
                                Fight
                            </button>
                            <button class="bg-[#FFC658] hover:bg-[#FFC658EE] text-[#C94A0C] text-[20px] py-2 font-bold px-6 border-b-[4px] border-r-[4px] border-[#c18f2d] shadow rounded w-[140px]" onClick={()=>nav("/home")}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
                }

                <div className='mt-4'>
                    <div className="flex justify-between items-center">
                        <div className="p-2 w-full">
                            <div className="flex justify-between px-3">
                                <img src={mine ? mine.avatar : "/assets/character/man1.png"} alt='avatar' className="w-[32px] h-[40px]"/>
                                <div>
                                    <div className='flex gap-1 items-center justify-end'>
                                        <img 
                                            src="/assets/img/loader.webp"
                                            alt='coin' 
                                            width="14px"
                                            height="14px"
                                        />
                                        <p className='text-yellow-600 font-bold text-[14px]'>{mine && mine.tokens}</p>
                                    </div>
                                    {plusAttr[2]!=0 ? <p className="mb-1 text-yellow-600 font-bold text-[14px]">{mine && (mine.curHealth + plusAttr[2])} / {mine && mine.totalHealth}</p>:<p className="mb-1 text-yellow-600 font-bold text-[14px]">{mine && mine.curHealth } / {mine && mine.totalHealth}</p>}
                                </div>
                            </div>
                            <Progress value={mine && (mine.curHealth / mine.totalHealth) * 100} className="bg-gray-200" color='red'/>
                            <div className="flex gap-5 mt-1">
                                <div className="flex gap-1">
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-yellow-600 font-bold text-[14px]'>{mine && mine.attack}</p>
                                    {plusAttr[0]!=0 && <p className='text-yellow-600 font-bold text-[14px]'>+{plusAttr[0]}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="18px"
                                        height="14px"
                                    />
                                    <p className='text-yellow-600 font-bold text-[14px]'>{mine && mine.defence}</p>
                                    {plusAttr[1]!=0 && <p className='text-yellow-600 font-bold text-[14px]'>+{plusAttr[1]}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <p className="border px-1">VS</p>
                        <div className="p-2 w-full">
                            <div className="flex justify-between px-3">
                                <div>
                                    <div className='flex gap-1 items-center'>
                                        <img 
                                            src="/assets/img/loader.webp"
                                            alt='coin' 
                                            width="14px"
                                            height="14px"
                                        />
                                        <p className='text-yellow-600 font-bold text-[14px]'>{monster && monster.tokens}</p>
                                    </div>
                                    <p className="mb-1 text-yellow-600 font-bold text-[14px]">{monster && monster.curHealth} / {monster && monster.totalHealth}</p>
                                </div>
                                <img src="/assets/monster/monster1.png" alt='avatar' className="w-[32px] h-[40px]"/>
                            </div>
                            <Progress value={monster && monster.curHealth / monster.totalHealth * 100} className="bg-gray-200" color='red'/>
                            <div className="flex gap-5 mt-1 justify-end">
                                <div className="flex gap-1">
                                    <img 
                                        src="/assets/challenge/attack.png"
                                        alt='coin' 
                                        width="14px"
                                        height="14px"
                                    />
                                    <p className='text-yellow-600 font-bold text-[14px]'>{monster && monster.attack}</p>
                                </div>
                                <div className="flex gap-1">
                                    <img 
                                        src="/assets/challenge/defence.png"
                                        alt='coin' 
                                        width="18px"
                                        height="14px"
                                    />
                                    <p className='text-yellow-600 font-bold text-[14px]'>{monster && monster.defence}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-center items-center">
                        <p className="text-[20px] font-bold">Battle Time Elapsed:</p>
                        <div style={{ textAlign: 'center'}}>
                            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                                {/* {Math.ceil(battleTime / (1000 / timeDuration)).toString().padStart(2, '0')} */}
                                {Math.ceil(battleTime).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>

                    <Dialog size="sm" open={open} className="bg-[#F47E5777]">
                       {isWin == 1?
                        <div className="flex flex-col justify-center">
                            <img src="/assets/challenge/winner.png" alt='winner' className="w-[120px] h-[180px] mx-auto mt-5"/>
                            <Button onClick={handleWinner} className='py-5 px-8 text-[14px] w-[50%] mx-auto mt-5 mb-5'>
                                <div className="flex gap-2 justify-center items-center">
                                    <img src="/assets/img/loader.webp" alt='coin' className="w-[24px] h-[24px]"/>
                                    <p className="text-[18px]">{monster.tokens}</p>
                                </div>
                            </Button>
                        </div>
                       :
                       <div className="flex flex-col justify-center">
                            <img src="/assets/challenge/loser.png" alt='winner' className="w-[120px] h-[180px] mx-auto mt-5"/>
                            <Button onClick={handleLoser} className='py-5 px-8 text-[14px] w-[50%] mx-auto mt-5 mb-5'>Back Home</Button>
                        </div>
                       }
                    </Dialog>

                    <div className="border bg-[#0000e2] mt-5 w-fit mx-auto py-1 px-5 text-[24px]" 
                        style={{visibility: isWin != 0 ? 'visible' : 'hidden'}}>
                        {backShow && isWin == 1 ? "Win!" : "Lose!"}
                    </div>

                    <div className="flex justify-between relative h-[200px]">
                        <div className="flex gap-1">
                            <img src="/assets/challenge/man1.png" alt='character' className="w-[80px] h-[80px] block" style={{
                                position: 'absolute',
                                left: "0px",
                                bottom: '-10px',
                            }}/>
                            {manSparks.map((spark, idx) => (
                                <img key={idx} src='/assets/challenge/man_spark4.png' alt='character' className="w-[20px] h-[20px] block" style={{
                                    position: 'absolute',
                                    left: `${spark.position}px`,
                                    bottom: '40px',
                                }}/>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            <img src="/assets/challenge/monster1.png" alt='character' className="w-[80px] h-[80px] block" style={{
                                position: 'absolute',
                                left: "300px",
                                bottom: '-10px',
                            }}/>
                            {monsterSparks.map((spark, idx) => (
                                <img key={idx} src='/assets/challenge/mon_spark.png' alt='character' className="w-[20px] h-[20px] block" style={{
                                    position: 'absolute',
                                    left: `${spark.position}px`,
                                    bottom: '53px',
                                }}/>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-5 mt-[60px] pl-4">
                        <div className="flex flex-col border bg-[#b0f3b688] rounded-lg relative cursor-pointer" onClick={handleAttack} style={{visibility: mine && mine.attackItems == 0 ? "hidden" : "visible"}}>
                            <img src="/assets/weapon/weapon8.png" alt='weapon' className="w-[40px] h-[40px] p-[4px]"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px]'>{mine && mine.attackItems}</p>
                        </div>
                        <div className="flex flex-col border bg-[#b0f3b688] rounded-lg relative cursor-pointer" onClick={handleDefence} style={{visibility: mine && mine.defenceItems == 0 ? "hidden" : "visible"}}>
                            <img src="/assets/shield/shield6.png" alt='weapon' className="w-w-[40px] h-[40px] p-[4px]"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px]'>{mine && mine.defenceItems}</p>
                        </div>
                        <div className="flex flex-col border bg-[#b0f3b688] rounded-lg relative cursor-pointer" onClick={handleEnergy} style={{visibility: mine && mine.lifeItems == 0 ? "hidden" : "visible"}}>
                            <img src="/assets/img/heart.png" alt='weapon' className="w-[40px] h-[40px] p-[4px]"/>
                            <p className='text-deep-orange-900 font-extrabold text-[16px]'>{mine && mine.lifeItems}</p>
                        </div>
                        <div className="flex gap-1 items-center">
                            <img src="/assets/img/platinum.webp" alt='coin' className="w-[100px] h-[60px] pl-10 cursor-pointer" onClick={handleShoot}/>
                            <div className="flex flex-col justify-center">
                                <p className="text-[36px] font-bold text-white">{tapLimit}</p>
                                <p className="text-[16px]">Tap Limits</p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                { backShow &&
                    <div className="h-full w-full absolute left-[0px] top-[0px]" onClick={() => nav('/home')}></div>
                }
            </div>
        </Animate>
    );
}

export default Challenge;
