import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:5000/expenses';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Retry logic with exponential backoff
const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (error) {
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(fn, retries - 1, delay * 2);
    }
};

export const getExpenses = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.sort) params.append('sort', filters.sort);

    return fetchWithRetry(() => api.get(`/?${params.toString()}`));
};

export const createExpense = async (expenseData) => {
    // Add idempotency key if not present (though usually backend handles check, 
    // frontend should generate it to ensure retries of same operation are idempotent)
    const data = { ...expenseData, idempotencyKey: expenseData.idempotencyKey || uuidv4() };

    return fetchWithRetry(() => api.post('/', data));
};

export default api;
