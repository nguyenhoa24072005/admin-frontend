import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Import toast và ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import style cho Toastify
import "./Home.css";
import Slider from "../Components/Slider/Slider";
import Fifty from "./Fifty/Fifty";
import List from "./List/List";
import Promotions from "./Promotions/Promotions";
import Banner from "./Banner/Banner";
import Basics from "./Basics/Basics";
import Give from "./Give/Give";
import Footer from "../Components/Footer/Footer";

const Home = () => {
  const location = useLocation();
  const message = location.state?.message;

  useEffect(() => {
    if (message) {
      toast.success(message); // Hiển thị thông báo đăng nhập thành công
    }
  }, [message]);

  return (
    <div>
      <ToastContainer />
      <Slider />
      <section className="featured-product">
        <Fifty />
      </section>
      <section className="manufacturers">
        <Promotions />
      </section>
      <List />
      {/* <Banner /> */}
      <Basics />
      <Give />
      <Footer />
    </div>
  );
};

export default Home;
