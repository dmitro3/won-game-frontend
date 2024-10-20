import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography,
    MenuItem,
  } from "@material-tailwind/react";
import Animate from "../components/Animate";
import { useDispatch, useSelector } from 'react-redux';
import { isSafeValue } from '../utils';
import { updateUser } from '../actions/earn';
import { useTonAddress, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";


const BuyToken = ({onSubmit, onClose}) => {

    let items = [
        { title: 'attack-double', avatar: '/assets/img/attack2.png', tokenNeeded: 100, },
        { title: 'defence-double', avatar: '/assets/img/defence2.png', tokenNeeded: 50, },
        { title: 'life-double', avatar: '/assets/img/life2.png', tokenNeeded: 60, },
    ]

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.earn.user);
    
    //telegram wallet
    const { open: openTonConnectModal } = useTonConnectModal();
    const tonAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();

    const [needShow, setNeedShow] = useState(false);
    const [token, setToken] = useState(0);
    const [coin, setCoin] = useState(0);

    const [attack2, setAttack2] = useState(0);
    const [defence2, setDefence2] = useState(0);
    const [life2, setLife2] = useState(0);

    useEffect(() => {
        console.log("User Data", userData);
    }, [userData])

    const handleWallet = () => {
        if (!tonAddress) {
            openTonConnectModal();
            return;
        }
    }

    const handleChange = (evt, type) => {

        let val = parseInt(evt.target.value);
        if (isNaN(val)) val = 0;

        if (type == 1) {
            setToken(evt.target.value);
            setCoin(val / 10);
        } else if (type == 2) {
            setToken(val / 10);
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
        let amount = 0;
        let tokensNeeded = 0;
        let key = '';

        if (type == 0) { amount = attack2; key = 'attackItems'; }
        else if (type == 1) { amount = defence2; key = 'defenceItems'; }
        else if (type == 2) { amount = life2; key = 'lifeItems'; }

        tokensNeeded = amount * items[type].tokenNeeded;

        console.log(amount, tokensNeeded, key);

        if (isSafeValue(userData.tokens, 1) >= tokensNeeded) {
            setNeedShow(false);
            dispatch(updateUser({
                tokens: userData.tokens - tokensNeeded,
                levelIndex: userData.levelIndex,
                [key]: isSafeValue(userData[key]) + amount,
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

                <div className="mb-4 flex gap-2 justify-center items-center">
                    <img src='/assets/img/loader.webp' alt="avatar" 
                        className="h-[30px] w-[30px] rounded-full" />
                    <Typography variant='h5' color='white'>{isSafeValue(userData.tokens, 1)}</Typography>
                </div>

                <div className="mb-6 flex gap-4 justify-center items-center">
                    <div className='flex gap-1'>
                        <img src='/assets/img/attack2.png' alt="avatar" 
                            className="h-[30px] w-[30px] rounded-full" />
                        <Typography variant='h6' color='white'>{isSafeValue(userData.attackItems, 1)}</Typography>
                    </div>
                    <div className='flex gap-1'>
                        <img src='/assets/img/defence2.png' alt="avatar" 
                            className="h-[30px] w-[30px] rounded-full" />
                        <Typography variant='h6' color='white'>{isSafeValue(userData.defenceItems, 1)}</Typography>
                    </div>
                    <div className='flex gap-1'>
                        <img src='/assets/img/life2.png' alt="avatar" 
                            className="h-[30px] w-[30px] rounded-full" />
                        <Typography variant='h6' color='white'>{isSafeValue(userData.lifeItems, 1)}</Typography>
                    </div>
                </div>

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
                    <button class="bg-[#FFC658] hover:bg-[#FFC658EE] text-[#C94A0C] font-bold py-1 px-2 border-b-[3px] border-r-[3px] border-[#c18f2d] shadow rounded" onClick={handleWallet}>
                        Claim
                    </button>
                </div>

                <div className='mt-4 mb-8 border border-bottom-1 border-[#FFF]'></div>

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
                                <button class="bg-[#FFC658] hover:bg-[#FFC658EE] text-[#C94A0C] font-bold py-1 px-2 border-b-[3px] border-r-[3px] border-[#c18f2d] shadow rounded" onClick={() => claimItems(idx)}>
                                    Claim
                                </button>
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
                <button class="bg-[#FFC658] hover:bg-[#FFC658EE] text-[#C94A0C] font-bold py-1 px-2 border-b-[3px] border-r-[3px] border-[#c18f2d] shadow rounded mt-6" onClick={() => onClose()}>
                    Close
                </button>
            </div>
        </Animate>
        
    );
};

export default BuyToken;
