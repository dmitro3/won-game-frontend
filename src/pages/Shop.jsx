import React, { useState, useRef, useEffect } from 'react';
import Animate from "../components/Animate";
import ShopItem from '../components/ShopItem';
import Charater from '../components/Character';
import { useDispatch, useSelector } from 'react-redux';
import { buyItem } from '../actions/shop';
import { viewAll } from '../actions/mine';
import { unlockCharacter, viewCharacters } from '../actions/character';
import { updateUser } from '../actions/earn';
import { showPayment } from '../actions/other';

const Shop = () => {

    const userData = useSelector((state) => state.earn.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(viewAll());
    }, []);

    const handleItemClick = (item) => {
        if (userData.tokens - item.price < 0) {
            dispatch(showPayment(true));
            return;
        }

        dispatch(buyItem({id: item._id}, () => {
            dispatch(viewAll());
        }));

        dispatch(updateUser({tokens: userData.tokens - item.price, levelIndex: userData.levelIndex}));
    }

    const handleCharacterClick = (item) => {
        if (userData.tokens - item.price < 0) {
            dispatch(showPayment(true));
            return;
        }

        dispatch(unlockCharacter({id: item._id}, () => {
            dispatch(viewAll());
        }));

        dispatch(updateUser({tokens: userData.tokens - item.price, levelIndex: userData.levelIndex}));
    }

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 rounded-lg shadow-lg h-full overflow-y-auto">
                {/* <div className="flex flex-col pt-3 space-y-3 w-full"> */}
                    <div className='flex justify-between px-5'>
                        <div className='flex gap-2 items-center'>
                            <img 
                                src="/assets/img/loader.webp"
                                alt='coin' 
                                width="30px"
                                height="30px"
                            />
                            <p className='text-white text-lg'>{userData.tokens}</p>
                        </div>
                        <div>
                            <img src="/assets/shop/shop.png" alt="logo" className="w-[80px] h-[80px]"/>
                        </div>
                    </div>
                    <div>
                        <Charater onItemSelect={handleCharacterClick}/>
                        <ShopItem onItemSelect={handleItemClick}/>
                    </div>
                {/* </div> */}
            </div>
        </Animate>
    );
}

export default Shop;
