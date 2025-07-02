import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiHeart } from "react-icons/ci";
import { useFavorites } from "../../Context/FavoritesContext";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./ProgramList.css";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [programLoading, setProgramLoading] = useState(true);
  const [error, setError] = useState("");
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchPrograms = async () => {
    try {
      setProgramLoading(true);
      const response = await axios.get(
        `https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/program1`
      );
      const programsData = response.data?.$values || [];
      setPrograms(programsData);
    } catch (err) {
      setError("Failed to fetch programs.");
      toast.error("Failed to fetch programs.");
    } finally {
      setProgramLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const toggleFavorite = (program) => {
    if (favorites.some((fav) => fav.programId === program.programId)) {
      removeFromFavorites(program.programId);
      toast.success("Removed from favorites.");
    } else {
      addToFavorites(program);
      toast.success("Added to favorites.");
    }
  };

  const handleDonateClick = (programId) => {
    navigate(`/donate/${programId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCategorySelect = (category, e) => {
    e.preventDefault();
    setSelectedCategories([category]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleProgramClick = (programId) => {
    navigate(`/program/${programId}`);
  };

  const filteredPrograms = programs.filter((program) => {
    const matchesCategories = selectedCategories.length
      ? selectedCategories.includes(program.category)
      : true;
    const matchesSearchTerm = program.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const isUpcoming = program.isUpcoming;
    return matchesCategories && matchesSearchTerm && isUpcoming;
  });

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const currentPrograms = filteredPrograms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryCounts = programs.reduce((acc, program) => {
    const category = program.category;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div>
      <Header />
      <div className="program-header">
        <div className="program-list1">
          <h1 className="program-list">Programs</h1>
          <div className="program-to">
            <div className="program-to2">
              <div className="program-to3">
                <div className="program-sidebar">
                  <div className="search-bar3">
                    <div className="program-container">
                      <div className="program-content">
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearch}
                        />
                        <button className="program-btn1">
                          <FaSearch className="program-fa" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h1 className="program-title">Charity Navigate </h1>
                  <div className="program-border"></div>
                </div>
                <div className="program-col">
                  <div className="program-grid">
                    {programLoading ? (
                      <p>Loading programs...</p>
                    ) : currentPrograms.length === 0 ? (
                      <p>No upcoming programs available.</p>
                    ) : (
                      currentPrograms.map((program) => (
                        <div key={program.programId} className="program-card">
                          <div
                            className="program-image"
                            onClick={() =>
                              handleProgramClick(program.programId)
                            }
                          >
                            {program?.galleryImages?.$values?.length > 0 ? (
                              <img
                                src={`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/images/${program.galleryImages.$values[0].fileName}`}
                                alt={
                                  program.galleryImages.$values[0].caption ||
                                  "Program Image"
                                }
                                className="gallery-image"
                              />
                            ) : (
                              <img
                                src="https://image.baophapluat.vn/w840/Uploaded/2025/athlrainaghat/2023_05_21/den-vau-trong-san-pham-am-nhac-moi-ra-mat-anh-nhan-vat-4409.jpeg"
                                alt="Default Program"
                                className="gallery-image"
                              />
                            )}
                          </div>
                          <div className="program-details">
                            <h2>{program.name}</h2>
                            <p>{program.description}</p>
                            <div className="program-detailss">
                              <p>
                                <strong>Start date:</strong>{" "}
                                {new Date(
                                  program.startDate
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>End date:</strong>{" "}
                                {new Date(
                                  program.endDate
                                ).toLocaleDateString()}
                              </p>
                              <p>
                                <strong>Status:</strong>
                                <p>{program.status}</p>
                              </p>
                            </div>
                            <div className="program-ci">
                              <CiHeart
                                className={`program-heart ${
                                  favorites.some(
                                    (fav) =>
                                      fav.programId === program.programId
                                  )
                                    ? "favorite"
                                    : ""
                                }`}
                                onClick={() => toggleFavorite(program)}
                                aria-label="Toggle favorite"
                              />
                              <button
                                className="program-donate-btn"
                                onClick={() =>
                                  handleDonateClick(program.programId)
                                }
                                aria-label="Donate to program"
                              >
                                Donate
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <ul className="pagination1 program-grid__pagination">
                    <li className="pagination1-item">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination1-item__link"
                      >
                        <MdKeyboardArrowLeft className="program-left" />
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li
                        key={index}
                        className={`pagination1-item ${
                          currentPage === index + 1
                            ? "pagination1-item--active"
                            : ""
                        }`}
                      >
                        <button
                          onClick={() => handlePageChange(index + 1)}
                          className="pagination1-item__link"
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className="pagination1-item">
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination1-item__link"
                      >
                        <MdKeyboardArrowRight className="program fa-right-from-bracket" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
        <Footer />
      </div>
    </div>
  );
};

export default ProgramList;
