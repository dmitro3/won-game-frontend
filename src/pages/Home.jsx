import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import BuyToken from "./BuyToken";
import { Spinner } from "@material-tailwind/react";
import { showPayment, getChallenge } from "../actions/other";
import { isSafeValue, isEmpty } from '../utils';
import { useEffect } from "react";
import { loadUser } from "../actions/user";
import { viewAll } from '../actions/mine';
import { viewActivity } from '../actions/activity';

const Home = () => {

    const dispatch = useDispatch();
    const showPay = useSelector((state) => state.other.showPayment);
    const showLoad = useSelector((state) => state.other.showLoading);
    const telegramId = useSelector((state)=> state.other.telegramId);
    const username = useSelector((state)=> state.other.username);
    const userData = useSelector((state) => state.user.user);
    useEffect(() => {
        dispatch(loadUser({telegramId, username}));
        dispatch(viewActivity({telegramId, username}));
        dispatch(viewAll({telegramId, username}));
    }, []);

    useEffect(() => {
        console.log("last", userData.lastChallenge)
        if (userData.lastChallenge == undefined) return;
        dispatch(getChallenge(isSafeValue(userData.lastChallenge, 1)));
    }, [userData.lastChallenge]);

    return (
        <div className="w-full h-full flex justify-center">

            <div className="w-full h-full overflow-y-auto">
                <AnimatePresence mode='wait' initial={true}>
                    <Outlet key={location.pathname} />
                </AnimatePresence>
            </div>

            <div id="footermain" className={`visible z-30 flex flex-col bg-transparent fixed bottom-0 left-0 right-0 justify-center items-center pb-5 px-3`}>
                <Footer />
            </div>

            {
                showPay &&
                <div className="absolute z-40 w-full h-full bg-[#00000088] p-10 flex justify-center align-center">
                    <BuyToken onClose={() => dispatch(showPayment(!showPay))} />
                </div>
            }

            {
                showLoad &&
                <div className="absolute z-50 w-full h-full bg-[#000000DD] p-10 flex justify-center">
                    <div className="flex flex-col my-auto">
                        <Spinner color="amber" className="h-24 w-24"/>
                        <p className="mt-3 text-white text-[20px]">Loading...</p>
                    </div>
                </div>
            }

        </div>
    );
}

export default Home;