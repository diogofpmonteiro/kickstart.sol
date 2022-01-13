import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const contractInstance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), "0x8B6a16b75271464A5C6eC4842f8a4107323E3F84");

export default contractInstance;
