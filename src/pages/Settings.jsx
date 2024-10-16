import API from "../../utils/api";
import Animate from "../components/Animate";
import { Card, Input, Button, Typography } from "@material-tailwind/react";

const Settings = () => {
    
    const handleClick = () => {
        console.log("Handle Click");
        API.doPost('/user/1', {
            name: 'Test Name'
        }).then(result => {
            console.log("Result", result);
        });
    }

    return (
        <Animate>
            <Card color="transparent" shadow={true} className="max-w-sm mx-auto h-full bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                <Typography variant="h3" color="blue" className="mt-10">
                    Settings
                </Typography>
                <form className="mt-10">
                    <div className="flex flex-col gap-3">
                        {/* <Typography variant="h5" color="gray" className="mb-5">
                            Your Nickname
                        </Typography> */}
                        <Input label="Nickname" color="blue"/>
                    </div>
                    <Button className="mt-[70%]" fullWidth color="green">
                        Confirm
                    </Button>
                </form>
            </Card>
        </Animate>
    );
}

export default Settings;
