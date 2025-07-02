import React from 'react';
import './Values.css'
const Values = () => {
    return (
        <div>
            <div className='values-container'>
                <div className='values-aem'>
                    <div className='values-ctaitem'>
                        <div className='values-align'>
                            <div className='values-image'>
                                <div className='values-asset'>
                                    <div className='values-age'>
                                        <picture>
                                            <img src='https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--c0ef9563-8320-4cc6-aee2-3acd953c8cd9/contact-us.jpeg.webp?preferwebp=true&width=760' alt='Contact Us'/>
                                        </picture>
                                    </div>
                                </div>
                                <div className='values-hero'>
                                    <div className='values-content'>
                                        <div className='values-header'>
                                            <h4>Contact Us</h4>
                                        </div>
                                        <div className='values-content'>
                                            <p className='values-sky'>Get in touch with our team to answer questions, explore partnerships, or fund our work.</p>
                                        </div>
                                        <div className='values-bottom'>
                                            <a className='values-repo' href='http://localhost:3001/contact'>
                                                <span className='values-span'>Get in touch</span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className='values-subimage'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Values;