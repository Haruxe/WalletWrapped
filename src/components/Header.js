import "../index.css";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Footer from "./Footer";
import { toast } from "react-toastify";

const { REACT_APP_ETHERSCAN_APIKEY, REACT_APP_INFURA_KEY } = process.env;

function Header() {
  let navigate = useNavigate();
  function AddressInput() {
    return (
      <input
        className="rounded-sm w-full p-3 lg:text-xl text-center monoSpace mx-auto text-lg font-thin mt-5"
        placeholder="Enter ENS/Address"
        id="addressSubmit"
      />
    );
  }
  let [invalidAddress, setInvalidAddress] = useState(false);

  function IsValid(_result) {
    if (_result.result > 0) {
      return true;
    } else {
      setInvalidAddress(true);
    }
  }

  async function ProcessAddress() {
    var url = "https://mainnet.infura.io/v3/" + REACT_APP_INFURA_KEY;
    var customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    const address = document.getElementById("addressSubmit").value;
    let finalAddress = address;

    if (address.length === 0) {
      toast.error("Please enter an address or ENS name");
      return;
    }

    if (address.length < 19 && address.length > 0) {
      finalAddress = await customHttpProvider.resolveName(
        address.toLowerCase()
      );
    }

    toast.loading("Fetching stats for your wallet...", {
      autoClose: false,
      toastId: "loading",
    });
    const result = await fetch(
      "https://api.etherscan.io/api?module=account&action=balance&address=" +
        finalAddress +
        "&tag=latest&apikey=" +
        REACT_APP_ETHERSCAN_APIKEY
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => {
        toast.dismiss("loading");
        toast.error("Error while fetching data");
        console.error(err);
      });

    if (IsValid(result)) {
      toast.dismiss("loading");
      navigate("/stats/" + finalAddress);
    }
  }

  return (
    <div className="flex flex-col lg:w-[1200px] w-full justify-center mx-auto">
      <motion.div
        className="flex flex-col mt-[18rem]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        <div className="text-white text-center monoSpace drop-shadow-2xl my-10">
          <div className="mx-auto lg:text-5xl text-[6vw] flex flex-col space-y-0 lg:space-y-5">
            <h1>YOUR WALLET,</h1>
            <h2 className="animate-charcter text-[16vw] lg:text-[160px] mx-auto font-bold font-mono tracking-wider">
              WRAPPED
            </h2>
            <p className="mt-5 text-lg lg:text-xl text-gray-400">
              I wonder how much gas you've spent 🤔
            </p>
          </div>
        </div>
        <div className="mt-5 items-center justify-center flex flex-col">
          <div className="bg-[#2f2f2f61] rounded-sm align-middle flex flex-col p-8 mx-auto w-full md:w-2/3">
            <AddressInput />
            <motion.button
              className="px-5 py-3 lg:text-xl text-lg mx-auto bg-slate-100 mt-9 font-mono tracking-wide
                rounded-sm drop-shadow-2xl font-thin"
              onClick={ProcessAddress}
              whileHover={{ scale: 1.05 }}
            >
              <p>LETS GO!</p>
            </motion.button>
            <motion.div>
              <p className="monoSpace text-xl text-red-600 font-thin animate-ping">
                {invalidAddress ? "INVALID ADDRESS" : ""}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <p className="mt-[12rem] text-sm lg:text-md text-gray-300 mx-auto monoSpace leading-relaxed text-center">
        Enter your Ethereum wallet address, and get statistics such as net
        profits, and sold/minted NFTs! This project is open sourced, feel free
        to contribute to the{" "}
        <a
          target="_blank"
          href="https://github.com/Haruxe/WalletWrapped"
          className="text-blue-400 text-lg lg:text-xl"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        repo!
      </p>
      <Footer />
    </div>
  );
}

//@dev unused
// async function GenerateChart(_address) {
//   let myChart;
//   const transactions = await fetch(
//     "https://api.etherscan.io/api?module=account&action=txlist&address=" +
//       _address +
//       "&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=" +
//       ETHERSCAN_APIKEY
//   )
//     .then((response) => response.json())
//     .then((response) => {
//       return response;
//     });
// }

// async function ShowBalance(_address) {
//   const balanceLocation = document.getElementById("eth");
//   const USDLocation = document.getElementById("usd");

//   const balance = await fetch(
//     "https://api.etherscan.io/api?module=account&action=balance&address=" +
//       _address +
//       "&tag=latest&apikey=" +
//       ETHERSCAN_APIKEY
//   )
//     .then((response) => response.json())
//     .then((response) => {
//       return response;
//     })
//     .catch((err) => console.error(err));

//   const ETHConversion = await fetch(
//     "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=" +
//       MONEY_APIKEY
//   )
//     .then((response) => response.json())
//     .then((response) => {
//       return response;
//     })
//     .catch((err) => console.error(err));

//   balanceLocation.innerHTML =
//     "ETH: " + (balance.result.toString() / 10 ** 18).toFixed(4);
//   USDLocation.innerHTML =
//     "USD: " + ((balance.result / 10 ** 18) * ETHConversion.USD).toFixed(2);
// }

export default Header;
