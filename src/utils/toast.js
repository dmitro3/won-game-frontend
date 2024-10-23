import { toast, Slide } from "react-toastify";

export default (type, message) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    transition: Slide,
  });
};
