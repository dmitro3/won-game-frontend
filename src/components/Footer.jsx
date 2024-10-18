import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { PiGearFill, PiUsersThreeFill } from "react-icons/pi";
import { PiNotebookFill } from "react-icons/pi";
import { PiHandTapFill } from "react-icons/pi";
import { PiRocketLaunchFill } from "react-icons/pi";

const Footer = () => {
    const location = useLocation();

    const footerLinks = [
        {
            title: "Leaderboards",
            link: "/home/leaderboards",
            icon: <PiNotebookFill size={20} className={location.pathname === "/home/leaderboards" ? "w-[26px] h-[26px]" : ""} />
        },
        // {
        //     title: "Token",
        //     link: "/home/buytoken",
        //     icon: <PiNotebookFill size={20} className={location.pathname === "/home/buytoken" ? "w-[26px] h-[26px]" : ""} />
        // },
        // {
        //     title: "Tournament",
        //     link: "/home/tournament",
        //     icon: <PiNotebookFill size={20} className={location.pathname === "/home/tournament" ? "w-[26px] h-[26px]" : ""} />
        // },
        // {
        //     title: "Settings",
        //     link: "/home/settings",
        //     icon: <PiGearFill size={20} className={location.pathname === "/home/settings" ? "w-[26px] h-[26px]" : ""} />
        // },
        // {
        //     title: "Challenge",
        //     link: "/home/challenge",
        //     icon: <PiNotebookFill size={20} className={location.pathname === "/home/challenge" ? "w-[26px] h-[26px]" : ""} />
        // },
        {
            title: "Earn",
            link: "/home",
            icon: <PiHandTapFill size={20} className={location.pathname === "/home" ? "w-[26px] h-[26px]" : ""} />
        },
        {
            title: "Shop",
            link: "/home/shop",
            icon: <PiRocketLaunchFill size={20} className={location.pathname === "/home/shop" ? "w-[26px] h-[26px]" : ""} />
        },
        {
            title: "Mine",
            link: "/home/mine",
            icon: <PiUsersThreeFill size={22} className={location.pathname === "/home/mine" ? "w-[26px] h-[26px]" : ""}/>
        },
    ];

    return (
        <div className="w-full z-30 flex items-center px-[8px] h-[72px] pbd-[2px] justify-center space-x-2 bg-gray-900 border-[#363636] pb-[3px] border-[1px] border-b-[#2c2b2b] rounded-[35px]">

        {
            footerLinks.map((footer, index) => (
                <NavLink 
                    id="reels"
                    key={index}
                    to={footer.link}
                    className={({ isActive }) => {
                      return `
                          ${
                          isActive
                            ? "w-[20%] py-3 flex flex-col h-[60px] px-[6px] mt-1 rounded-[10px] bg-cards items-center justify-center text-[#fff] text-[13px] first:rounded-tl-[22px] first:rounded-bl-[22px] last:rounded-tr-[22px] last:rounded-br-[22px]"
                            : "w-[20%] py-3 flex flex-col space-y-[2px] rounded-[10px] items-center justify-center text-[#c6c6c6] text-[13px]"
                          }
                      `;
                    }}>

                    <div id="reels2" className={location.pathname === `${footer.link}` ? 
                        "space-y-[2px] flex flex-col rounded-[10px] items-center justify-center text-[#fff] text-[12px]" : 
                        "flex flex-col space-y-[4px] rounded-[10px] items-center justify-center text-[#949494] text-[12px]"}>
                            {footer.icon}
                            <span className={`${location.pathname === `${footer.link}` ? "text-[#fff]" : "text-[#949494]"} font-medium mb-[-2px]`}>{footer.title}</span>
                    </div>

                </NavLink>
            ))}
      
      </div>
    );
};

export default Footer;
