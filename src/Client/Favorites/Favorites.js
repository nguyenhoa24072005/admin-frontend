import React from "react";
import { useFavorites } from "../../Context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import { FiTrash2, FiDollarSign } from "react-icons/fi"; // Import icon đồng tiền

import "./Favorites.css";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleDonateClick = (programId) => {
    navigate(`/donate/${programId}`);
  };

  return (
    <div>
      <Header />
      <div className="favorites-banner1">
        <h1>Your Favorite Programs</h1>
      </div>
      <div className="favorites-container">
        {favorites.length === 0 ? (
          <div className="empty-message">
            <img
              src="https://png.pngtree.com/png-vector/20190716/ourlarge/pngtree-add-to-favorite-icon-trendy-style-isolated-background-png-image_1543111.jpg"
              alt="No favorites"
              className="empty-image"
            />
            <p>You haven't added any favorites yet.</p>
          </div>
        ) : (
          <div className="favorites-list">
            <div className="favorites-header">
              <div className="favorites-column sl-column">SL</div>
              <div className="favorites-column">Image</div>
              <div className="favorites-column">Name</div>
              <div className="favorites-column">Details</div>
              <div className="favorites-column">Actions</div>
            </div>
            {favorites.map((program, index) => (
              <div key={program.programId} className="favorite-card">
                <div className="favorites-column sl-column">{index + 1}</div>
                <div className="favorites-column">
                  <img
                    src={program.imageUrl || "default-image.jpg"}
                    alt={program.name}
                    className="program-image"
                  />
                </div>
                <div className="favorites-column">{program.name}</div>
                <div className="favorites-column">{program.details}</div>
                <div className="favorites-column">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromFavorites(program.programId)}
                  >
                    <FiTrash2 size={18} /> {/* Icon xóa */}
                  </button>
                  <button
                    className="donate-btn"
                    onClick={() => handleDonateClick(program.programId)}
                  >
                    <FiDollarSign size={18} /> {/* Icon đồng tiền */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
