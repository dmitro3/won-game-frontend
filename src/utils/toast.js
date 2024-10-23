import { toast, Slide } from "react-toastify";

export default (type, message) => {
  toast[type](message, {
    position: "top-center",
    autoClose: 25000,
    hideProgressBar: true,
    transition: Slide,
  });
};
