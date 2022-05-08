import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import { LeftArrowAlt, RightArrowAlt } from 'styled-icons/boxicons-regular';
import { ethers } from 'ethers';
import nft_placeholder from '../images/NFT_DEFAULT.jpg';

function Stats2() {
  const [minted, setMinted] = useState(0);
  const [sold, setSold] = useState(0);
  const [bought, setBought] = useState(0);
  const [prevAddress, setPrevAddress] = useState('');
  const [nextAddress, setNextAddress] = useState('');
  const [soldValue, setSoldValue] = useState(0);
  const [mintValue, setMintValue] = useState(0);
  const [boughtValue, setBoughtValue] = useState(0);
  const [held, setHeld] = useState(0);
  const [firstBoughtValue, setFirstBoughtValue] = useState(0);
  const [firstBoughtSource, setFirstBoughtSource] = useState('');

  useEffect(() => {
    DisplayTransactions();
  }, [])

  const DisplayTransactions = async () => {
    //@dev fetches the current URL of the site, i.e someaddress.com/normal/(20359823582935)
    const address = window.location.href.split('/').at(-1);
    setNextAddress('/stats/nft2/' + address);
    setPrevAddress('/stats/normal/' + address);
    //@dev fetch user's transactions
    const nftTxs = await fetch('https://api.etherscan.io/api?module=account&action=tokennfttx&address=' + address + '&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
      .then(response => response.json())
      .then(response => {
          return response;
      })
      .catch(err => console.error(err));
    //@dev variables to keep total amounts
    let totalMinted = 0;
    let totalSold = 0;
    let totalBought = 0;
    let mintedValue = 0;
    let soldValue = 0;
    let boughtValue = 0;
    let firstBoughtValue;
    let firstBoughtSource;
    //@dev adds amounts to corresponding variable
    for (let i = 0; i < nftTxs.result.length; i++){
      if (nftTxs.result[i].from === '0x0000000000000000000000000000000000000000'){
        ++totalMinted;
        mintedValue += nftTxs.result[i].value;
      }
      else if(nftTxs.result[i].to === address.toLowerCase()){
        ++totalBought;
        boughtValue += nftTxs.result[i].value;
      }
      if(nftTxs.result[i].from === address.toLowerCase()){
        ++totalSold;
        soldValue += nftTxs.result[i].value;
      }
    }
    const x = nftTxs.result[0].contractAddress;
    firstBoughtSource = await fetch('https://api.etherscan.io/api?module=contract&action=getabi&address=' + x + '&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
    .then(response => {
        return response;
      })
      .catch(err => console.error(err));
      const url = 'https://mainnet.infura.io/v3/c4ddc1255ea24eab9bfe08bad0aae1a2';
      const provider = new ethers.providers.JsonRpcProvider(url);
      const contract = new ethers.Contract( x, firstBoughtSource, provider);
      const abi = await contract.tokenABI(nftTxs.result[0].tokenID);

    //@dev sets the hooks to their according amounts in wei -> ETH
    setFirstBoughtSource(abi);
    setSold(totalSold);
    setBought(totalBought);
    setMinted(totalMinted);
    setMintValue(mintedValue);
    setBoughtValue(boughtValue);
    setSoldValue(soldValue);
    setHeld((totalBought + totalMinted) - totalSold);
  }

  return (
    <div className='grid grid-flow-row '>
        <div className='h-screen text-white font-JosefinSans 
            drop-shadow-2xl font-thin pt-20 flex flex-col justify-center p-10'>
            <div className='mx-auto bg-[#2323237e] rounded-md p-10 grid grid-flow-col align-middle place-items-center'>
              <div>
            <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring'}}>
          <p className='animate-charcter text-6xl text-center'>
            NFT TRANSACTIONS
          </p>
        </motion.div>
        <div className='space-y-[5rem]'>
        <motion.div
        animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring', delay: 1}}>
          <p className='mt-20 text-4xl'>
            IN TERMS OF NFTs, YOU 
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring', delay: 1.5}}>
        <p className='text-3xl'>
            MINTED {minted}
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring', delay: 2}}>
        <p className='text-3xl'>
            SOLD {sold}
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring', delay: 2.5}}>
        <p className='text-3xl'>
            BOUGHT {bought}
          </p>
        </motion.div>
        <motion.div animate={{x: 0}} initial={{x: -2000}} transition={{duration:1, type: 'spring', delay: 3}}>
        <p className='text-3xl'>
            AND YOU HOLD {held}
          </p>
        </motion.div>
        </div>
            </div>
            <motion.div className='w-[20rem]' animate={{x: 0}} initial={{x: 2000}} transition={{duration: 2, type: 'spring'}}>
              <img src={nft_placeholder} className='w-[20rem]' alt='NFT_PlaceHolder'/>
              <p className='text-center mt-5 text-2xl'>
                Your biggest purchase at NaN ETH!
              </p>
            </motion.div>  
        </div>
        <motion.div className='justify-center flex' animate={{y: 0, opacity: 1}} initial={{y: 500, opacity: 0}} transition={{duration:1, type: 'spring', delay: .5}}>
          <div className='mx-auto'>
          <Link to={prevAddress}>
            <LeftArrowAlt className='w-20'/>
          </Link>
          <Link to={nextAddress}>
            <RightArrowAlt className='w-20'/>
          </Link>
          </div>
        </motion.div>
    </div>
</div>
  )
}

export default Stats2