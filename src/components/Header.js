import '../index.css';
import React, { useState } from 'react'
import {motion} from 'framer-motion';

function Header() {
    const [success, setSuccess] = useState(false);
  return (
<div className='flex flex-col justify-center items-center'>
    <div className='grid h-screen content-center justify-center'>
        <div>
            <motion.div className='text-white text-8xl text-center font-thin font-JosefinSans drop-shadow-2xl' 
            initial={{scale: 0}}
            animate={{scale: 1}}
            exit={{scale: 0}}
            transition={{type: 'spring', duration: 3}}
            >
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
            </div>
        </div>
    </div>
    <div id='statroot'>

    </div>
</div>
  )
}

function AddressInput(){
    return(
            <input className='rounded-sm h-[5rem] w-[40rem] p-3 text-center font-JosefinSans mx-auto text-5xl font-thin mt-5' placeholder='Enter ETH Address' id='addressSubmit' />
    );
}

async function ProcessAddress() {
    const address = document.getElementById('addressSubmit').value;
    const balance = await fetch('https://api.etherscan.io/api?module=account&action=balance&address=' + address + 
    '&tag=latest&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
    .then(response => response.json())
    .then(response => {
        return response
    })
    .catch(err => console.error(err));
    IsValid(balance, address);
}

function Stats(props) {
    return(
        <div>
            <div className='h-screen text-6xl text-white mt-9 font-JosefinSans 
                drop-shadow-2xl font-thin'>
                <p>
                    {props.address}
                </p>
            </div>
        </div>
    );
}

function IsValid(_result, _address){
    if (_result.result > 0){
        const root = document.getElementById('statroot');
        const elmt = document.createElement(<Stats address={_address}/>);
        //@dev current issue, trying to append this ^^ element to the 'statroot' element.
        //Good luck chap. o7
        root.innerHTML = elmt;
    }
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