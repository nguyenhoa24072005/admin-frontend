import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Ngodetail.css"; // Ensure you've imported the CSS file
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";

const NgoDetail = () => {
  const { id } = useParams(); // Get the id from the URL
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ngos, setNgos] = useState([]); // State to store the list of other NGOs
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current index

  useEffect(() => {
    const fetchNgoDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5024/api/ngo/${id}`);
        setNgo(response.data); // Store NGO details
      } catch (error) {
        setError("Failed to load NGO details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchNgos = async () => {
      try {
        const response = await axios.get("http://localhost:5024/api/ngo");
        if (Array.isArray(response.data.$values)) {
          // Exclude the current NGO from the list
          const filteredNgos = response.data.$values.filter(
            (item) => item.ngoId !== id
          );
          setNgos(filteredNgos); // Store the filtered NGOs list
        } else {
          setNgos([]); // Initialize an empty list if no data
        }
      } catch (error) {
        console.error("Failed to load NGOs:", error);
      }
    };

    fetchNgoDetail(); // Fetch current NGO details
    fetchNgos(); // Fetch list of other NGOs
  }, [id]); // Dependency array to re-fetch data when id changes

  if (loading) return <p>Loading NGO details...</p>;
  if (error) return <p>{error}</p>;

  const nextPage = () => {
    if (currentIndex < ngos.length - 3) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div className="NgoDetail-container">
      <Header />
      <div className="NgoDetail-big">
        <div className="NgoDetail-main">
          <div className="NgoDetail-img">
            <img
              src={ngo?.logoUrl}
              alt={ngo?.name}
              className="NgoDetail-logo"
            />
          </div>
          <div className="NgoDetail-info">
            <h1 className="NgoDetail-name">{ngo?.name}</h1>
            <p className="NgoDetail-description">{ngo?.description}</p>
          </div>
        </div>
      </div>

      <div className="NgoDetail-section2">
        <div className="NgoDetail-section1">
          <div className="NgoDetail-section">
            <h3>Achievements:</h3>
            <p>{ngo?.achievements}</p>
          </div>
          <div className="NgoDetail-section">
            <h3>Mission:</h3>
            <p>{ngo?.mission || "Not available"}</p>
          </div>
          <div className="NgoDetail-section">
            <h3>Team:</h3>
            <p>{ngo?.team || "Not available"}</p>
          </div>
          <div className="NgoDetail-section">
            <h3>Careers:</h3>
            <p>{ngo?.careers || "Not available"}</p>
          </div>
          <div className="NgoDetail-section">
            <h3>Email:</h3>
            <p>{ngo?.email}</p>
          </div>
          <div className="NgoDetail-section">
            <h3>Approved:</h3>
            <p>{ngo?.isApproved ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* List of other NGOs with pagination */}
      <section className="new-itemss">
        <h2>Other NGOs</h2>
        <div className="ngo-slider">
          <button
            className="arrow-left"
            onClick={prevPage}
            disabled={currentIndex === 0}
          >
            &#10094;
          </button>
          <div
            className="ngo-slider-content"
            style={{ transform: `translateX(-${(currentIndex * 100) / 3}%)` }} // Move content
          >
            {ngos.map((ngoItem) => {
              const ngoId = ngoItem.ngoId;
              return (
                <div className="new-item" key={ngoId}>
                  <Link to={`/ngos/${ngoId}`}>
                    <img
                      src={ngoItem.logoUrl || "fallback-image-url.jpg"}
                      alt={ngoItem.name}
                      className="new-item-image"
                    />
                    <div className="new-item-content">
                      <h2>{ngoItem.name}</h2>
                      <p>{ngoItem.description}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <button
            className="arrow-right"
            onClick={nextPage}
            disabled={currentIndex + 3 >= ngos.length}
          >
            &#10095; {/* Right arrow */}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NgoDetail;
