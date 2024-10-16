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


const BuyToken = ({onSubmit, onClose}) => {

    let items = [
        { title: 'attack-double', avatar: '/assets/img/attack2.png', tokenNeeded: 100, },
        { title: 'defence-double', avatar: '/assets/img/defence2.png', tokenNeeded: 50, },
        { title: 'life-double', avatar: '/assets/img/life2.png', tokenNeeded: 60, },
    ]

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.earn.user);

    const [open, setOpen] = React.useState(false);

    const [needShow, setNeedShow] = useState(false);
    const [token, setToken] = useState(0);
    const [coin, setCoin] = useState(0);

    const [attack2, setAttack2] = useState(0);
    const [defence2, setDefence2] = useState(0);
    const [life2, setLife2] = useState(0);

    useEffect(() => {
        console.log("User Data", userData);
    }, [userData])

    const handleOpen = () => setOpen((cur) => !cur);
    const handleClose = () => onClose();

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
                    <div className='flex gap-2 items-center border bg-green-800 hover:bg-blue-gray-400 p-1 rounded-md cursor-pointer w-[50px]' 
                        onClick={handleOpen}>
                        Claim
                    </div>
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
                                <div className='flex gap-2 items-center border bg-green-800 hover:bg-blue-gray-400 p-1 rounded-md cursor-pointer' onClick={() => claimItems(idx)}>
                                    Claim
                                </div>
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

                <Button className='mt-10' variant="filled" color='red' onClick={() => onClose()}>
                    Close
                </Button>

                <Dialog size="xs" open={open} handler={handleOpen}>
                    <DialogHeader className="justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                            Connect a Wallet
                            </Typography>
                            <Typography color="gray" variant="paragraph">
                            Choose which card you want to connect
                            </Typography>
                        </div>
                        <IconButton
                            color="blue-gray"
                            size="sm"
                            variant="text"
                            onClick={handleOpen}
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className="h-5 w-5"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                            </svg>
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="overflow-y-scroll !px-5">
                        <div className="mb-6">
                            <Typography
                            variant="paragraph"
                            color="blue-gray"
                            className="py-3 font-semibold uppercase opacity-70"
                            >
                            Popular
                            </Typography>
                            <ul className="-ml-2 mt-3 flex flex-col gap-1">
                            <MenuItem className="mb-4 flex items-center justify-center gap-3 !py-4 shadow-md">
                                <img
                                src="https://docs.material-tailwind.com/icons/metamask.svg"
                                alt="metamast"
                                className="h-6 w-6"
                                />
                                <Typography
                                className="uppercase"
                                color="blue-gray"
                                variant="h6"
                                >
                                Connect with MetaMask
                                </Typography>
                            </MenuItem>
                            <MenuItem className="mb-1 flex items-center justify-center gap-3 !py-4 shadow-md">
                                <img
                                src="https://docs.material-tailwind.com/icons/coinbase.svg"
                                alt="metamast"
                                className="h-6 w-6 rounded-md"
                                />
                                <Typography
                                className="uppercase"
                                color="blue-gray"
                                variant="h6"
                                >
                                Connect with Coinbase
                                </Typography>
                            </MenuItem>
                            </ul>
                        </div>
                        <div>
                            <Typography
                            variant="paragraph"
                            color="blue-gray"
                            className="py-4 font-semibold uppercase opacity-70"
                            >
                            Other
                            </Typography>
                            <ul className="-ml-2.5 mt-4 flex flex-col gap-1">
                            <MenuItem className="mb-4 flex items-center justify-center gap-3 !py-4 shadow-md">
                                <img
                                src="https://docs.material-tailwind.com/icons/trust-wallet.svg"
                                alt="metamast"
                                className="h-7 w-7 rounded-md border border-blue-gray-50"
                                />
                                <Typography
                                className="uppsecase"
                                color="blue-gray"
                                variant="h6"
                                >
                                Connect with Trust Wallet
                                </Typography>
                            </MenuItem>
                            </ul>
                        </div>
                    </DialogBody>
                    <DialogFooter className="justify-between gap-2">
                        <Typography variant="small" color="gray" className="font-normal">
                            New to Ethereum wallets?
                        </Typography>
                        <Button variant="outlined" size="sm">
                            Learn More
                        </Button>
                    </DialogFooter>
                </Dialog>
            </div>
        </Animate>
        
    );
};

export default BuyToken;
