import { Spinner } from "@material-tailwind/react";
import React from "react";

const CoinIndicator = ({icon, value, size, busy, className = 'justify-center', iconDelta = 0}) => {

    let width = 16;

    if (!icon) icon = "/assets/img/loader.webp";

    if (size == 'sm') {
        width = 16;
    } else if (size == 'lg') {
        width = 24;
    } else {
        width = 18;
    }

    return (
        <div className={className + ' flex items-center gap-2'}>
            <img src={icon} alt='coin' width={`${width + iconDelta}px`} height={`${width + iconDelta}px`} />
            <p style={{fontSize: width}} className={`text-[24px] font-bold`}>{busy ? <Spinner className="mb-3" /> : value}</p>
        </div>
    );
};

export default CoinIndicator;
