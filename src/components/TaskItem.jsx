import React from "react";
import { Button } from "@material-tailwind/react";
const TaskItem = ({item, onItemSelect}) => {
    return (
        <div key={item.name} className='bg-cards rounded-[15px] p-[8px] flex flex-wrap justify-between items-center'>
            
            <div className='flex flex-1 items-center space-x-2'>

                <div className=''>
                    <img src={item.icon} alt="bronze" className='w-[48px]'/>
                </div>

                <div className='flex flex-col space-y-1'>
                    <span className='font-semibold text-[15px]'>
                        {item.name}
                    </span>

                    <div className='flex items-center space-x-1'>
                        <span>
                            <span className='w-[10px] h-[10px] bg-[#be8130] rounded-full flex items-center'></span>
                        </span>
                        <span className='font-medium text-[14px]'>
                            {item.balanceRequired}
                        </span>
                    </div>
                </div>

            </div>
            <Button className='flex gap-2 items-center justify-center px-2 border rounded-[8px] w-[80px]' color="green" disabled={item.isReceived ? true : false } onClick={() => onItemSelect(item.id)}>
                <img 
                    src="/assets/img/loader.webp"
                    alt='coin' 
                    width="20px"
                    height="20px"
                />
                <p className='text-white text-lg'>{item.reward}</p>
            </Button>
        </div>
    );
}

export default TaskItem;