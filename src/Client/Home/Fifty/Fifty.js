import React from "react";
import { RxCornerTopRight } from "react-icons/rx";
import "./Fifty.css";

const Fifty = () => {
  return (
    <div>
      <article className="fifty-left">
        <div className="fifty-inner">
          <div className="fifty-image">
            <picture>
              <img
                className="fifty-img"
                src="https://www.actionagainsthunger.org/app/uploads/2022/09/ET_FSL_2019_LysArango_Sekota_hidroponic-9-scaled-aspect-ratio-685-602-685x600-c-center.webp"
                alt="logo"
              />
            </picture>
          </div>
          <div className="fifty-content">
            <RxCornerTopRight className="fifty-before" />
            <h2 className="fifty-caps">Let's take action </h2>
            <div className="fifty-wysi">
              <p className="fifty-together">
                Together, we can end hunger. Join our fight to save lives,
                empower communities, and bring positive change to millions of
                children and families around the world.
              </p>
            </div>
            <div className="fifty-cta">
              <a className="fifty-green" href="/program">
                Take Action
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Fifty;
