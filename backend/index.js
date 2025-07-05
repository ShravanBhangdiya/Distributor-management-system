const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "distributor_db",
  
  password: "Sanjib@567"
});

// POST route to add a retailer
app.post("/api/retailers", (req, res) => {
  const { name, address, openingBalance, contactNumber } = req.body;
  const id = uuidv4();

  const q = `
    INSERT INTO retailers 
      (id, name, address, opening_balance, contact_number, final_balance)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    q,
    [id, name, address, openingBalance, contactNumber, openingBalance], // final_balance = openingBalance
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to add retailer" });
      }
      res.status(201).json({ message: "Retailer added successfully", id });
    }
  );
});

// POST /api/purchases - add purchase linked to retailer by name+contactNumber
// ✅ Add Purchase

// ✅ Add Purchase Endpoint
app.post("/api/purchases", (req, res) => {
  const { retailerName, contactNumber, purchaseId, amount, date } = req.body;

  if (!retailerName || !contactNumber || !purchaseId || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Step 1: Get retailer_id and current final_balance
  const getRetailerQuery = `
    SELECT id, final_balance FROM retailers 
    WHERE name = ? AND contact_number = ?
  `;

  connection.query(getRetailerQuery, [retailerName, contactNumber], (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error while fetching retailer" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    const retailerId = result[0].id;
    const currentBalance = parseFloat(result[0].final_balance);
    const newBalance = currentBalance + parseFloat(amount);
    const purchaseUUID = uuidv4();

    // Step 2: Insert purchase record with retailer details and updated final balance
    const insertPurchaseQuery = `
      INSERT INTO purchases (
        id, retailer_id, retailer_name, contact_number,
        purchase_id, amount, purchase_date, final_balance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      insertPurchaseQuery,
      [
        purchaseUUID,
        retailerId,
        retailerName,
        contactNumber,
        purchaseId,
        amount,
        date,
        newBalance
      ],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: "Error inserting purchase" });
        }

        // Step 3: Update retailer final_balance
        const updateRetailerQuery = `
          UPDATE retailers SET final_balance = ? WHERE id = ?
        `;

        connection.query(updateRetailerQuery, [newBalance, retailerId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: "Error updating retailer balance" });
          }

          res.status(201).json({
            message: "Purchase added successfully and balance updated",
            purchaseId: purchaseUUID,
            newFinalBalance: newBalance
          });
        });
      }
    );
  });
});

// payments

app.post("/api/payments", (req, res) => {
  const {
    retailerName,
    contactNumber,
    amount,
    date,
    payment_method,
    payment_status,
  } = req.body;

  if (!retailerName || !contactNumber || !amount || !date || !payment_method) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  // Step 1: Fetch retailer details
  const getRetailerQuery = `
    SELECT id, address, final_balance FROM retailers
    WHERE name = ? AND contact_number = ?
  `;

  connection.query(getRetailerQuery, [retailerName, contactNumber], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error while fetching retailer" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    const { id: retailerId, address, final_balance } = results[0];
    const paymentId = uuidv4();
    const currentBalance = parseFloat(final_balance);
    const amountGiven = parseFloat(amount);
    const updatedBalance = currentBalance - amountGiven;

    // Step 2: Insert into payments table.
    const insertPaymentQuery = `
      INSERT INTO payments (
        id, retailer_id, retailer_name, contact_number, address,
        amount_given, final_balance, payment_method, payment_status, payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      insertPaymentQuery,
      [
        paymentId,
        retailerId,
        retailerName,
        contactNumber,
        address,
        amountGiven,
        updatedBalance,
        payment_method,
        payment_status || null,
        date,
      ],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ error: "Error inserting payment" });
        }

        // Step 3: Update final_balance in retailers table
        const updateBalanceQuery = `
          UPDATE retailers SET final_balance = ? WHERE id = ?
        `;

        connection.query(updateBalanceQuery, [updatedBalance, retailerId], (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Balance update error:", updateErr);
            return res.status(500).json({ error: "Error updating retailer balance" });
          }

          res.status(201).json({
            message: "Payment recorded and retailer balance updated",
            paymentId,
            updatedBalance,
          });
        });
      }
    );
  });
});
app.post("/api/transaction-history", (req, res) => {
  const { retailer_name, contact_number } = req.body;
  //console.log("Request body:", req.body);

  if (!retailer_name || !contact_number) {
    return res.status(400).json({ error: "Missing name or phone number" });
  }

  const getRetailerQuery = `
    SELECT id, name, contact_number, address
    FROM retailers
    WHERE name = ? AND contact_number = ?
  `;

  connection.query(getRetailerQuery, [retailer_name, contact_number], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    const retailer = results[0];
    const retailer_id = retailer.id; // ✅ Correct reference

    const getTransactionsQuery = `
      (
        SELECT id AS txn_id, payment_date AS date, 'Payment' AS type, amount_given AS amount, final_balance
        FROM payments WHERE retailer_id = ?
      )
      UNION ALL
      (
        SELECT id AS txn_id, purchase_date AS date, 'Purchase' AS type, amount AS amount, final_balance
        FROM purchases WHERE retailer_id = ?
      )
      ORDER BY date DESC
    `;

    connection.query(getTransactionsQuery, [retailer_id, retailer_id], (txnErr, txnResults) => {
      if (txnErr) {
        console.error("Transaction fetch error:", txnErr);
        return res.status(500).json({ error: "Transaction fetch error" });
      }

      res.json({
        retailerDetails: {
          id: retailer.id,
          name: retailer.name,
          contact_number: retailer.contact_number,
          address: retailer.address,
        },
        transactions: txnResults.map(txn => ({
          id: txn.txn_id,
          date: txn.date,
          type: txn.type,
          amount: txn.amount,
          running_balance: txn.final_balance,
        })),
      });
    });
  });
});
app.get("/api/all-retailers", (req, res) => {
  const query = `SELECT id, name, contact_number, address FROM retailers`;
  //console.log(query);
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});
// Get transactions by retailer ID
app.get("/api/transactions/:retailerId", (req, res) => {
  const retailerId = req.params.retailerId;

  const getRetailerQuery = `SELECT id, name, contact_number, address FROM retailers WHERE id = ?`;
  connection.query(getRetailerQuery, [retailerId], (err, retailerResults) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (retailerResults.length === 0) return res.status(404).json({ error: "Retailer not found" });

    const retailer = retailerResults[0];
const retailer_id = retailer.id; 
    const getTransactionsQuery = `
      (
        SELECT id AS txn_id, payment_date AS date, 'Payment' AS type, amount_given AS amount, final_balance
        FROM payments WHERE retailer_id = ?
      )
      UNION ALL
      (
        SELECT id AS txn_id, purchase_date AS date, 'Purchase' AS type, amount AS amount, final_balance
        FROM purchases WHERE retailer_id = ?
      )
      ORDER BY date ASC
    `;

    connection.query(getTransactionsQuery, [retailerId, retailerId], (txnErr, txnResults) => {
      if (txnErr) return res.status(500).json({ error: "Transaction fetch error" });
      res.json({
        retailerDetails: retailer,
        transactions: txnResults.map(txn => ({
          id: txn.txn_id,
          date: txn.date,
          type: txn.type,
          amount: txn.amount,
          running_balance: txn.final_balance
        }))
      });
    });
  });
});

app.listen(5000, () => {
  console.log("Backend server running at http://localhost:5000");
});

