import React from "react";

const Info = ({children}) => {

    return (
        <p className="text-center text-lg px-2 py-1 bg-[#00000044] rounded-md">
            {children}
        </p>
    );
};

export default Info;
