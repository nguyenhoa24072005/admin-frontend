import React, { useState } from "react";
import "./Give.css";
import { FaArrowRightLong, FaYoutube } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6"; // Use FaXmark instead of FaTimes

const Give = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setShowModal(false);
  };

  return (
    <div>
      <div className="give-top">
        <div className="give-cta">
          <div className="give-container">
            <div className="give-asset">
              <div className="give-image">
                <div
                  className="give-yt"
                  onClick={() =>
                    handleVideoClick(
                      "https://www.youtube.com/embed/yL6BqGcxwl4"
                    )
                  }
                >
                  <div className="give-btn">
                    <FaYoutube className="give-youtube" />
                  </div>
                </div>
              </div>
            </div>
            <div className="give-content">
              <div className="give-ner">
                <div className="give-tile">
                  <p>THE SMART, EASY WAY TO GIVE</p>
                </div>
                <div className="give-header">
                  <h4>Donate with the Giving Basket</h4>
                </div>
                <div className="give__header-content">
                  <p className="give-night">
                    Charity Navigator's Giving Basket empowers you to support
                    multiple charities in one convenient checkout while
                    controlling how much of your information you share with each
                    organization.
                  </p>
                </div>
                <div className="give-button">
                  <a className="give-cmp">
                    <FaArrowRightLong className="give-long" />
                    <a href="/program" className="give-ton">
                      Learn more
                    </a>
                  </a>
                </div>
              </div>
              <div className="give-subimage"></div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="video-overlay">
          <div className="video-container">
            <button className="close-btn" onClick={closeModal}>
              {/* Uncomment the following line if you want to use a close icon */}
              <FaXmark />
            </button>
            <iframe
              width="560"
              height="315"
              src={selectedVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Give;
