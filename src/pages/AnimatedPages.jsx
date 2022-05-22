import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import Home from './Home.tsx';
import Stats from './Stats.tsx';


function AnimatedPages() {
    const location = useLocation();
  return (
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />} />
            <Route path='/stats/*' element={<Stats />} />
        </Routes>
      </AnimatePresence>
  )
}

export default AnimatedPages