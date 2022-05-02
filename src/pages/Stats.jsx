import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { LeftArrow, RightArrow } from 'styled-icons/boxicons-regular';
import {Link} from 'react-router-dom'

function Stats() {
  let [spent, setSpent] = useState(0);
  let [recieved, setRecieved] = useState(0);
  let [gas, setGas] = useState(0);
  let [balance, setBalance] = useState(0);
  let [address, setAddress ] = useState('');
  let [spentUSD, setSpentUSD] = useState(0);
  let [recievedUSD, setRecievedUSD] = useState(0);
  let [gasUSD, setGasUSD] = useState(0);
  let [balanceUSD, setBalanceUSD] = useState(0);

  useEffect(() => {
    GetTotalTransactions();
  }, [])

  const GetTotalTransactions = async () => {
    const address = window.location.href.split('/').at(-1);
    setAddress('/stats2/' + address);
    let txs = await fetch('https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
      .then(response => response.json())
      .then(response => {
          return response;
      })
      .catch(err => console.error(err));
      const gotBalance = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=' + address + 
      '&tag=latest&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
      .then(response => response.json())
      .then(response => {
          return response
      })
      .catch(err => console.error(err));
      const ETHConversion = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=cd6917916df962f1bb2f06158caa2ade8d8c331a60ec9e1cfe4dc9ba980fb656')
    .then(response => response.json())
    .then(response => {
        return response
    })
    .catch(err => console.error(err));

    let totalSent = 0;
    let totalRecieved = 0;
    let totalGas = 0;
    for (let i = 0; i < txs.result.length; i++){
        if (txs.result[i].from === address.toLowerCase()){
          totalSent += txs.result[i].value / 10**18;
          totalGas += (txs.result[i].gasUsed * txs.result[i].gasPrice) / 10**18;
        }
        else {
          totalRecieved += txs.result[i].value / 10**18;
        }
    }
    setSpent(Math.round(totalSent*100)/100);
    setRecieved(Math.round(totalRecieved*100)/100);
    setGas(Math.round(totalGas*100)/100);
    setBalance(Math.round(gotBalance.result / 10**18 *100)/100)
    setSpentUSD(Math.round(totalSent  * ETHConversion.USD *100)/100);
    setRecievedUSD(Math.round(totalRecieved * ETHConversion.USD *100)/100);
    setGasUSD(Math.round(totalGas * ETHConversion.USD *100)/100);
    setBalanceUSD(Math.round(gotBalance.result * ETHConversion.USD / 10**18 *100)/100)
  }

  return(
    <div className='grid grid-flow-row '>
    <div className='h-screen text-7xl text-white font-JosefinSans 
        drop-shadow-2xl font-thin pt-20 flex flex-col justify-center'>
        <div className='mx-auto bg-[#2323237e] rounded-md p-10'>
          <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring'}}>
          <p className='animate-charcter text-7xl'>
            ETH TRANSACTIONS
          </p>
        </motion.div>
        <div className='space-y-[5rem]'>
        <motion.div
        animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring', delay: 1}}>
          <p className='mt-20 text-4xl'>
            IN TOTAL, YOU:
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring', delay: 1.5}}>
        <p className='text-5xl'>
            SENT {spent} ETH / {spentUSD} USD
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring', delay: 2}}>
        <p className='text-5xl'>
          RECEIVED {recieved} ETH / {recievedUSD} USD
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring', delay: 2.5}}>
        <p className='text-5xl'>
          LOST {gas} ETH ON GAS / {gasUSD} USD
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:2, type: 'spring', delay: 3}}>
        <p className='text-5xl'>
          CURRENT BALANCE {balance} ETH / {balanceUSD} USD
          </p>
        </motion.div >
        <motion.div className='justify-center flex' animate={{y: 0, opacity: 1}} initial={{y: 500, opacity: 0}} transition={{duration:2, type: 'spring', delay: 2}}>
          <div className='mx-auto'>
          <Link to='/'>
            <LeftArrow className='w-20'/>
          </Link>
          <Link to={address}>
            <RightArrow className='w-20'/>
          </Link>
          </div>
        </motion.div>
          </div>
        </div>
    </div>
  </div>
);
}

export default Stats