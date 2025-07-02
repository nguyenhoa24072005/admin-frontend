import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Promotions.css";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/program1"
        );
        const promotionsData = response.data?.$values || [];

        // Log the data structure to verify the id field
        console.log(promotionsData);

        setPromotions(promotionsData.slice(0, 6));
      } catch (err) {
        setError("Failed to fetch promotions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) return <div>Loading promotions...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="promo-div">
      <div className="promo-aem">
        <div className="promo-list">
          <div className="promo-card">
            <div className="promo-warp">
              <div className="promo-header">
                <div className="promo-title">Promotions</div>
                <div className="promo-button">
                  <a className="promo-a" href="/program">
                    View all
                  </a>
                </div>
              </div>
              <div className="promo-cards">
                <ul className="promo-active">
                  {promotions.map((promo, index) => (
                    <li key={index} className="promo-Item">
                      <div className="promo-content">
                        <Link
                          className="promo-discover"
                          to={`/program/${promo.programId}`} // Make sure 'programId' exists in the data
                        >
                          <div className="promo-image">
                            <picture>
                              <img
                                className="promo-anh"
                                src={promo.image || "https://image.baophapluat.vn/w840/Uploaded/2025/athlrainaghat/2023_05_21/den-vau-trong-san-pham-am-nhac-moi-ra-mat-anh-nhan-vat-4409.jpeg"}
                                alt={promo.name || "Default Promotion"}
                              />
                               <img
                                className="promo-anh"
                                src={promo.image || ""}
                                alt={promo.name || "Default Promotion"}
                              />
                              
                            </picture>
                          </div>
                          <div className="promo-description">
                            <div className="promp-ton">
                              {promo.name || "No Name Available"}
                            </div>
                            <div className="promo-date">
                              {promo.description || "No Description Available"}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;
