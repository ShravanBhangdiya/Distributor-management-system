import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RetailerTransactions = () => {
  const { retailerId } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/transactions/${retailerId}`);
        setRetailer(res.data.retailerDetails);
        setHistory(res.data.transactions || []);
      } catch (err) {
        alert("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, [retailerId]);

  return (
    <div className="retailer-transactions">
      <button onClick={() => navigate("/")}>⬅ Back</button>
      {retailer && (
        <>
          <h2>Transaction Details for {retailer.name}</h2>
          <p><strong>Retailer ID:</strong> {retailer.id}</p>
          <p><strong>Phone:</strong> {retailer.contact_number}</p>
          <p><strong>Address:</strong> {retailer.address}</p>

          {history.length > 0 ? (
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
                {history.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{new Date(txn.date).toLocaleDateString()}</td>
                    <td>{txn.type}</td>
                    <td>{txn.amount}</td>
                    <td>{txn.running_balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p><strong>No transactions found.</strong></p>
          )}
        </>
      )}
    </div>
  );
};

export default RetailerTransactions;
