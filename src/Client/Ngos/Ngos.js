import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import axios from "axios";
import "./Ngos.css";

const Ngos = () => {
  const [ngos, setNgos] = useState([]); // Khởi tạo ngos là mảng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await axios.get(
          "https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ngo"
        );
        console.log("Response data:", response.data); // Kiểm tra phản hồi

        // Kiểm tra xem phản hồi có phải là mảng không
        if (Array.isArray(response.data.$values)) {
          setNgos(response.data.$values); // Thiết lập ngos là mảng từ $values
        } else {
          setNgos([]); // Trong trường hợp không có dữ liệu hợp lệ
        }
      } catch (error) {
        setError("Failed to load NGOs.");
      } finally {
        setLoading(false); // Đặt loading thành false sau khi hoàn thành
      }
    };

    fetchNgos(); // Gọi hàm fetch
  }, []);

  return (
    <div>
      <Header />
      <div className="new-header">
        <div className="color">
          <div className="brand">
            <h1 className="new-h1">NGOs</h1>
          </div>

          <div className="news-header">
            <div className="banner-image">
              <img
                src="https://www.charitynavigator.org/adobe/dynamicmedia/deliver/dm-aid--68b4c6a2-17fb-459c-b85e-17e5ee2c57d0/hivan-arvizu-soyhivan-MAnhvw0nDDY-unsplash.jpg.webp?preferwebp=true&width=760"
                alt="Banner"
              />
            </div>
            <div className="header-content">
              <h1>Thought Leadership & News</h1>
              <p>
                Beyond ratings, we want to ensure that you have access to
                essential information about the nonprofit sector and our work.
                Read our commentaries.
              </p>
            </div>
          </div>

          <div className="new-container">
            {loading ? (
              <p>Loading NGOs...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <section className="new-items">
                {ngos.map((ngo) => {
                  const ngoId = ngo.ngoId; // Sử dụng ngoId từ dữ liệu phản hồi
                  if (!ngoId) {
                    console.error("ngoId is undefined for:", ngo); // Ghi lại thông tin không hợp lệ
                    return null; // Không render NGO này nếu ngoId không hợp lệ
                  }
                  return (
                    <div className="new-item" key={ngoId}>
                      <Link to={`/ngos/${ngoId}`}>
                        <img
                          src={ngo.logoUrl || "fallback-image-url.jpg"} // Thay thế bằng URL hình ảnh mặc định nếu không tồn tại
                          alt={ngo.name}
                          className="new-item-image"
                        />
                        <div className="new-item-content">
                          <h2>{ngo.name}</h2>
                          <p>{ngo.description}</p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ngos;
