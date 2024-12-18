"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import YourContract from '../../hardhat/artifacts/contracts/YourContract.sol/YourContract.json';

const contractAddress = "0x2439D592606e8E4404b268627566785728d09678";

export default function Home() {
    const [offeredSkill, setOfferedSkill] = useState('');
    const [requestedSkill, setRequestedSkill] = useState('');
    const [offers, setOffers] = useState([]);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const createOffer = async () => {
        if (!offeredSkill || !requestedSkill) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, YourContract.abi, signer);

        const tx = await contract.createOffer(offeredSkill, requestedSkill);
        await tx.wait();
        alert('Offer created!');
        fetchOffers();
    };

    const fetchOffers = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, YourContract.abi, provider);
        const offerCount = await contract.offerCount;
        const offersArray = [];
        for (let i = 1; i <= offerCount; i++) {
            const offer = await contract.offers(i);
            offersArray.push(offer);
        }
        setOffers(offersArray);
    };

    const acceptOffer = async (id) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, YourContract.abi, signer);

        const tx = await contract.acceptOffer(id);
        await tx.wait();
        alert('Offer accepted!');
        fetchOffers();
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <div>
            <h1>Skill Swap DApp</h1>
            <h2>Create Offer</h2>
            <input type="text" placeholder="Offered Skill" value={offeredSkill} onChange={(e) => setOfferedSkill(e.target.value)} />
            <input type="text" placeholder="Requested Skill" value={requestedSkill} onChange={(e) => setRequestedSkill(e.target.value)} />
            <button onClick={createOffer}>Create Offer</button>

            <h2>Available Offers</h2>
            <ul>
                {offers.map((offer, index) => (
                    <li key={index}>
                        {offer.offeredSkill} for {offer.requestedSkill}
                        <button onClick={() => acceptOffer(index + 1)}>Accept</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
