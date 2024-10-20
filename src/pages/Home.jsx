import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import BuyToken from "./BuyToken";
import { showPayment } from "../actions/other";
import { useEffect } from "react";
import { viewUser } from "../actions/earn";

const Home = () => {

    const dispatch = useDispatch();
    const showPay = useSelector((state) => state.other.showPayment);

    useEffect(() => {
        dispatch(viewUser());
    }, [showPay]);

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

        </div>
    );
}

export default Home;