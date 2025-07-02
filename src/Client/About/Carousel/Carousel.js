import React, { useState } from 'react';
import { BsYoutube } from "react-icons/bs";
import './Carousel.css';

const Carousel = () => {
    const [showModal, setShowModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');

    const handleIconClick = (url) => {
        setVideoUrl(url);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setVideoUrl('');
    };

    return (
        <div>
            <div className='carousel-container'>
                <div className='carousel-cmp'>
                    <div className='carousel-item'>
                        <div className='carousel-cn'>
                            <div
                                className='carousel-url'
                                onClick={() => handleIconClick('https://www.youtube.com/embed/-EnNwRuqo-A')}
                            >
                                <i className='carousel-yt'><BsYoutube /></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className='video-overlay'>
                    <div className='video-container'>
                        <button className='close-btn' onClick={closeModal}>×</button>
                        <iframe1
                            width="560"
                            height="315"
                            src={videoUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe1>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carousel;
