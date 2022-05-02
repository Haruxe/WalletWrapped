import '../index.css';
import React, { useState } from 'react'
import {motion} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {ethers} from 'ethers';


function Header() {
    let navigate = useNavigate();
    function AddressInput(){
        return(
                <input className='rounded-sm h-[5rem] w-[40rem] p-3 text-center font-JosefinSans mx-auto text-5xl font-thin mt-5' placeholder='Enter ENS or address' id='addressSubmit' />
        );
    }
    let [invalidAddress, setInvalidAddress] = useState(false);

    function IsValid(_result, _address){
        if (_result.result > 0){
            return true;
        } else {
            setInvalidAddress(true);
        }
    }
    
    async function ProcessAddress() {
        var url = 'https://mainnet.infura.io/v3/c4ddc1255ea24eab9bfe08bad0aae1a2';
        var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
        const address = document.getElementById('addressSubmit').value;
        let finalAddress = address;

        if (address.length < 19){
            finalAddress = await customHttpProvider.resolveName(address);
        }
        const result = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=' + finalAddress + 
        '&tag=latest&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
        .then(response => response.json())
        .then(response => {
            return response
        })
        .catch(err => console.error(err));
        if (IsValid(result))
        {
            navigate('/stats/' + finalAddress);
        }
    }

  return (
<div className='flex flex-col'>
    <motion.div className='grid h-screen content-center justify-center'
    initial={{scale: 0, opacity: 0}}
    animate={{scale: 1, opacity: 1}}
    transition={{duration: 1.5, type: 'spring'}}>
        <div>
            <motion.div className='text-white text-8xl text-center font-thin font-JosefinSans drop-shadow-2xl' >
                <h1>
                    YOUR 2022 WALLET,
                </h1>
                <h2 className='animate-charcter mt-4 font-thin'>
                    WRAPPED
                </h2>
            </motion.div>
        </div>
        <div className='mt-20 items-center justify-center'>
            <div className='bg-[#2f2f2f61] rounded-sm align-middle flex flex-col p-20 w-[70rem] mx-auto'>
                <AddressInput />
                <motion.button className='h-[5rem] w-[12rem] text-3xl mx-auto bg-slate-100 mt-9 font-JosefinSans 
                rounded-sm drop-shadow-2xl font-thin' 
                onClick={ProcessAddress}
                whileHover={{scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                >
                    <p>
                        LETS GO
                    </p>
                </motion.button>
                <motion.div>
                <p className='font-JosefinSans text-xl text-red-600 font-thin animate-ping'>
                    {invalidAddress ? 'INVALID ADDRESS' : ''}
                </p>
                </motion.div>
            </div>
        </div>
    </motion.div>
</div>
  )
}

//@dev unused
async function GenerateChart(_address) {
    let myChart;
    const transactions = await fetch('https://api.etherscan.io/api?module=account&action=txlist&address=' + _address + '&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
    .then(response => response.json())
    .then(response => {
        return response
    })
}

async function ShowBalance(_address) {
    const balanceLocation = document.getElementById('eth');
    const USDLocation = document.getElementById('usd');

    const balance = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=' + _address + 
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

    balanceLocation.innerHTML = 'ETH: ' + (balance.result.toString() / 10**18).toFixed(4);
    USDLocation.innerHTML = 'USD: ' + (balance.result / 10**18 * ETHConversion.USD).toFixed(2);
}

export default Header