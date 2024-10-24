import React, { useState, useRef, useEffect } from 'react';
import Animate from "../components/Animate";
import ShopItem from '../components/ShopItem';
import Charater from '../components/Character';
import { useDispatch, useSelector } from 'react-redux';
import { buyItem } from '../actions/shop';
import { viewAll } from '../actions/mine';
import { unlockCharacter } from '../actions/character';
import { updateUser } from '../actions/user';
import { showPayment } from '../actions/other';

const Shop = () => {
    const userData = useSelector((state) => state.user.user);
    const telegramId = useSelector((state)=> state.other.telegramId);
    const username = useSelector((state)=> state.other.username);

    const dispatch = useDispatch();

    const handleItemClick = (item) => {
        if (userData.tokens - item.price < 0) {
            dispatch(showPayment(true));
            return;
        }
        let itemData = {id: item._id, username: username};
        dispatch(buyItem({telegramId, itemData}, () => {
            dispatch(viewAll({telegramId, username}));
        }));
        let data = {tokens: userData.tokens - item.price, levelIndex: userData.levelIndex};
        dispatch(updateUser({telegramId, data}));
    }

    const handleCharacterClick = (item) => {
        if (userData.tokens - item.price < 0) {
            dispatch(showPayment(true));
            return;
        }
        let characterData = {id: item._id, username: username};
        dispatch(unlockCharacter({telegramId, characterData}, () => {
            dispatch(viewAll({telegramId, username}));
        }));
        let data = {tokens: userData.tokens - item.price, levelIndex: userData.levelIndex};
        dispatch(updateUser({telegramId, data}));
    }

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 h-full overflow-y-auto pb-[100px]">
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
            </div>
        </Animate>
    );
}

export default Shop;
