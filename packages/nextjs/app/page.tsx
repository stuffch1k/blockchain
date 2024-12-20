"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';

export default function Home() {
    const [offeredSkill, setOfferedSkill] = useState('');
    const [requestedSkill, setRequestedSkill] = useState('');
    const [newUserSkill, setNewUserSkill] = useState('');
    const [offers, setOffers] = useState([]);
    const [_userOffers, setUserOffers] = useState([]);
    const [_userSkills, setUserSkills] = useState([]);
    const { address: connectedAddress } = useAccount();

    const { data: userOffers } = useScaffoldReadContract({
          contractName: "YourContract",
          functionName: "getUserOffers",
          args: [connectedAddress]
        });

    const { data: userSkills } = useScaffoldReadContract({
      contractName: "YourContract",
      functionName: "getUserSkills",
      args: [connectedAddress]
    });

    const { data: allOffers } = useScaffoldReadContract({
      contractName: "YourContract",
      functionName: "getAllOffers"
    });

    const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");
    
    useEffect(() => {
      loadUserSkills();
      loadUserOffers();
      loadAllOffers();
    });

    const loadUserSkills = async () => {
      const skills = await userSkills;
      setUserSkills(skills);
    };

    const loadUserOffers = async () => {
      const _uoffers = await userOffers;
      setUserOffers(_uoffers);
    };

    const loadAllOffers = async () => {
      const _offers = await allOffers;
      setOffers(_offers);
    };


    const createOffer = async () => {
      if (!offeredSkill || !requestedSkill) return;
      try {
        await writeYourContractAsync({
          functionName: "createOffer",
          args: [offeredSkill, requestedSkill]
        });
      } catch (e) {
        console.error("Error creating offer:", e);
      }
      setRequestedSkill("");
      setOfferedSkill("");
      loadUserOffers();
      loadAllOffers();
    };

    const addSkill = async() => {
      if (!newUserSkill) return;
      try {
        await writeYourContractAsync({
          functionName: "addSkill",
          args: [newUserSkill]
        });
      } catch (e) {
        console.error("Error adding skill:", e);
      }
      setNewUserSkill("");
      loadUserSkills();
    }

    const fulfillOffer = async (id: bigint) => {
      try {
        await writeYourContractAsync({
          functionName: "fulfillOffer",
          args: [id]
        });
      } catch (e) {
        console.error("Error fulfill offer:", e);
      }
      loadAllOffers();
    }



    return (
      <div className={styles.container}>
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Skill Swap DApp</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>
        <hr></hr>
        <div className="px-5">
          <h2 className="text-center">
            <span className="block text-2xl mb-2">Add Skill</span>
          </h2>
        </div>
        <input className="input input-bordered w-full bg-accent" type="text" placeholder="New User Skill" value={newUserSkill} onChange={(e) => setNewUserSkill(e.target.value)} />
        <button className="btn btn-primary" onClick={addSkill}>Add new Skill</button>
        <hr></hr>
        <div>
          <div className="px-5">
          <h2 className="text-center">
            <span className="block text-2xl mb-2">Your Skills</span>
          </h2>
          </div>
          <ul>
              {_userSkills && _userSkills.length > 0 ? (
                _userSkills.map((skill) => (
                <li>
                  <p className='text-center'>{skill}</p>
                </li>))
          ) : (
            <p className='text-center'>You didn't add any skills yet</p>
          )}
          </ul>
        </div>
        <hr></hr>
        <div className="px-5">
          <h2 className="text-center">
            <span className="block text-2xl mb-2">Create Offer</span>
          </h2>
        </div>
        <input className="input input-bordered w-full bg-accent" type="text" placeholder="Offered Skill" value={offeredSkill} onChange={(e) => setOfferedSkill(e.target.value)} />
        <input className="input input-bordered w-full bg-accent" type="text" placeholder="Requested Skill" value={requestedSkill} onChange={(e) => setRequestedSkill(e.target.value)} />
        <button className="btn btn-primary" onClick={createOffer}>Create Offer</button>
        <hr></hr>
        <div className="px-5">
          <h2 className="text-center">
            <span className="block text-2xl mb-2">Your created offers</span>
          </h2>
        </div>
        <table className={styles.table}>
        <thead>
            <tr className={styles.tr}>
                <th>Offered Skill</th>
                <th>Requested Skill</th>
            </tr>
        </thead>
        <tbody className={styles.tbody}>
          {_userOffers && _userOffers.length > 0 ? (
            _userOffers.map((offer) => (
              <tr key={offer.id.toString()} className={styles.tr}>
                  <td className={styles.td}>{offer.offeredSkill}</td>
                  <td className={styles.td}>{offer.requestedSkill}</td>       
              </tr>
            ))
          ) : (
              <tr>
                <td colSpan={6} className="text-center">You didn't create any offers yet</td>
              </tr>
          )}
        </tbody>
      </table>
      <hr></hr>
      <div className="px-5">
        <h2 className="text-center">
          <span className="block text-2xl mb-2">All Offers</span>
        </h2>
      </div>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th>Creator</th>
            <th>Offered Skill</th>
            <th>Requested Skill</th>
            <th>Is Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {offers && offers.length > 0 ? (
            offers.map((offer) => (
              <tr key={offer.id.toString()} className={styles.tr}>
                <td className={styles.td}>{offer.creator}</td>
                <td className={styles.td}>{offer.offeredSkill}</td>
                <td className={styles.td}>{offer.requestedSkill}</td>
                <td className={styles.td}>{offer.isActive.toString()}</td>
                <td className={styles.td}>
                  <button className="btn btn-primary" onClick={() => fulfillOffer(offer.id)}>
                    Exchange Skills
                  </button>
                </td>
              </tr>
            ))
          ) : (
              <tr>
                <td colSpan={6} className="text-center">You didn't create any offers yet</td>
              </tr>
          )}
        </tbody>
      </table>
      </div>
    );
}

