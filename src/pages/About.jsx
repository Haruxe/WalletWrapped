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
                This is a simple little website to see what kind of 
                activity is on your Ethereum wallet, like your NFT
            </p>
        </div>
    </motion.div>
  )
}

export default About