import React from "react";
import "./Section.css";

const Section = () => {
  return (
    <div>
      <div className="section-content">
        <div className="section-container">
          <div className="section-aem">
            <div className="section-res">
              <div className="section-before"></div>
              <div className="section-default">
                <div className="section-top">
                  <div className="section-layer">
                    <div className="section-div">
                      <h2 className="section-miss">
                        <b className="section-b">
                          Our mission is to make impactful giving easier for all
                        </b>
                      </h2>
                      <p className="section-p1"></p>
                      <p className="section-p">
                        <span className="section-para">
                          Since 2001, we've empowered millions of donors by
                          providing free access to data, tools, and resources to
                          guide philanthropic decision-making.
                        </span>
                      </p>
                      <p className="section-p1"></p>
                      <p className="section-p">
                        <span className="section-para">
                          With more than 225,000 charities rated, our
                          comprehensive ratings shine a light on the
                          cost-effectiveness and overall health of a charity’s
                          programs, including measures of stability, efficiency,
                          and sustainability. The metrics inform donors of not
                          just where their dollars are going but what their
                          dollars are doing.
                        </span>
                      </p>
                      {/* <p className='section-p'>
                                             <span className='section-para'></span>
                                        </p> */}
                      <p className="section-p1"></p>
                      <p className="section-p">
                        <span className="section-para">
                          Like the organizations we rate, we're a 501(c)(3)
                          nonprofit, too. We don't charge the charities we
                          evaluate, ensuring our ratings remain objective. In
                          turn, we depend on the generosity of individuals,
                          foundations, and corporations to fund our programs.
                        </span>
                      </p>
                      <p className="section-p1"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
