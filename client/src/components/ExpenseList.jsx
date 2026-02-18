import React, { useEffect, useState } from 'react';
import { getExpenses } from '../api';
import { format } from 'date-fns';
import { ArrowUpDown, Filter } from 'lucide-react';

const ExpenseList = ({ refreshTrigger }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('date_desc'); // default

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await getExpenses({
                category: categoryFilter,
                sort: sortOrder
            });
            setExpenses(res.data);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to fetch expenses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [categoryFilter, sortOrder, refreshTrigger]);

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="card">
            <div className="list-header">
                <h2>Expense List</h2>

                <div className="controls">
                    <div className="control-group">
                        <Filter size={20} color="#6b7280" />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Housing">Housing</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Health">Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <ArrowUpDown size={20} color="#6b7280" />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading expenses...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>{error}</div>
            ) : expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>No expenses found.</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>
                                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td>
                                        <span className="category-badge">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td>
                                        {expense.description}
                                    </td>
                                    <td className="amount">
                                        ₹{expense.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'right' }}>Total:</td>
                                <td className="total-amount">₹{totalAmount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExpenseList;
