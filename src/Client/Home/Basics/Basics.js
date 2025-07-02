import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import "./Basics.css";

const Basics = () => {
  const [ngos, setNgos] = useState([]); // State to store the list of NGOs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await axios.get(
          "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ngo"
        );
        console.log("API Response:", response.data); // Check API response
        const ngoList = response.data.$values || []; // Get NGOs list from $values
        setNgos(ngoList.slice(0, 3)); // Fetch only the first 3 items
      } catch (error) {
        console.error("Error fetching NGOs:", error);
        setError("Failed to load NGOs.");
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  return (
    <div className="basics-aem">
      <div className="basics-list">
        <div className="basics-card">
          <div className="basics-warp">
            <div className="basics-header">
              <div className="basics-title">Featured NGOs</div>
              <div className="basics-button">
                <a className="basics-a" href="/ngos">
                  See All NGOs
                </a>
              </div>
            </div>
            <div className="basics-cards">
              {loading ? (
                <p>Loading NGOs...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <ul className="basics-active">
                  {ngos.map((ngo) => (
                    <li className="basics-Item" key={ngo.ngoId || ngo.id}>
                      <Link to={`/ngos/${ngo.ngoId || ngo.id}`}>
                        {/* Navigate to the detail page */}
                        <div className="basics-content">
                          <div className="basics-image">
                            <img
                              className="basics-anh"
                              src={ngo.logoUrl || "fallback-image-url.jpg"}
                              alt={ngo.name}
                              onError={(e) =>
                                (e.target.src = "fallback-image-url.jpg")
                              }
                            />
                            <div className="basics-overlay">
                              <div className="basics-title-overlay">
                                {ngo.name}
                              </div>
                            </div>
                          </div>
                          <div className="basics-description">
                            <div className="promp-ton">{ngo.name}</div>
                            <div className="basics-date">{ngo.description}</div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basics;
