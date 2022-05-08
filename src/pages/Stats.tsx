import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { LeftArrowAlt, Money, RightArrowAlt } from 'styled-icons/boxicons-regular';
import {Link} from 'react-router-dom'
import { History } from"@styled-icons/fluentui-system-regular/History";
import { SportsFootball } from 'styled-icons/material';
import { Smart } from 'styled-icons/crypto';
import { Wolframlanguage } from 'styled-icons/simple-icons';
import { GasStation } from 'styled-icons/remix-fill';

function Stats() {
  let [spent, setSpent] = useState('0');
  let [recieved, setRecieved] = useState('0');
  let [gas, setGas] = useState('0');
  let [address, setAddress ] = useState('0');
  let [userAddress, setUserAddress] = useState("0");
  let [spentUSD, setSpentUSD] = useState('0');
  let [recievedUSD, setRecievedUSD] = useState('0');
  let [gasUSD, setGasUSD] = useState('0');
  let [recentAmount, setRecentAmount] = useState('0');
  let [recentDateAgo, setRecentDateAgo] = useState('0')
  let [recentType, setRecentType] = useState('');
  let [recievedIncome, setRecievedIncome] = useState('0');
  let [etherscanLink, setEtherscanLink] = useState('/');
  let [walletType, setWalletType] = useState(<></>);
  let [netGainLoss, setNetGainLoss] = useState(0);
  let [netGainLossUSD, setNetGainLossUSD] = useState(0);

  useEffect(() => {
    DisplayTransactions();
    
  }, [])

  useEffect(() => {
    SetWallet();
  }, [userAddress])

  const DisplayTransactions = async () => {
    //@dev fetches the current URL of the site, i.e someaddress.com/normal/(20359823582935)
    const address = window.location.href.split('/').at(-1);
    setUserAddress(address);
    setAddress('/stats/nft/' + address);
    //@dev fetch user's transactions
    let regTxs = await fetch('https://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
      .then(response => response.json())
      .then(response => {
          return response;
      })
      .catch(err => console.error(err));
    let innerTxs = await fetch('https://api.etherscan.io/api?module=account&action=txlistinternal&address=' + address + '&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
      .then(response => response.json())
      .then(response => {
          return response;
      })
      .catch(err => console.error(err));
    
    
    //@dev fetch live ETH -> USD
    const ETHConversion = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=cd6917916df962f1bb2f06158caa2ade8d8c331a60ec9e1cfe4dc9ba980fb656')
      .then(response => response.json())
      .then(response => {
        return response
      })
    .catch(err => console.error(err));

    //@dev variables to keep total amounts
    let totalSent = 0;
    let totalRecieved = 0;
    let totalGas = 0;
    // gets most recent txn's eth value
    const mostRecentAmount = regTxs.result[0].value;
    let mostRecentType = '';
    if (regTxs.result[0].to == address.toLowerCase()) {
      setRecentType('received');
    } else {
      setRecentType('sent');
    }
    // gets most recent txn's UNIX timestamp in milliseconds
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    seconds = (Date.now() - (regTxs.result[0].timeStamp * 1000)) / 1000;

    minutes = seconds / 60;
    seconds %= 60;

    hours = minutes / 60;
    minutes %= 60;

    days = hours / 24;
    hours %= 24;

    days %= 24;

    let timeAgoString = '';
    
    if (days >= 1){
      timeAgoString += days.toFixed(0) + ' day(s), ';
    }
    if (hours >= 1){
      timeAgoString += hours.toFixed(0) + ' hour(s), ';
    }
    if (minutes >= 1){
      timeAgoString += minutes.toFixed(0) + ' minute(s)';
    }

    //@dev adds amounts from the user's txn list to corresponding variable
    for (let i = 0; i < regTxs.result.length; i++){
        if (regTxs.result[i].from === address.toLowerCase()){
          totalSent += regTxs.result[i].value / 10**18;
          totalGas += (regTxs.result[i].gasUsed * regTxs.result[i].gasPrice) / 10**18;
        }
        else {
          totalRecieved += regTxs.result[i].value / 10**18;
        }
    }

    for (let i = 0; i < innerTxs.result.length; i++){
      if (innerTxs.result[i].from === address.toLowerCase()){
        totalSent += innerTxs.result[i].value / 10**18;
        totalGas += (innerTxs.result[i].gasUsed * innerTxs.result[i].gasPrice) / 10**18;
      }
      else {
        totalRecieved += innerTxs.result[i].value / 10**18;
      }
  }

    //@dev sets the hooks to their according amounts in wei -> ETH
    setRecentAmount(mostRecentType + ' ' + ((mostRecentAmount / 10**18).toFixed(4).toString()));
    setRecentDateAgo(timeAgoString);
    setSpent(((totalSent*100)/100).toFixed(3));
    setRecieved(((totalRecieved*100)/100).toFixed(3));
    setGas(((totalGas*100)/100).toFixed(3));

    setSpentUSD(((totalSent  * ETHConversion.USD)).toFixed(2).toLocaleString("en-US"));
    setRecievedUSD(((totalRecieved * ETHConversion.USD).toFixed(2).toLocaleString("en-US")));
    setGasUSD((totalGas * ETHConversion.USD).toFixed(2).toLocaleString("en-US"));
    setNetGainLoss(totalRecieved - totalSent);
    setNetGainLossUSD(((totalRecieved - totalSent) * ETHConversion.USD))

    setRecievedIncome(((netGainLossUSD / 60000) * 100).toFixed(2).toString());
    setEtherscanLink('https://etherscan.io/tx/' + regTxs.result[0].hash);
  }

  function GoEtherscanLink() {
    window.open(etherscanLink);
  }

  function SetWallet() {
      if (userAddress.slice(-1).toLowerCase() == 'a'
      || userAddress.slice(-1).toLowerCase() == 'b'
      || userAddress.slice(-1).toLowerCase() == 'c') {
        setWalletType(
          <div>
            <div className='text-5xl flex items-center align-middle'>
              <Wolframlanguage className='w-[65px] mr-5'/>
              <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: .5}}>
              <p>
                Watchdog
              </p>
              </motion.div>
            </div>
            <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: 1.5}}>
            <p className='text-2xl mt-8 leading-relaxed'>
            Watchdogs tend to be the most careful
            for rugs and suspicious organization's behavior. Taking care not
            to pair your wallet to every site, they laugh in the face of people who
            got scammed. "I told you so".
            </p>
            </motion.div>
          </div>
        )
      }
      else if (userAddress.slice(-1).toLowerCase() == 'd'
      || userAddress.slice(-1).toLowerCase() == 'e'
      || userAddress.slice(-1).toLowerCase() == 'f'){
        setWalletType(
          <div>
            <div className='text-5xl flex items-center align-middle'>
              <SportsFootball className='w-[65px] mr-5'/>
              <p>
                Fumbler
              </p>
            </div>
            <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: 1.5}}>
              <p className='text-2xl mt-8 leading-relaxed'>
                People in the Fumbler class tend to sell the 
                moment someone makes a negative comment about their favorite token.
                While others bask in the awe of the bull market, Fumblers are 
                too busy diamond and paper handing.
              </p>
            </motion.div>
          </div>
        )
      }
      else if (userAddress.slice(-1) == '1'
      || userAddress.slice(-1) == '2'
      || userAddress.slice(-1) == '3'){
        setWalletType(
          <div>
            <div className='text-5xl flex items-center align-middle'>
              <GasStation className='w-[65px] mr-5'/>
              <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: .5}}>
              <p>
                Gas Guzzler
              </p>
              </motion.div>
            </div>
            <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: 1.5}}>
            <p className='text-2xl mt-8 leading-relaxed'>
            Gas Guzzler will always tend to spend the maximum amount
            of gas per transaction. You spend all of your eth when gas is at an all time high.
             It doesn't matter if you are sending 0.0001 ETH to a buddy, you will still spend that 0.5 ETH
             transaction fee and speed up the transaction to burn that cash.
            </p>
            </motion.div>
          </div>
        )
      }
      else if (userAddress.slice(-2) == '4'
      || userAddress.slice(-2) == '5'
      || userAddress.slice(-2) == '6'){
        setWalletType(
          <div className='text-5xl flex items-center align-middle'>
            <Smart className='w-[65px] mr-5'/>
            <p>
              Diamond Hander
            </p>
          </div>
        )
      }
      else if (userAddress.slice(-1) == '7'
      || userAddress.slice(-1) == '8'
      || userAddress.slice(-1) == '9'
      || userAddress.slice(-1) == '0'){
        setWalletType(
          <div>
            <div className='text-5xl flex items-center align-middle'>
              <Money className='w-[65px] mr-5'/>
              <p>
                Grinder
              </p>
            </div>
            <motion.div animate={{x: 0}} initial={{x: -2000}}
                  transition={{duration:1, type: 'spring', delay: 1.5}}>
              <p className='text-2xl mt-8 leading-relaxed'>
                Members of the Grinders join every discord that you are linked to,
                just in case theres a giveaway. Retweeting and reacting to Discord 
                giveaways have become your dayjob, though you have yet to figure out if
                whether or not they are rigged.
              </p>
            </motion.div>
          </div>
        )
      }
    }
  
    function GainLoss(){
      if (netGainLoss <= 0) {
        return (
        <div>

        <p>
            In terms of net gains/losses, you have spent about 
            <span className='text-red-300'> {Math.abs(netGainLoss.toFixed(4))} </span>
            more than you have gotten back.
        </p>
        <p className='mt-12'>
        Lets hope what your holding stays in the green!
      </p>
      </div>
        );
      }
      else {
        return (<div>

          <p>
          Luckily, you have gained about 
          <span className='text-green-300'> {netGainLoss.toFixed(4)} 
          ETH / ${netGainLossUSD} </span>in net profit!
        </p>
        <p className='mt-12'>
          Thats about <span className='font-bold text-4xl'>{parseInt(recievedIncome)}% </span> 
          of the average American's salary in net profits without taking into account
          your held assets!
        </p>
          
        </div> 
        );
      }
    }
  
    

  return(
        <div>
          <div className='h-screen text-white font-JosefinSans 
              drop-shadow-2xl pt-20 justify-center p-10 flex flex-col'>
              <div className='mx-auto bg-[#2323237e] rounded-md p-10 grid grid-flow-col space-x-[6rem] align-middle place-items-center'>
                <div className='w-[40rem]'>
                  <div className='justify-center'>
                    <h1 className='text-4xl mb-3 '>
                      Your Wallet Identity:
                    </h1>
                  </div>
                  {walletType}
              <div className='space-y-[5rem] leading-relaxed'>
                  <div>
                    <div className='text-2xl leading-relaxed space-y-12 mt-12'>
                      <div>
                      <p>
                      In total, you have spent <span className='text-red-400'> {spent} ETH / ${spentUSD}</span> and used a total of 
                      <span className='text-red-400'> {gas} ETH / ${gasUSD}</span> on gas fees, <b>ouch!</b>
                    </p>
                    </div>
                      <GainLoss />
                      <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1.5, type: 'spring', delay: 2}}>
                      </motion.div>
                    </div>
                  </div>
                </div>
                </div>
                <div>
                  <div className='w-[20rem]'>
                  <motion.div animate={{rotate: -360}} transition={{duration: 3, type: 'spring'}}>
                    <motion.button whileHover={{scale: 1.05 }} whileTap={{ scale: .95 }} onClick={GoEtherscanLink}>
                      <History className='w-[20rem]' />
                    </motion.button> 
                  </motion.div>
                  <div className='text-center mt-5 text-2xl'>
                  <h1 className='text-xl mb-2'>
                    Most recent transaction
                  </h1>
                    <p>
                    {recentDateAgo} ago you {recentType} a transaction with a <span className='text-orange-300'>{recentAmount}</span> ETH value.
                    </p>
                  </div>
                  </div>  
                  </div>
                </div>
                <motion.div className='justify-center flex' animate={{y: 0, opacity: 1}} initial={{y: 500, opacity: 0}} transition={{duration:1, type: 'spring', delay: .5}}>
              <div className='mx-auto'>
                <Link to='/'>
                  <LeftArrowAlt className='w-20'/>
                </Link>
                <Link to={address}>
                 <RightArrowAlt className='w-20'/>
                </Link>
              </div>
            </motion.div>
            </div>
        </div>);
        }

export default Stats