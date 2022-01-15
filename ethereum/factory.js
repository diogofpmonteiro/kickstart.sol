import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const contractInstance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), "0xE7aB5Fb869c52aF98ae9D9EB61c8A3DfA8876EEf");

export default contractInstance;
