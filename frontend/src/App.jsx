import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AddRetailer from "./components/AddRetailer";
import AddPurchase from "./components/AddPurchase";
import RecordPayment from "./components/RecordPayment";
import GetHistory from "./components/GetHistory";
import AllRetailers from "./components/AllRetailers";
import RetailerTransactions from "./components/RetailerTransactions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-retailer" element={<AddRetailer />} />
        <Route path="/add-purchase" element={<AddPurchase />} />
        <Route path="/record-payment" element={<RecordPayment />} />
        <Route path="/get-history" element={<GetHistory />} />
        <Route path="/all-retailers" element={<AllRetailers />} />
        <Route path="/transactions/:retailerId" element={<RetailerTransactions />} />
      </Routes>
    </Router>
  );
};

export default App;
