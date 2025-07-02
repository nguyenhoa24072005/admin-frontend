import React from 'react';
import './Banner.css'

const Banner = () => {
    return (
        <div className='banner-highlights'>
            <div className='banner-wrapper'>
                <ul className='banner-ul'>
                    <li>
                        <p>
                            <font className='banner-align'>20+</font>
                        </p>
                        <p1>
                            <font className='banner-align'>YEARS</font>
                        </p1>
                    </li>
                    <li>
                        <p>
                            <font className='banner-align'> 8M+ </font>
                        </p>
                        <p1>
                            <font className='banner-align'> VISITORS ANNUALLY </font>
                        </p1>
                    </li>
                    <li>
                        <p>
                            <font className='banner-align'> 225K+ </font>
                        </p>
                        <p1>
                            <font className='banner-align'> CHARITIES RATED </font>
                        </p1>
                    </li>
                    <li>
                        <p>
                            <font className='banner-align'> $250M+ </font>
                        </p>
                        <p1>
                            <font className='banner-align'> DONATED VIA OUR GIVING BASKET </font>
                        </p1>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Banner;