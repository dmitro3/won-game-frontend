import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import './App.css';

import ErrorCom from './components/ErrorCom';
import Splash from './pages/Splash';
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Earn from "./pages/Earn";
import Mine from "./pages/Mine";
import Challenge from "./pages/Challenge";
import Leaderboards from "./pages/Leaderboards";
import Tournament from "./pages/Tournament";
import BuyToken from "./pages/BuyToken";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Splash />,
        errorElement: <ErrorCom />,
    },
    {
        path: "/home",
        element: <Home />,
        errorElement: <ErrorCom />,
        children:[
            {
                path:"/home",
                element: <Earn />,
            },
            {
                path:"/home/buytoken",
                element: <BuyToken />,
            },
            {
                path:"/home/leaderboards",
                element: <Leaderboards />,
            },
            {
                path:"/home/tournament",
                element: <Tournament />,
            },
            {
                path:"/home/challenge",
                element: <Challenge />,
            },
            {
                path:"/home/mine",
                element: <Mine />,
            },
            {
                path:"/home/shop",
                element: <Shop />,
            },
        ],
    }
]);
  
function App() {
    return (
        <>
            <TonConnectUIProvider manifestUrl={location.protocol + "//" + location.hostname + "/tonconnect-manifest.json"}>
                <RouterProvider router={router} />
            </TonConnectUIProvider>
            <ToastContainer />
        </>
    );
}

export default App;
