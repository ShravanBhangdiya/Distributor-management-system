import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllRetailers = () => {
  const [allRetailers, setAllRetailers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllRetailers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/all-retailers");
        setAllRetailers(res.data);
      } catch (err) {
        alert("Failed to fetch retailers");
      }
    };

    fetchAllRetailers();
  }, []);

  const handleViewClick = (retailerId) => {
    navigate(`/transactions/${retailerId}`);
  };

  return (
    <div className="transaction-history">
      <h2>All Retailers</h2>
      <div className="all-retailers-list">
        {allRetailers.map((ret) => (
          <div className="retailer-card" key={ret.id}>
            <p><strong>Retailer ID:</strong> {ret.id}</p>
            <p><strong>Name:</strong> {ret.name}</p>
            <p><strong>Phone:</strong> {ret.contact_number}</p>
            <p><strong>Address:</strong> {ret.address}</p>
            <button onClick={() => handleViewClick(ret.id)}>
              <FaEye /> View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRetailers;
