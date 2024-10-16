import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './App.css';

import ErrorCom from './components/ErrorCom';
import Splash from './pages/Splash';
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Earn from "./pages/Earn";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import Mine from "./pages/Mine";
import Challenge from "./pages/Challenge";
import Leaderboards from "./pages/Leaderboards";
import Tournament from "./pages/Tournament";
import BuyToken from "./pages/BuyToken";

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
                path:"/home/tasks",
                element: <Tasks />,
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
            {
                path:"/home/settings",
                element: <Settings />,
            },
        ],
    }
]);
  
  
function App() {
    return (<RouterProvider router={router} />);
}

export default App;
