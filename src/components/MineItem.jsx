import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MineItem = ({ onItemSelect, type }) => {
    const dispatch = useDispatch();
    const mineData = useSelector((state) => state.mine.items);
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        let items = mineData.filter((item) => item.type == type);
        setItems(items);
        console.log("Load item", items);
    }, [type, mineData]);

    const onSelect = (item) => {
        setSelected(item._id);
        onItemSelect(item._id);
    }

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
        {
            items && items.map((item)=>{
                return(
                    <div key={item._id} className="flex justify-center">
                        <div className={`relative cursor-pointer ${selected == item._id ? "border-4 border-red-700 border-solid": "border-none"}`} 
                            onClick={() => onSelect(item)}>
                            <img src={item.imageSrc} alt={item.imageAlt} className='w-full h-full'/>
                            <div className="absolute bottom-[10%] left-[20%] border rounded-lg px-2 bg-deep-orange-500 text-[12px]">
                                Lv. {item.levelIndex}
                            </div>
                            {
                                item.isWear && 
                                <div className="absolute top-[0] right-[0] rounded-l px-2 bg-green-500 text-[11px]">
                                    Use
                                </div>
                            }
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
}

export default MineItem;