import { ethers } from 'ethers';

const TransactionList = ({ transactions }) => {
    return (
        <div>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((tx) => (
                    <li key={tx.id.toString()}>
                        {tx.isIncome ? 'Income' : 'Expense'}: {tx.description} - {ethers.utils.formatEther(tx.amount)} ETH
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
