const path = require("path");
const solc = require("solc");
// file system module, helper to lets us access our file system
const fs = require("fs-extra");

// reference to build directory
const buildPath = path.resolve(__dirname, "build");
// delete build folder and its contents
fs.removeSync(buildPath);

// get campaign contracts reference
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf-8");
// assign contracts to output
const output = solc.compile(source, 1).contracts;

// checks to see if directory exists, if it doesn't exist, this creates it
fs.ensureDirSync(buildPath);

console.log(output);

// iterate over the keys in output (keys are Campaign and CampaignFactory - because we replaced ':')
for (let contract in output) {
  // create a json file
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    // write output in json file
    output[contract]
  );
}
