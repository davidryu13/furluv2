import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/transactions.css";
import { FaCalendarAlt } from "react-icons/fa";
import { createTransaction, getTransactions, deleteTransaction } from "../utils/api";

export default function Transactions() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pet = state?.pet;

  const [date, setDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [amount, setAmount] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);

  // Load user's transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const transactions = await getTransactions();
      setUserTransactions(transactions);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  const deleteTransactionHandler = async (txId) => {
    if (window.confirm('Delete this booking?')) {
      try {
        await deleteTransaction(txId);
        setUserTransactions((prev) => prev.filter((tx) => tx.id !== txId));
      } catch (err) {
        console.error('Failed to delete transaction', err);
        alert('Failed to delete booking: ' + (err.message || err));
      }
    }
  };

  const confirmBooking = async () => {
    if (!date || !amount) {
      alert("Please select a date and enter an amount!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format date to dd-MM-yyyy as required by backend
      const [year, month, day] = date.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      const transactionData = {
        date: formattedDate,
        amount: parseFloat(amount),
        status: "Confirmed",
      };

      const newTransaction = await createTransaction(transactionData);

      setBookingConfirmed(true);
      
      setTimeout(() => {
        alert(`✅ Booking confirmed!\n\nPet: ${pet.name}\nDate: ${date}\nAmount: ₱${amount}\n\nTransaction ID: ${newTransaction.id}`);
        setBookingConfirmed(false);
        setDate("");
        setAmount("");
        
        // Reload transactions
        loadTransactions();
      }, 200);
    } catch (err) {
      setError(`Failed to confirm booking: ${err.message}`);
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="transactions-fullscreen">
        <div className="transaction-content">
          <button 
            className="back-button" 
            onClick={() => navigate("/dashboard/listings")}
          >
            ← Back to Listings
          </button>
          <p className="center-text">No pet selected. Please select a pet from listings first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-fullscreen">
      <button 
          className="back-button" 
          onClick={() => navigate("/dashboard/listings")}
          disabled={loading}
        >
          ← Back to Listings
        </button>
      <div className="transaction-content">
        <div class="t-head">
          <h2>Breeding Transaction 🐾</h2>

          {error && <div className="error-message">{error}</div>}

          <img src={pet.image} alt={pet.name} className="transaction-pet-image" />

          <p><strong>Pet:</strong> {pet.name}</p>
          <p><strong>Breed:</strong> {pet.breed || "Unknown"}</p>
          <p><strong>Type:</strong> {pet.type || "Unknown"}</p>
          <p className="status-text">
            <strong>Status:</strong>
            <span className={`status ${pet.status === "Available" ? "available" : "not-available"}`}>
              {pet.status || "Available"}
            </span>
          </p>
        </div>
        <div className="t-form">
        <div>
        </div>
        <div className="transaction-field">
          <label><strong>Date of Breeding:</strong></label>
          <div className="date-picker">
            <input
              type="text"
              placeholder="Select date"
              value={date}
              readOnly
              onClick={() => setShowCalendar(!showCalendar)}
              disabled={loading}
            />
            <FaCalendarAlt
              className="calendar-icon"
              onClick={() => setShowCalendar(!showCalendar)}
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
            />
          </div>
          {showCalendar && (
            <input
              type="date"
              className="calendar-popup"
              onChange={(e) => {
                setDate(e.target.value);
                setShowCalendar(false);
              }}
              disabled={loading}
            />
          )}
        </div>

        <div className="transaction-field">
          <label><strong>Transaction Amount (₱):</strong></label>
          <input
            type="number"
            className="amount-input"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            step="0.01"
            min="0"
          />
        </div>

        <div className="transaction-buttons">
          <button 
            className="book-btn" 
            onClick={confirmBooking}
            disabled={loading || !date || !amount}
          >
            {loading ? "Processing..." : "Book"}
          </button>

          <button
            className="message-btn"
            onClick={() => navigate("/dashboard/messages", { state: { user: pet } })}
            disabled={loading}
          >
            Message Owner
          </button>
        </div>

        {bookingConfirmed && (
          <p className="booking-success">✅ Booking Confirmed!</p>
        )}

        {/* Display user's transactions */}
        {userTransactions.length > 0 && (
          <div className="transactions-history">
            <h3>Your Recent Bookings</h3>
            <div className="transactions-list">
              {userTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="transaction-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
                    <div className="tx-date">{tx.date}</div>
                    <div className="tx-amount">₱{tx.amount?.toFixed(2)}</div>
                    <div className={`tx-status ${tx.status?.toLowerCase()}`}>
                      {tx.status}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTransactionHandler(tx.id)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                    title="Delete booking"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}