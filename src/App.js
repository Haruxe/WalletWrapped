import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router} from 'react-router-dom';
import {AnimatePresence} from 'framer-motion';
import AnimatedPages from './pages/AnimatedPages';


function App() {
  return (
    <AnimatePresence>
      <Router>
        <Navbar />
        <AnimatedPages />
      </Router>
    </AnimatePresence>
  );
}

export default App;