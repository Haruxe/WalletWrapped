import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Money } from "styled-icons/boxicons-regular";
import { History } from "@styled-icons/fluentui-system-regular/History";
import { SportsFootball } from "styled-icons/material";
import { Smart } from "styled-icons/crypto";
import { Wolframlanguage } from "styled-icons/simple-icons";
import { GasStation } from "styled-icons/remix-fill";
import Footer from "../components/Footer";

function Stats() {
  debugger;
  let [spent, setSpent] = useState("-");
  //let [recieved, setRecieved] = useState("-");
  let [gas, setGas] = useState("-");
  //let [address, setAddress] = useState("-");
  let [userAddress, setUserAddress] = useState("-");
  let [spentUSD, setSpentUSD] = useState("-");
  //let [recievedUSD, setRecievedUSD] = useState("-");
  let [gasUSD, setGasUSD] = useState("-");
  //let [recentAmount, setRecentAmount] = useState("-");
  let [recentDateAgo, setRecentDateAgo] = useState("-");
  let [recentType, setRecentType] = useState("-");
  let [recievedIncome, setRecievedIncome] = useState("-");
  let [etherscanLink, setEtherscanLink] = useState("/");
  let [walletType, setWalletType] = useState(<></>);
  let [netGainLoss, setNetGainLoss] = useState(0);
  let [netGainLossUSD, setNetGainLossUSD] = useState(0);

  const [minted, setMinted] = useState("-");
  const [sold, setSold] = useState("-");
  const [bought, setBought] = useState("-");
  const [held, setHeld] = useState("-");

  useEffect(() => {
    DisplayTransactions();
  }, []);

  useEffect(() => {
    SetWallet();
  }, [userAddress]);

  let totalMinted = 0;
  let totalSold = 0;
  let totalBought = 0;

  const DisplayTransactions = async () => {
    //@dev fetches the current URL of the site, i.e someaddress.com/normal/(20359823582935)
    const addressQuery = window.location.href.split("/");
    const address = addressQuery[4];
    setUserAddress(address);
    //setAddress("/stats/nft/" + address);
    //@dev fetch user's transactions
    let regTxs = await fetch(
      "https://api.etherscan.io/api?module=account&action=txlist&address=" +
        address +
        "&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=" +
        process.env.REACT_APP_ETHERSCAN_APIKEY
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));
    let innerTxs = await fetch(
      "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" +
        address +
        "&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=" +
        process.env.REACT_APP_ETHERSCAN_APIKEY
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));

    //@dev fetch live ETH -> USD
    let ETHConversion = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=" +
        process.env.REACT_APP_MONEY_APIKEY
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));

    //@dev variables to keep total amounts
    let totalSent = 0;
    let totalRecieved = 0;
    let totalGas = 0;
    // gets most recent txn's eth value
    const mostRecentAmount = regTxs.result[0].value;
    let mostRecentType = "";
    if (regTxs.result[0].to === address.toLowerCase()) {
      setRecentType("received");
    } else {
      setRecentType("sent");
    }
    // gets most recent txn's UNIX timestamp in milliseconds
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    seconds = (Date.now() - regTxs.result[0].timeStamp * 1000) / 1000;

    minutes = seconds / 60;
    seconds %= 60;

    hours = minutes / 60;
    minutes %= 60;

    days = hours / 24;
    hours %= 24;

    days %= 24;

    let timeAgoString = "";

    if (days >= 1) {
      timeAgoString += days.toFixed(0) + " day(s), ";
    }
    if (hours >= 1) {
      timeAgoString += hours.toFixed(0) + " hour(s), ";
    }
    if (minutes >= 1) {
      timeAgoString += minutes.toFixed(0) + " minute(s)";
    }

    //@dev adds amounts from the user's txn list to corresponding variable
    for (let i = 0; i < regTxs.result.length; i++) {
      if (regTxs.result[i].from === address.toLowerCase()) {
        totalSent += regTxs.result[i].value / 10 ** 18;
        totalGas +=
          (regTxs.result[i].gasUsed * regTxs.result[i].gasPrice) / 10 ** 18;
      } else {
        totalRecieved += regTxs.result[i].value / 10 ** 18;
      }
    }

    for (let i = 0; i < innerTxs.result.length; i++) {
      if (innerTxs.result[i].from === address.toLowerCase()) {
        totalSent += innerTxs.result[i].value / 10 ** 18;
        totalGas +=
          (innerTxs.result[i].gasUsed * innerTxs.result[i].gasPrice) / 10 ** 18;
      } else {
        totalRecieved += innerTxs.result[i].value / 10 ** 18;
      }
    }

    //@dev sets the hooks to their according amounts in wei -> ETH
    // setRecentAmount(
    //   mostRecentType + " " + (mostRecentAmount / 10 ** 18).toFixed(4).toString()
    // );
    setRecentDateAgo(timeAgoString);
    setSpent(((totalSent * 100) / 100).toFixed(3));
    //setRecieved(((totalRecieved * 100) / 100).toFixed(3));
    setGas(((totalGas * 100) / 100).toFixed(3));

    setSpentUSD((totalSent * ETHConversion.USD).toFixed(2).toLocaleString());
    // setRecievedUSD(
    //   (totalRecieved * ETHConversion.USD).toFixed(2).toLocaleString()
    // );
    setGasUSD((totalGas * ETHConversion.USD).toFixed(2).toLocaleString());
    setNetGainLoss(totalRecieved - totalSent);
    setNetGainLossUSD((totalRecieved - totalSent) * ETHConversion.USD);

    setRecievedIncome(
      ((((totalRecieved - totalSent) * ETHConversion.USD) / 60000) * 100)
        .toFixed(2)
        .toString()
    );
    setEtherscanLink("https://etherscan.io/tx/" + regTxs.result[0].hash);

    //@dev fetch user's transactions
    const nftTxs = await fetch(
      "https://api.etherscan.io/api?module=account&action=tokennfttx&address=" +
        address +
        "&startblock=0&endblock=99999999&page=1&offset=10000&sort=asc&apikey=" +
        process.env.REACT_APP_ETHERSCAN_APIKEY
    )
      .then((response) => response.json())
      .then((response) => {
        return response;
      })
      .catch((err) => console.error(err));
    //@dev variables to keep total amounts
    //@dev adds amounts to corresponding variable
    for (let i = 0; i < nftTxs.result.length; i++) {
      if (
        nftTxs.result[i].from === "0x0000000000000000000000000000000000000000"
      ) {
        ++totalMinted;
      } else if (nftTxs.result[i].to === address.toLowerCase()) {
        ++totalBought;
      }
      if (nftTxs.result[i].from === address.toLowerCase()) {
        ++totalSold;
      }
    }
    setSold(totalSold.toString());
    setBought(totalBought.toString());
    setMinted(totalMinted.toString());
    setHeld((totalBought + totalMinted - totalSold).toString());
  };

  function GoEtherscanLink() {
    window.open(etherscanLink);
  }

  function SetWallet() {
    if (
      userAddress.slice(-1).toLowerCase() === "a" ||
      userAddress.slice(-1).toLowerCase() === "b" ||
      userAddress.slice(-1).toLowerCase() === "c"
    ) {
      setWalletType(
        <div>
          <div className="flex items-center align-middle text-5xl">
            <Wolframlanguage className="w-[65px] mr-5" />
            <motion.div
              animate={{ x: 0 }}
              initial={{ x: -2000 }}
              transition={{ duration: 1, type: "spring", delay: 0.5 }}
            >
              <p>Watchdog</p>
            </motion.div>
          </div>
          <motion.div
            animate={{ x: 0 }}
            initial={{ x: -2000 }}
            transition={{ duration: 1, type: "spring", delay: 1.5 }}
          >
            <p className="mt-8 leading-relaxed">
              Watchdogs tend to be the most careful for rugs and suspicious
              organization's behavior. Taking care not to pair your wallet to
              every site, they laugh in the face of people who got scammed. "I
              told you so".
            </p>
          </motion.div>
        </div>
      );
    } else if (
      userAddress.slice(-1).toLowerCase() === "d" ||
      userAddress.slice(-1).toLowerCase() === "e" ||
      userAddress.slice(-1).toLowerCase() === "f"
    ) {
      setWalletType(
        <div>
          <div className="flex items-center align-middle text-5xl">
            <SportsFootball className="w-[65px] mr-5" />
            <p>Fumbler</p>
          </div>
          <motion.div
            animate={{ x: 0 }}
            initial={{ x: -2000 }}
            transition={{ duration: 1, type: "spring", delay: 1.5 }}
          >
            <p className="mt-8 leading-relaxed">
              People in the Fumbler class tend to sell the moment someone makes
              a negative comment about their favorite token. While others bask
              in the awe of the bull market, Fumblers are too busy diamond and
              paper handing.
            </p>
          </motion.div>
        </div>
      );
    } else if (
      userAddress.slice(-1) === "1" ||
      userAddress.slice(-1) === "2" ||
      userAddress.slice(-1) === "3"
    ) {
      setWalletType(
        <div>
          <div className="text-5xl flex items-center align-middle text-5xl">
            <GasStation className="w-[65px] mr-5" />
            <motion.div
              animate={{ x: 0 }}
              initial={{ x: -2000 }}
              transition={{ duration: 1, type: "spring", delay: 0.5 }}
            >
              <p>Gas Guzzler</p>
            </motion.div>
          </div>
          <motion.div
            animate={{ x: 0 }}
            initial={{ x: -2000 }}
            transition={{ duration: 1, type: "spring", delay: 1.5 }}
          >
            <p className="mt-8 leading-relaxed">
              Gas Guzzler will always tend to spend the maximum amount of gas
              per transaction. You spend all of your eth when gas is at an all
              time high. It doesn't matter if you are sending 0.0001 ETH to a
              buddy, you will still spend that 0.5 ETH transaction fee and speed
              up the transaction to burn that cash.
            </p>
          </motion.div>
        </div>
      );
    } else if (
      userAddress.slice(-1) === "4" ||
      userAddress.slice(-1) === "5" ||
      userAddress.slice(-1) === "6"
    ) {
      setWalletType(
        <div>
          <div className="flex items-center align-middle">
            <Smart className="w-[65px] mr-5 text-5xl" />
            <p>Bullish</p>
          </div>
          <motion.div
            animate={{ x: 0 }}
            initial={{ x: -2000 }}
            transition={{ duration: 1, type: "spring", delay: 1.5 }}
          >
            <p className="mt-8 leading-relaxed">
              Those who are bullish join every community to spread the word of
              the great bull run. Dips mean projects are due for mooning and
              bear markets are just upside down bull markets. They are betting
              on every asset of theirs to boom to pump their own bags.
            </p>
          </motion.div>
        </div>
      );
    } else if (
      userAddress.slice(-1) === "7" ||
      userAddress.slice(-1) === "8" ||
      userAddress.slice(-1) === "9" ||
      userAddress.slice(-1) === "0"
    ) {
      setWalletType(
        <div>
          <div className="flex items-center align-middle text-5xl">
            <Money className="w-[65px] mr-5" />
            <p>Grinder</p>
          </div>
          <motion.div
            animate={{ x: 0 }}
            initial={{ x: -2000 }}
            transition={{ duration: 1, type: "spring", delay: 1.5 }}
          >
            <p className="mt-8 leading-relaxed">
              Members of the Grinders join every discord that you are linked to,
              just in case theres a giveaway. Retweeting and reacting to Discord
              giveaways have become your dayjob, though you have yet to figure
              out if whether or not they are rigged.
            </p>
          </motion.div>
        </div>
      );
    }
  }

  function GainLoss() {
    if (netGainLoss <= 0) {
      return (
        <div>
          <p>
            In terms of net gains/losses, you have spent about
            <span className="text-red-300">
              {" "}
              {Math.abs(parseInt(netGainLoss.toFixed(3)))} ETH{" "}
            </span>
            more than you have gotten back.
          </p>
          <p className="mt-12">
            Well, lets hope you have a vault and/or what you're holding stays in
            the green!
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <p>
            Luckily, you have gained about
            <span className="text-green-300">
              {" "}
              {netGainLoss.toFixed(3)} ETH / ${netGainLossUSD.toFixed(2)}{" "}
            </span>
            in net profit!
          </p>
          <p className="mt-12">
            Thats about{" "}
            <span className="font-bold text-4xl">{recievedIncome}% </span>
            of the average American's salary in net profits without taking into
            account your held assets!
          </p>
        </div>
      );
    }
  }

  return (
    <div>
      <div
        className="h-full text-white monoSpace justify-center
              drop-shadow-2xl mt-15 flex flex-col md:flex-row align-middle lg:text-lg text-md"
      >
        <div
          className="h-full
            drop-shadow-2xl font-thin pt-20 justify-center p-4"
        >
          <div className="bg-[#2323237e] w-full lg:w-[1200px] h-full rounded-md flex md:flex-row flex-col md:space-x-[6rem] p-5 mx-auto">
            <div className="flex flex-col">
              <div className="justify-center">
                <h1 className="mb-3 ">Your Wallet Identity:</h1>
              </div>
              {walletType}
              <div className="space-y-[5rem] leading-relaxed flex flex-col">
                <div className="flex">
                  <div className="leading-relaxed flex flex-col space-y-20 mt-12">
                    <div>
                      <p>
                        In total, you have spent/sent{" "}
                        <span className="text-red-400">
                          {" "}
                          {spent} ETH / ${spentUSD}
                        </span>{" "}
                        and used a total of
                        <span className="text-red-400">
                          {" "}
                          {gas} ETH / ${gasUSD}
                        </span>{" "}
                        on gas fees, <b>ouch!</b>
                      </p>
                    </div>
                    <GainLoss />
                  </div>
                </div>
                <div>
                  <p>
                    In terms of NFTs, you have minted{" "}
                    <span className="text-purple-400 text-4xl">{minted}</span>,
                    bought/recieved{" "}
                    <span className="text-yellow-400 text-4xl">{bought}</span>,
                    and sold{" "}
                    <span className="text-pink-400 text-4xl">{sold}</span>.
                  </p>
                </div>
                <div>
                  <p>
                    At the moment, you hold{" "}
                    <span className="text-green-400 text-4xl">{held}</span>!
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-20 justify-center flex flex-col mx-auto">
              <div className="mx-auto justify-center flex flex-col">
                <motion.div
                  className="mx-auto justify-center"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, type: "spring" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={GoEtherscanLink}
                    className="mx-auto justify-center"
                  >
                    <History className="w-[20rem] mx-auto" />
                  </motion.button>
                </motion.div>
                <div className="text-center mt-5">
                  <h1 className="text-xl mb-2">Most recent transaction</h1>
                  <p>
                    {recentDateAgo} ago, you{" "}
                    <span className="text-orange-200">{recentType}</span> a
                    transaction.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-center">
                  If you are getting no results, try refreshing as the API is
                  rate-limited.
                </p>
              </div>
              <p className="text-center">
                Have feedback? Submit an Issue or PR on{" "}
                <a
                  target="_blank"
                  href="https://github.com/Haruxe/WalletWrapped"
                  className="text-blue-400"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Stats;
