import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import AuthContext
import { toast } from "react-toastify"; // Import toast for notifications

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, auth } = useAuth(); // Use auth context

  // Kiểm tra nếu người dùng đã đăng nhập và có thông tin user
  useEffect(() => {
    if (isAuthenticated() && auth.user) {
      // Khi người dùng đã đăng nhập, tải danh sách yêu thích từ localStorage
      const savedFavorites =
        JSON.parse(localStorage.getItem(`favorites-${auth.user.id}`)) || [];
      setFavorites(savedFavorites);
    }
  }, [isAuthenticated, auth.user]); // Chạy lại khi trạng thái đăng nhập hoặc thông tin user thay đổi

  // Xóa dữ liệu yêu thích khi người dùng đăng xuất
  useEffect(() => {
    if (!isAuthenticated()) {
      // Khi người dùng đăng xuất
      setFavorites([]); // Xóa yêu thích trong state
      localStorage.removeItem(`favorites-${auth.user?.id}`); // Xóa yêu thích khỏi localStorage
    }
  }, [isAuthenticated, auth.user]); // Lắng nghe khi người dùng đăng xuất

  // Lưu danh sách yêu thích vào localStorage khi favorites thay đổi
  useEffect(() => {
    if (isAuthenticated() && auth.user) {
      // Lưu danh sách yêu thích vào localStorage khi có sự thay đổi
      localStorage.setItem(
        `favorites-${auth.user.id}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, isAuthenticated, auth.user]); // Theo dõi sự thay đổi của favorites và user

  // Thêm chương trình vào danh sách yêu thích
  const addToFavorites = (program) => {
    if (!isAuthenticated()) {
      toast.error("You need to login to add products to your wishlist.");
      return;
    }

    // Kiểm tra xem chương trình đã có trong danh sách yêu thích chưa
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.programId === program.programId)) {
        toast.info("The program is already in your favorites list.");
        return prevFavorites;
      }
      const updatedFavorites = [...prevFavorites, program];
      toast.success();
      return updatedFavorites;
    });
  };

  // Xóa chương trình khỏi danh sách yêu thích
  const removeFromFavorites = (programId) => {
    if (!isAuthenticated()) {
      toast.error(
        "You need to log in to remove a program from your favorites list."
      );
      return;
    }

    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter(
        (fav) => fav.programId !== programId
      );
      toast.success();
      return updatedFavorites;
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
