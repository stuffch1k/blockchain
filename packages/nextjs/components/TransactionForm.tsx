import { useState } from 'react';
import { ethers } from 'ethers';

const TransactionForm = ({ addTransaction }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isIncome, setIsIncome] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        addTransaction(category, description, ethers.utils.parseEther(amount), isIncome);
        setCategory('');
        setDescription('');
        setAmount('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
            <label>
                <input type="radio" checked={isIncome} onChange={() => setIsIncome(true)} /> Income
            </label>
            <label>
                <input type="radio" checked={!isIncome} onChange={() => setIsIncome(false)} /> Expense
            </label>
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionForm;
