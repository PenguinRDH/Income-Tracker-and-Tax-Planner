import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [incomes, setIncomes] = useState([]);
  const [taxSummary, setTaxSummary] = useState(null);
  const [formData, setFormData] = useState({
    job_name: '',
    amount: '',
    federal_amount: '',
    date: '',
    income_type: 'W2'
  });

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchIncomes();
    fetchTaxSummary();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch(`${API_URL}/incomes`);
      const data = await response.json();
      setIncomes(data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const fetchTaxSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/tax-summary`);
      const data = await response.json();
      setTaxSummary(data);
    } catch (error) {
      console.error('Error fetching tax summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });
      
      if (response.ok) {
        setFormData({ job_name: '', amount: '', federal_amount: '', date: '', income_type: 'W2' });
        fetchIncomes();
        fetchTaxSummary();
      }
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/incomes/${id}`, { method: 'DELETE' });
      fetchIncomes();
      fetchTaxSummary();
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <header>
        <h1>Income & Tax Tracker</h1>
      </header>

      <div className="container">
        <div className="card">
          <h2>Add Income</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="job_name"
              placeholder="Job Name"
              value={formData.job_name}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              required
            />
             <input
              type="text"
              name="federal_amount"
              placeholder="Federal Tax Withheld"
              value={formData.federal_amount}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <select
              name="income_type"
              value={formData.income_type}
              onChange={handleChange}
            >
              <option value="W2">W2</option>
              <option value="1099">1099</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit">Add Income</button>
          </form>
        </div>

        {taxSummary && (
          <div className="card tax-summary">
            <h2>Tax Summary</h2>
            <div className="summary-item">
              <span>Total Income:</span>
              <span>${taxSummary.total_income.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Estimated Tax:</span>
              <span>${taxSummary.estimated_tax.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Paid Tax:</span>
              <span>${taxSummary.paid_tax.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Effective Rate:</span>
              <span>{taxSummary.effective_rate.toFixed(2)}%</span>
            </div>
          </div>
        )}

        <div className="card">
          <h2>Income History</h2>
          <div className="income-list">
            {incomes.map((income) => (
              <div key={income.id} className="income-item">
                <div className="income-details">
                  <strong>{income.job_name}</strong>
                  <span className="income-type">{income.income_type}</span>
                  <span>${income.amount.toFixed(2)}</span>
                  <span>${income.federal_amount}</span>
                  <span>{income.date}</span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(income.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
