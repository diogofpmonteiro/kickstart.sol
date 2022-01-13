import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the local server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/1f9973ec86b141bc882ffffe36c855eb");
  web3 = new Web3(provider);
}

export default web3;
