import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaShoppingCart, FaMoneyBill, FaHistory, FaList } from "react-icons/fa";
import "./Home.css";
// done
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Distributor Dashboard</h1>
      <div className="card-container">
        <div className="card" onClick={() => navigate("/add-retailer")}>
          <FaUserPlus className="icon" />
          <span>Add Retailer</span>
        </div>
        <div className="card" onClick={() => navigate("/add-purchase")}>
          <FaShoppingCart className="icon" />
          <span>Add Purchase</span>
        </div>
        <div className="card" onClick={() => navigate("/record-payment")}>
          <FaMoneyBill className="icon" />
          <span>Record Payment</span>
        </div>
        <div className="card" onClick={() => navigate("/get-history")}>
          <FaHistory className="icon" />
          <span>Get Retailer History</span>
        </div>
        <div className="card" onClick={() => navigate("/all-retailers")}>
          <FaList className="icon" />
          <span>Show All Retailers</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
