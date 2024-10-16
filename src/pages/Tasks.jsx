import React, { useState, useRef, useEffect } from 'react';
import Animate from "../components/Animate";
import TaskItem from "../components/TaskItem";
import { PiNotebook } from 'react-icons/pi';
import { FaBoxes } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { viewMilestones } from '../actions/milestone';
const Tasks = () => {

    const dispatch = useDispatch();
    const milestoneData = useSelector((state) => state.milestone.milestones);
    
    useEffect(() => {
        dispatch(viewMilestones());
    },[]);
    console.log("milestone---", milestoneData)
    const handleMenu = (index) => {
        setActiveIndex(index);
    };

    return (
        <Animate>
            <div className="w-full h-full">
                {
                    [1, 2, 3].map((item) => <TaskItem item={{
                        name: "Bronze", 
                        reward: 50000, 
                        balanceRequired: 1000,
                        icon: '/assets/bronze.webp',
                    }} />)
                }
            </div>
        </Animate>
    );
}

export default Tasks;