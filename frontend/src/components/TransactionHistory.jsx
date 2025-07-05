
import React, { useState } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [retailer, setRetailer] = useState(null);
  const [history, setHistory] = useState([]);
  const [allRetailers, setAllRetailers] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/transaction-history", {
        retailer_name: name,
        contact_number: phone,
      });
      setRetailer(res.data.retailerDetails);
      setHistory(res.data.transactions);
      setShowAll(false);
    } catch (error) {
      alert("Retailer not found or server error");
    }
  };

  const fetchAllRetailers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/all-retailers");
      setAllRetailers(res.data);
      setShowAll(true);
      setRetailer(null);
      setHistory([]);
    } catch (err) {
      alert("Failed to fetch retailers");
    }
  };

  const viewRetailerTransactions = async (retailerId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/transactions/${retailerId}`);
      setRetailer(res.data.retailerDetails);
      setHistory(res.data.transactions);
      setShowAll(false);
    } catch (err) {
      alert("Failed to fetch transactions");
    }
  };

  return (
    <div className="transaction-history">
      <h2>Retailer Transaction History</h2>
      <input type="text" placeholder="Retailer Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Contact Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button onClick={fetchHistory}>Get History</button>
      <button onClick={fetchAllRetailers}>Show All</button>

      {showAll && (
        <div className="all-retailers-list">
          <h3>All Retailers</h3>
          {allRetailers.map((ret) => (
            <div className="retailer-card" key={ret.id}>
              <p><strong>Retailer ID:</strong> {ret.id}</p>
              <p><strong>Name:</strong> {ret.name}</p>
              <p><strong>Phone:</strong> {ret.contact_number}</p>
              <p><strong>Address:</strong> {ret.address}</p>
              <button onClick={() => viewRetailerTransactions(ret.id)}><FaEye /> View</button>
            </div>
          ))}
        </div>
      )}

      {retailer && (
        <div className="retailer-info">
          <p><strong>Retailer ID:</strong> {retailer.id}</p>
          <p><strong>Name:</strong> {retailer.name}</p>
          <p><strong>Phone:</strong> {retailer.contact_number}</p>
          <p><strong>Address:</strong> {retailer.address}</p>
        </div>
      )}

      {history.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Running Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((txn, idx) => (
              <tr key={idx}>
                <td>{txn.id}</td>
                <td>{txn.date}</td>
                <td>{txn.type}</td>
                <td>{txn.amount}</td>
                <td>{txn.running_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;