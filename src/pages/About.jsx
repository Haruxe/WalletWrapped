import React from 'react'
import {motion} from 'framer-motion';

function About() {
  return (
    <motion.div className='h-screen flex'>
        <div className='text-white text-4xl font-thin text-left font-JosefinSans 
        mt-20 flex flex-col justify-center ml-10'
        >
            <h1>
                ABOUT
            </h1>
            <p className='mt-10 w-[50%]'>
                Enter your Ethereum wallet adress or connect your MetaMask wallet to see some stats about
                your wallet this year!
            </p>
        </div>
    </motion.div>
  )
}

export default About