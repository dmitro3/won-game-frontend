import React, { useState, useRef, useEffect } from 'react';
import Animate from "../components/Animate";
import MineItem from '../components/MineItem';
import ViewDetails from '../components/ViewDetails';
import { Button, ButtonGroup } from "@material-tailwind/react";
import { useDispatch, useSelector } from 'react-redux';
import { viewAll, viewItem } from '../actions/mine';
import MineCharacter from '../components/MineCharacter';

const Mine = () => {

    const dispatch = useDispatch();
    const [selectedItemId, setSelectedItemId] = useState(null); 
    const [type, setType] = useState("character");
    const [character, setCharacter] = useState(null);
    const [attack, setAttack] = useState(null);
    const [shield, setShield] = useState(null);
    const mineItems = useSelector((state) => state.mine.items);

    useEffect(() => {
        dispatch(viewAll());
    }, []);

    useEffect(() => {
        console.log(mineItems);
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
        dispatch(viewItem({id: id}));
    }

    const handleSelect = (type) => {
        setType(type);
    }

    const onSelectItem = () => {
        dispatch(viewAll());
    }

    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-gray-900 text-white p-6 rounded-lg shadow-lg h-full overflow-y-auto">

                <div className='flex justify-center'>
                    <MineCharacter character={character} armor={attack} shield={shield} />
                </div>

                <ButtonGroup className="gap-2 flex justify-center" fullWidth color="green">
                    <Button className="text-center" onClick={() => handleSelect('character')}>Character</Button>
                    <Button className="" onClick={() => handleSelect('attack')}>Attack</Button>
                    <Button className="" onClick={() => handleSelect('defence')}>Defence</Button>
                </ButtonGroup>

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