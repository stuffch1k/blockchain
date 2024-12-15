"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import YourContract from '../../hardhat/artifacts/contracts/YourContract.sol/YourContract.json';
// import YourContract from '~~~/hardhat/artifacts/contracts/YourContract.sol/YourContract.json';
import TransactionForm from '~~/components/TransactionForm';
import TransactionList from '~~/components/TransactionList';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function Home() {
    const [transactions, setTransactions] = useState([]);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    useEffect(() => {
        const init = async () => {
            const _provider = new ethers.providers.Web3Provider(window.ethereum);
            const _signer = _provider.getSigner();
            setProvider(_provider);
            setSigner(_signer);
            await fetchTransactions(_signer);
        };
        init();
    }, []);

    const fetchTransactions = async (signer) => {
        const contract = new ethers.Contract(contractAddress, YourContract.abi, signer);
        const txs = await contract.getTransactions();
        setTransactions(txs);
    };

    const addTransaction = async (category, description, amount, isIncome) => {
        const contract = new ethers.Contract(contractAddress, YourContract.abi, signer);
        await contract.addTransaction(category, description, amount, isIncome);
        await fetchTransactions(signer);
    };

    return (
        <div>
            <h1>Personal Finance DApp</h1>
            <TransactionForm addTransaction={addTransaction} />
            <TransactionList transactions={transactions} />
        </div>
    );
}
