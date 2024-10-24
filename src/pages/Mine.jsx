import React, { useState, useEffect } from 'react';
import Animate from "../components/Animate";
import MineItem from '../components/MineItem';
import ViewDetails from '../components/ViewDetails';
import { useDispatch, useSelector } from 'react-redux';
import { viewAll, viewItem } from '../actions/mine';
import MineCharacter from '../components/MineCharacter';
import { showLoading } from '../actions/other';

const Mine = () => {
    const dispatch = useDispatch();
    const [selectedItemId, setSelectedItemId] = useState(null); 
    const [type, setType] = useState("character");
    const [character, setCharacter] = useState(null);
    const [attack, setAttack] = useState(null);
    const [shield, setShield] = useState(null);
    const mineItems = useSelector((state) => state.mine.items);
    const telegramId = useSelector((state)=> state.other.telegramId);
    const username = useSelector((state)=> state.other.username);

    useEffect(() => {
        dispatch(viewAll({telegramId, username}));
        dispatch(showLoading(true));
    }, []);

    useEffect(() => {
        mineItems.forEach((item) => {
            if (item.type == 'character' && item.isWear) setCharacter(item.imageSrc);
            if (item.type == 'attack' && item.isWear) setAttack(item.imageSrc);
            if (item.type == 'defence' && item.isWear) setShield(item.imageSrc);
        });
    }, [mineItems]);

    useEffect(() => {
        setSelectedItemId(null);
    }, [type]);

    const handleItemClick = (id) => {
        setSelectedItemId(id);
        let data = {id: id};
        dispatch(viewItem({telegramId, data}));
    }

    const handleSelect = (type) => {
        setType(type);
    }

    const onSelectItem = () => {
        dispatch(viewAll({telegramId, username}));
    }

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-[#69423E] text-white p-6 h-full overflow-y-auto pb-[100px]">

                <div className='flex justify-center'>
                    <MineCharacter character={character} armor={attack} shield={shield} />
                </div>
                <div className='flex justify-between'>
                    <img src="/assets/img/character.png" style={{border: type == "character" ? "1px solid" : "none"}} onClick={() => handleSelect('character')} className='cursor-pointer w-[125px] h-[45px]'/>
                    <img src="/assets/img/attack.png" style={{border: type == "attack" ? "1px solid" : "none"}} onClick={() => handleSelect('attack')} className='cursor-pointer w-[90px] h-[45px]'/>
                    <img src="/assets/img/defence.png" style={{border: type == "defence" ? "1px solid" : "none"}} onClick={() => handleSelect('defence')} className='cursor-pointer w-[105px] h-[45px]'/>
                </div>

                <div className="flex flex-col mt-3 space-y-3 w-full h-[240px] overflow-y-auto scrollbar-hide">
                    <MineItem onItemSelect={handleItemClick} type={type}/>
                </div>

                <div className='mt-3'>
                    {selectedItemId && 
                        <ViewDetails selectedItemId={selectedItemId} 
                        onSelectItem={onSelectItem} />}
                </div>

            </div>
        </Animate>
    );
}

export default Mine;