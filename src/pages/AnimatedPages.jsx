import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import Home from './Home.jsx';
import Stats from './Stats.jsx';
import Stats2 from './Stats2.jsx';


function AnimatedPages() {
    const location = useLocation();
  return (
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />} />
            <Route path='/stats/normal/*' element={<Stats />} />
            <Route path='/stats/nft/*' element={<Stats2 />} />
        </Routes>
      </AnimatePresence>
  )
}

export default AnimatedPages