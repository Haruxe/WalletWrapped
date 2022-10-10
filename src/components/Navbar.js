import "../index.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "styled-icons/boxicons-regular";

function Navbar() {
  return (
    <div className="w-screen h-20 bg-[#000003] content-center font-JosefinSans absolute z-40">
      <div className="flex items-center pt-5 justify-end my-auto mr-[3rem] space-x-[4rem]">
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
          <Link to="/">
            <Home className="w-8 fill-neutral-50 navbarIcon" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Navbar;
