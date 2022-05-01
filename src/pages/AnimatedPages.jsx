import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import Home from './Home.jsx';
import About from './About.jsx';
import Stats from './Stats.jsx';


function AnimatedPages() {
    const location = useLocation();
  return (
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/stats' element={<Stats />} />
        </Routes>
      </AnimatePresence>
  )
}

export default AnimatedPages