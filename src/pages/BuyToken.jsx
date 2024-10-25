import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Spinner } from "@material-tailwind/react";
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import BigNumber from "bignumber.js";
import Animate from "../components/Animate";
import { isSafeValue } from '../utils';
import showToast from '../utils/toast';
import { updateUser } from '../actions/user';
import { updateToken } from '../actions/user';
import TapButton from '../components/TapButton';
import CoinIndicator from '../components/CoinIndicator';


const BuyToken = ({onSubmit, onClose}) => {

    let items = [
        { title: 'attack-double', avatar: '/assets/img/attack2.png', tokenNeeded: 100, },
        { title: 'defence-double', avatar: '/assets/img/defence2.png', tokenNeeded: 50, },
        { title: 'life-double', avatar: '/assets/img/life2.png', tokenNeeded: 60, },
    ]

    const dispatch = useDispatch();
    const earnData = useSelector((state) => state.user);
    const telegramId = useSelector((state)=> state.other.telegramId);
    
    //telegram wallet
    const { open: openTonConnectModal } = useTonConnectModal();
    const tonAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    const [needShow, setNeedShow] = useState(false);
    const [token, setToken] = useState(0);
    const [coin, setCoin] = useState(0);
    const [loadingState, setLoadingState] = useState([false, false, false]);
    const [attack2, setAttack2] = useState(0);
    const [defence2, setDefence2] = useState(0);
    const [life2, setLife2] = useState(0);

    const userData = useMemo(() => {
        return earnData.user
    }, [earnData]);

    const handleWallet = useCallback(async () => {
        if (isNaN(coin) || coin <= 0) {
            return showToast("error", "Please enter valid amount of coins to clain tokens.");
        }
        if (!tonAddress) {
            return openTonConnectModal();
        }
        const result = await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [
              {
                address: "0QB1do72vGlM0RfWI8n8_9xzHLtrQkJvTZ0tffrcrCrTq0tt",
                amount: new BigNumber(coin).multipliedBy(1e9).toFixed(0),
              },
            ],
        });
        if (result.boc) {
            dispatch(updateToken({telegramId, tokenToAdd: token})).then((message) => {
                const { status, data } = JSON.parse(message);
                try {
                    if (status) {
                        showToast("success", "Claimed successfully!");
                    } else {
                        showToast("error", data);
                    }
                } catch (error) {
                    showToast("error", "Something went wrong");
                }
            });
        } else {
            showToast("error", "Something went wrong");
        }
    }, [coin, token, tonAddress, dispatch, updateToken]);

    const handleChange = (evt, type) => {

        let val = Number(evt.target.value);
        if (isNaN(val)) val = 0;

        if (type == 1) {
            setToken(evt.target.value);
            setCoin(val / 10);
        } else if (type == 2) {
            setToken(val * 10);
            setCoin(evt.target.value);
        } else if (type == 3) {
            setAttack2(val);
        } else if (type == 4) {
            setDefence2(val);
        } else if (type == 5) {
            setLife2(val);
        }
    }

    const claimItems = (type) => {
        
        if (type == 0 && attack2 == 0) return;
        if (type == 1 && defence2 == 0) return;
        if (type == 2 && life2 == 0) return;
        let amount = 0;
        let tokensNeeded = 0;
        let key = '';

        if (type == 0) { amount = attack2; key = 'attackItems'; }
        else if (type == 1) { amount = defence2; key = 'defenceItems'; }
        else if (type == 2) { amount = life2; key = 'lifeItems'; }

        tokensNeeded = amount * items[type].tokenNeeded;

        if (isSafeValue(userData.tokens, 1) >= tokensNeeded) {
            setNeedShow(false);
            if (loadingState[type]) return;
            setLoadingState(state => {
                let updated = [...state];
                updated[type] = true;
                return updated;
            });

            let data = { tokens: userData.tokens - tokensNeeded, levelIndex: userData.levelIndex, [key]: isSafeValue(userData[key]) + amount };
            dispatch(updateUser({ telegramId, data }, () => {
                setLoadingState(state => {
                    let updated = [...state];
                    updated[type] = false;
                    return updated;
                });
                showToast("success", "Buy successfully!");
            }));

            if (type == 0)      setAttack2(0);
            else if (type == 1) setDefence2(0);
            else if (type == 2) setLife2(0);
            
        } else {
            setNeedShow(true);
        }
        
    }

    return (
        <Animate minify>
            <div className="max-w-sm mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg overflow-y-auto">

                <Typography variant="h4" color="white" className="text-center font-bold mb-6">
                    Trade
                </Typography>

                <CoinIndicator className='mb-4' value={isSafeValue(userData.tokens, 1)} size='lg' />

                <div className="mb-2 flex justify-between items-center">
                    <div className='flex gap-2 items-center'>
                        <img src='/assets/img/loader.webp' alt="avatar" 
                            className="h-[30px] w-[30px] rounded-full" />
                        <input type="text" className='w-[60px] p-1 text-black' 
                            value={token}
                            onChange={evt => handleChange(evt, 1)} />
                    </div>
                    =
                    <div className='flex gap-2 items-center'>
                        <img src="/assets/img/coin.webp" alt='coin' 
                            className="h-[30px] w-[30px]" />
                        <input type="text" className='w-[60px] p-1 text-black' 
                            value={coin}
                            onChange={evt => handleChange(evt, 2)}/>
                    </div>
                </div>

                <div className='flex items-center bg-green justify-end'>
                    <TapButton text="Claim" onClick={handleWallet} size="sm" className="py-1 min-w-[64px]" />
                </div>

                <div className='mt-2 mb-4 border border-bottom-1 border-[#FFF]'></div>

                <div className="mb-6 flex gap-4 justify-center items-center">
                    <CoinIndicator icon='/assets/img/attack2.png' iconDelta={8}
                        value={isSafeValue(userData.attackItems, 1)} />
                    <CoinIndicator icon='/assets/img/defence2.png' iconDelta={8}
                        value={isSafeValue(userData.defenceItems, 1)} />
                    <CoinIndicator icon='/assets/img/life2.png' iconDelta={8}
                        value={isSafeValue(userData.lifeItems, 1)} />
                </div>

                {
                    items.map((item, idx) => {
                        let itemVal =   idx == 0 ? attack2 :
                                        idx == 1 ? defence2 :
                                        life2;
                        return (
                            <div key={idx} className="mb-2 flex justify-between items-center">
                                <div className='flex gap-2 items-center'>
                                    <img src={item.avatar} alt="avatar" 
                                        className="h-[30px] w-[30px] rounded-full" />
                                    <input type="text" className='w-[60px] p-1 text-black' 
                                        value={itemVal}
                                        onChange={evt => handleChange(evt, idx + 3)} />
                                </div>
                                =
                                <div className='flex gap-1 items-center'>
                                    <img src="/assets/img/loader.webp" alt='coin' 
                                        className="h-[30px] w-[30px]" />
                                    <div>{item.tokenNeeded * itemVal}</div>
                                </div>
                                
                                <TapButton text="Claim" size="sm" className="py-1 min-w-[64px]" 
                                    onClick={() => claimItems(idx)} 
                                    busy={loadingState[idx]} />
                            </div>
                        );
                    })
                }

                {
                    needShow &&
                    <div className='flex flex-center text-red-400 font-bold'>
                        * Not enough token to buy items.
                    </div>
                }

                <TapButton text="Close" size="sm" className="py-1 min-w-[64px]" onClick={() => onClose()} />
            </div>
        </Animate>
        
    );
};

export default BuyToken;
