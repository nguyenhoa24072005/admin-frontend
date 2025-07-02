import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import Donate from "../../Donate/Donate"; // Import phần Donate vào
import "./ProgramListDetail.css";

const ProgramListDetail = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await axios.get(`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/program1/${programId}`);
        setProgram(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Program not found.");
        } else {
          setError("Error fetching program details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId]);

  if (loading) return <p>Loading program details...</p>;
  if (error) return <p>{error}</p>;

  const handleShowMoreImages = () => {
    setShowAllImages(!showAllImages);
  };

  const galleryImages = program.galleryImages?.$values || [];
  const imagesToShow = showAllImages ? galleryImages : galleryImages.slice(0, 3);

  return (
    <div>
      <Header />
      <div className="program-detail">
        
        <h1>{program.name}</h1>
        <div className="program-content">
          <p>{program.description || "This program aims to distribute food to those in need, ensuring no one goes hungry."}</p>
         
        </div>

        
        {/* Gallery Section */}
        <div className="program-gallery">
          <h3>Some pictures during our implementation at the project</h3>
          <div className="gallery-images">
            {imagesToShow.map((image, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/images/${image.fileName}` || "/path-to-default-image.jpg"}
                  alt={image.caption}
                  className="gallery-image"
                />
              </div>
            ))}
          </div>
          {galleryImages.length > 3 && (
            <button className="show-more-button" onClick={handleShowMoreImages}>
              {showAllImages ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Donation Section */}
        {/* <div className="donate-section">
        <Donate programId={programId} />
        </div> */}
      </div>
       {/* Donation Section */}
       <div className="donate-section">
        <Donate programId={programId} />
        </div>
    </div>
  );
};

export default ProgramListDetail;
