import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Circles } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import { getApiToken, setTelegramConfig } from '../actions/other';
import { useDispatch } from 'react-redux';

const Splash = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    useEffect(() => {
        dispatch(setTelegramConfig({telegramId: telegramUserid, username: telegramUsername}));
        dispatch(getApiToken());
        
        setTimeout(() => nav('/home'), 5000);
    }, []);

    return (
        <div className="w-full h-full flex justify-center">
            <div className='logo'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}>
                    <img className='logo-img' src="/assets/logo.png" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}>
                    <img className='logo-text' src="/assets/logo-text.png" />
                </motion.div>

                <Circles
                    height="80"
                    width="80"
                    color="#9f694b"
                    ariaLabel="circles-loading"
                    wrapperClass="loading-icon"
                    visible={true}
                    />

            </div>
        </div>
    );
}

export default Splash;