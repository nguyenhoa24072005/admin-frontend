import React, { useState, useEffect } from "react";
import "./Slider.css";
import Header from "../Header/Header";

const Slider = () => {
  const slides = [
    {
      title: "It's not just Coffee, It's",
      highlight: "Starbuck's",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus aliquid vitae nihil id, inventore error corporis hic dolore, optio dignissimos iure beatae dolores possimus porro cumque.",
      image:
        "https://vufo.org.vn/data/data/quynhhoa/2023/10/cao-bang-cai-thien-dieu-kien-song.jpg",
      link: "/donate",
    },
    {
      title: "Delicious Brews, Great Moments",
      highlight: "Cafe Delight",
      description:
        "Experience the perfect blend of fresh beans and warm ambiance. Let every sip take you to a world of comfort and joy.",
      image:
        "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/472878506_1171899590959099_8282383191005360724_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=1&ccb=1-7&_nc_sid=833d8c&_nc_ohc=yXR5PulSuesQ7kNvgH9jIZM&_nc_oc=AdhTm6n0D2hpdnDrYgv0GGkS_qVtgsuVkdYisHFbJQ46Gk1m7krf2N15kEW99LWQCck&_nc_zt=23&_nc_ht=scontent.fhan14-3.fna&_nc_gid=AwsBtFDUOl0bxAad5NmFPf1&oh=00_AYBJ-LYNRAqiZTZw1IkeVyXIPx2LIND-v_4GSU2JAPG6Mg&oe=6785BEFD",
      link: "/donate",
    },
    {
      title: "Brewed to Perfection",
      highlight: "The Coffee Hub",
      description:
        "Indulge in our special selection of hand-crafted coffees made to suit every taste. Your perfect cup is just a click away.",
      image: "https://bepharco.com/Data/Sites/1/News/3880/minigadine-bai-3.jpg",
      link: "/donate",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  const nextSlide = () => {
    setShow(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setShow(true);
    }, 1000); // Đợi 1 giây trước khi cập nhật slider
  };

  const prevSlide = () => {
    setShow(false);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
      );
      setShow(true);
    }, 1000); // Đợi 1 giây trước khi cập nhật slider
  };

  // Tự động thay đổi slide mỗi 10 giây
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000); // 10 giây

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(interval);
  }, []); // Chỉ chạy một lần khi component mount

  const { title, highlight, description, image, link } = slides[currentIndex];

  return (
    <div className="slider-container">
      <Header />
      <div className={`text-content ${show ? "show" : ""}`}>
        <h1>{title}</h1>
        <div className="highlight">{highlight}</div>
        <p>{description}</p>
        <a href="/program" className="learn-more">
          Donate
        </a>
      </div>
      <div className={`image-content ${show ? "show" : ""}`}>
        <img className="main-image" src={image} alt={highlight} />
      </div>

      <div className="slider-navigation">
        <button onClick={prevSlide} className="prev-btn">
          <i className="fas fa-chevron-left"></i>{" "}
          {/* Biểu tượng mũi tên trái */}
        </button>
        <button onClick={nextSlide} className="next-btn">
          <i className="fas fa-chevron-right"></i>{" "}
          {/* Biểu tượng mũi tên phải */}
        </button>
      </div>
    </div>
  );
};

export default Slider;
