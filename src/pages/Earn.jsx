import Animate from "../components/Animate";
import TouchPan from '../components/TouchPan';

const Earn = () => {
    return (
        <Animate>
            <div className="max-w-sm mx-auto bg-gray-900 text-white rounded-lg shadow-lg h-full overflow-y-auto">
                <TouchPan />
            </div>
        </Animate>
    );
}

export default Earn;
