'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { transferTokens, getBalance, requestAirdrop, flipCoin } from '../utils/solanaUtils';
import confetti from 'canvas-confetti';

const CoinFlip = () => {
  const [betAmount, setBetAmount] = useState(0);
  const [selectedSide, setSelectedSide] = useState('');
  const [result, setResult] = useState('');
  const [balance, setBalance] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState('heads');
  const wallet = useWallet();

  useEffect(() => {
    const updateBalance = async () => {
      if (wallet.publicKey) {
        const newBalance = await getBalance(wallet.publicKey);
        setBalance(newBalance);
      }
    };
    updateBalance();
  }, [wallet.publicKey, result]);

  const handleFlip = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setResult('Please connect your wallet first.');
      return;
    }

    if (betAmount <= 0 || !selectedSide) {
      setResult('Please enter a valid bet amount and select a side.');
      return;
    }

    if (betAmount > balance) {
      setResult('Insufficient balance.');
      return;
    }

    setResult('Flipping coin...');
    setIsFlipping(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const flipResult = flipCoin();
    setIsFlipping(false);
    setCoinSide(flipResult);

    try {
      if (flipResult === selectedSide) {
        const winAmount = betAmount * 2; // Double the bet amount
        const signature = await transferTokens(wallet, winAmount, true);
        setResult(`Congratulations! You won ${winAmount} SOL! View transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
        celebrateWin();
      } else {
        const loseAmount = betAmount;
        const signature = await transferTokens(wallet, loseAmount, false);
        setResult(`You lost ${loseAmount} SOL. Better luck next time! View transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      console.error('Devnet transaction error:', error);
      setResult('Error processing devnet transaction. Please try again.');
    }
  };

  const handleAirdrop = async () => {
    if (wallet.publicKey) {
      try {
        const signature = await requestAirdrop(wallet.publicKey);
        setResult(`Airdrop of 2 SOL successful! View transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      } catch (error) {
        setResult('Airdrop failed. Please try again.');
      }
    }
  };

  const celebrateWin = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="mt-8 text-white font-sans">
      <p className="mb-4 text-3xl font-bold text-yellow-400 animate-pulse">
        Balance: {balance.toFixed(4)} SOL
      </p>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        placeholder="Bet amount (SOL)"
        className="mr-2 p-2 border rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:bg-gray-700"
      />
      <select 
        onChange={(e) => setSelectedSide(e.target.value)}
        className="mr-2 p-2 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:bg-gray-700"
      >
        <option value="">Select side</option>
        <option value="heads">Heads</option>
        <option value="tails">Tails</option>
      </select>
      <button 
        onClick={handleFlip}
        className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:rotate-3 shadow-lg"
      >
        <span className="inline-block transition-transform group-hover:animate-bounce">
          🪙
        </span>
        {' '}Flip Coin
      </button>
      <button 
        onClick={handleAirdrop}
        className="p-2 bg-yellow-500 text-black rounded mt-4 ml-2 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 hover:-rotate-3 shadow-lg"
      >
        <span className="inline-block transition-transform group-hover:animate-pulse">
          💰
        </span>
        {' '}Request 2 SOL Airdrop
      </button>
      {result && <p className="mt-4 text-lg text-green-400 font-semibold">{result}</p>}
      <div className="bg-yellow-600 text-black p-2 rounded mt-4 font-semibold animate-bounce">
        This app is running on Solana Devnet. No real SOL is used.
      </div>
      
      <div className={`coin ${isFlipping ? 'flipping' : ''} ${coinSide === 'heads' ? 'show-heads' : 'show-tails'}`}>
        <div className="side heads"></div>
        <div className="side tails"></div>
      </div>
      <p className="mt-2 text-lg text-red-400 font-bold">Current coin side: {coinSide}</p>
    </div>
  );
};

export default CoinFlip;