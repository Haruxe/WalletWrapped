import '../index.css';
import React from 'react'
import {motion} from 'framer-motion';
import {Link} from 'react-router-dom';

function Header() {
  return (
<div className='bg-[#000003] flex justify-center items-center'>
    <div className='grid h-screen content-center justify-center'>
        <motion.div animate={{scale: 1}} initial={{scale: 0}} transition={{duration: .5}} exit={{scale: 0}}>
            <div className='text-white text-8xl text-center font-thin font-JosefinSans drop-shadow-2xl '>
                <h1>
                    YOUR 2022 WALLET,
                </h1>
                <h2 className='animate-charcter mt-4 font-thin'>
                    WRAPPED
                </h2>
            </div>
        </motion.div>
        <motion.div className='mt-20 items-center justify-center' animate={{opacity: 1}} initial={{opacity: 0}} exit={{opacity: 0}}>
            <div className='bg-[#2f2f2f61] rounded-sm align-middle flex flex-col p-20 w-[70rem] mx-auto'>
                <AddressInput />
                <motion.button className='h-[5rem] w-[12rem] text-3xl mx-auto bg-slate-100 mt-9 font-JosefinSans 
                rounded-sm drop-shadow-2xl font-thin' 
                onClick={ProcessAddress}
                whileHover={{scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                >
                    <p>
                        <Link to={'/stats'}>
                            LETS GO
                        </Link>
                    </p>
                </motion.button>
            </div>
        </motion.div>
    </div>
</div>
  )
}

function AddressInput(){
    return(
            <input className='rounded-sm h-[5rem] w-[40rem] p-3 text-center font-JosefinSans mx-auto text-5xl font-thin mt-5' placeholder='Enter ETH Address' id='addressSubmit' />
    );
}

function ProcessAddress() {
    const address = document.getElementById('addressSubmit').value;
    if (address.length < 40){return};
    ShowBalance(address);
    GenerateChart(address);
}

async function GenerateChart(_address) {
    let myChart;
    const transactions = await fetch('https://api.etherscan.io/api?module=account&action=txlist&address=' + _address + '&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=B3I77K3XUMYN91UAGMVK166RRBME8QMRP7')
    .then(response => response.json())
    .then(response => {
        return response
    })
    .catch(err => console.error(err));
    let ethOutInfo = 0;
    let ethInInfo = 0;
    for(let i = 0; i < transactions.result.length; i++){
        if (transactions.result[i].from == _address){
            ethOutInfo += (transactions.result[i].value / 10**18);
        } else {
            ethInInfo += (transactions.result[i].value / 10**18);
        }
    } 
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