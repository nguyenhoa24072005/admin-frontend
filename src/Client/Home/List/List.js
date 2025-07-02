import React from "react";
import "./List.css";
import { FaArrowRightLong } from "react-icons/fa6";

const List = () => {
  return (
    <div className="list-cta">
      <div className="list-image">
        <div className="list-ims">
          <div className="list-asset">
            <div className="list-img">
              <picture>
                <img
                  src="https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--658c98f1-7db9-4874-bb4f-67dc6b93cd48/atom_illo_GivingCircle.svg.webp?preferwebp=true&width=760"
                  alt="Img"
                />
              </picture>
            </div>
          </div>
          <div className="list-hero">
            <div className="list-content">
              <div className="list-phan1">
                <p>WHO WE ARE</p>
              </div>
              <div className="list-phan2">
                <h4>
                  Charity Navigator is a research tool for anyone looking to
                  make a difference.
                </h4>
              </div>
              <div className="list-phan3">
                <p className="list-night">
                  You can use Charity Navigator to find and support thousands of
                  charities that align with your passions and values. We use
                  data from the IRS, partners, and the charities themselves to
                  power our unbiased ratings so that you can give with
                  confidence.
                </p>
              </div>
              <div className="list-phan4">
                <a className="list-button" href="/about">
                  <FaArrowRightLong className="list-long" />
                  <span className="list-cmp">Learn more about us</span>
                </a>
              </div>
            </div>
            <div className="list-text"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
