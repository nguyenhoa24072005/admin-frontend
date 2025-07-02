import React, { useEffect, useState } from 'react';
import { getNGOs, updateNGO, deleteNGO } from '../ServiceAdmin/NgoadminService';
import "./Ngoadmin.css";

const Ngoadmin = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hàm tải danh sách NGO
  const loadNGOs = async () => {
    setLoading(true);
    try {
      const ngosData = await getNGOs(); // Lấy tất cả các NGO
      if (ngosData && Array.isArray(ngosData.$values)) {
        setNgos(ngosData.$values); // Lấy tất cả các NGO mà không cần lọc
      } else {
        console.error('Dữ liệu trả về không đúng định dạng:', ngosData);
      }
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    }
    setLoading(false);
  };
  
  
  // Hàm duyệt NGO
  const handleApprove = async (ngoId) => {
    console.log("Approving NGO with ID:", ngoId); // Log để kiểm tra ID
    try {
      // Gọi API duyệt NGO
      const response = await updateNGO(ngoId);

      // Kiểm tra phản hồi từ server
      if (response && response.isApproved) {
        setNgos(prevNgos =>
          prevNgos.map(ngo =>
            ngo.ngoId === ngoId ? { ...ngo, isApproved: true } : ngo
          )
        );
        alert('NGO approved successfully!');
      }
    } catch (error) {
      console.error('Error approving NGO:', error);
      alert('Failed to approve NGO');
    }
  };

  // Hàm xóa NGO
  const handleDelete = async (ngoId) => {
    try {
      await deleteNGO(ngoId); // Xóa NGO
      loadNGOs(); // Tải lại danh sách NGO
    } catch (error) {
      console.error('Error deleting NGO:', error);
    }
  };

  useEffect(() => {
    loadNGOs(); // Tải danh sách NGO khi trang được tải
  }, []);

  return (
    <div className="ngoadmin-container">
      <h2>NGO</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <table className="ngos-table">
          <tbody>
            {ngos.map((ngo) => (
              <li key={ngo.ngoId} className="ong">
                <div className="ngo-info1">
                  <div className="ngo-src">
                    <img src={ngo.logoUrl} alt={ngo.name} className="ngo-logo1" />
                  </div>
                  <div className="ngo-url1">
                    <h3>{ngo.name}</h3>
                    <p><strong>Description:</strong> {ngo.description}</p>
                    <p><strong>Code:</strong> {ngo.code}</p>
                    <p><strong>Achievements:</strong> {ngo.achievements}</p>
                    <p><strong>Created At:</strong> {new Date(ngo.createdAt).toLocaleDateString()}</p>
                    {/* <button 
                      className="approve-btn" 
                      onClick={() => handleApprove(ngo.ngoId)} 
                      disabled={ngo.isApproved} // Disable the button if already approved
                    >
                      {ngo.isApproved ? 'Approved' : 'Approve'}
                    </button> */}
                    <button className="delete-btn" onClick={() => handleDelete(ngo.ngoId)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Ngoadmin;