import '../index.css';
import {Coffee} from '@styled-icons/boxicons-regular/Coffee';
import {Link} from 'react-router-dom';
import {motion } from 'framer-motion';

function Navbar() {
    return(
      <div className='w-screen h-20 bg-[#000003] content-center font-JosefinSans absolute mb-20'>
        <div className='flex items-center justify-end pt-5 mr-[3rem] space-x-[4rem]'>
          <motion.p className='navbarIcon' whileHover={{scale: 1.1 }}>
            <Link to='/about'>
              ABOUT
            </Link>
          </motion.p>
          <motion.div whileHover={{scale: 1.1 }}>
            <Link to='/'>
              <Coffee className='w-10 fill-neutral-50 navbarIcon' />
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

export default Navbar