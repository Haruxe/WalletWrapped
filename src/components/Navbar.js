import '../index.css';
import {Link} from 'react-router-dom';
import {motion } from 'framer-motion';
import { Home } from 'styled-icons/boxicons-regular';

function Navbar() {
    return(
      <div className='w-screen h-20 bg-[#000003] content-center font-JosefinSans absolute z-40'>
        <div className='flex items-center justify-end pt-5 mr-[3rem] space-x-[4rem]'>
          <motion.div whileHover={{scale: 1.2 }} whileTap={{ scale: .9 }}>
            <Link to='/'>
              <Home className='w-10 fill-neutral-50 navbarIcon' />
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

export default Navbar