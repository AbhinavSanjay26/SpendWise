import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://127.0.0.1:8000',timeout:8000});
export const getExpenses=()=>api.get('/expenses').then(r=>r.data);
export const addExpense=(data)=>api.post('/expenses',data).then(r=>r.data);
export const getPatterns=()=>api.get('/patterns').then(r=>r.data);
export const getPrediction=()=>api.get('/prediction').then(r=>r.data);
export const getSubscriptions=()=>api.get('/subscriptions').then(r=>r.data);
export const whatIf=(amount,category)=>api.get('/what-if',{params:{amount,category}}).then(r=>r.data);
export default api;
