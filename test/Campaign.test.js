const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

// get instance of factory contract
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
// get instance of campaign contract
const compiledCampaign = require("../ethereum/build/Campaign.json");

// list of accounts in ganache network
let accounts;
// reference to deployed instance
let factory;
let campaignAddress;
let campaign;

// execute some general setup code with beforeEach
beforeEach(async () => {
  // get list of accounts
  accounts = await web3.eth.getAccounts();

  // deploy instance of factory contract
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  // call our contracts method with 100 wei as argument to deploy contract
  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  // return all addresses for our deployed campaigns using destructuring
  // assign first element to variable
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(
    // since contract is already deployed, only need to pass interface as 1st argument
    JSON.parse(compiledCampaign.interface),
    // and pass address as 2nd argument
    campaignAddress
  );
});

// ! Tests
describe("Campaigns", () => {
  // we can make sure our contract is deployed by asserting that is has an address
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  // make sure the manager of the campaign is accounts[0]
  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  // make sure people are able to donate/contribute do campaign and check that contributor is marked as approver
  it("allows people to contribute and marks them as approvers", async () => {
    // we have a min contribution of 100 wei
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    // either true or false
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      // try to send less then minimum - 100, and if that happens land in catch block
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      // make sure the assertion fails
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      // call create request method and pass arguments
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    // get our request struct (object)
    const request = await campaign.methods.requests(0).call();
    // console.log(request);
    assert.strictEqual("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      // call create request method and pass arguments
      .createRequest("Test request", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    // string representation of balance in wei
    let balance = await web3.eth.getBalance(accounts[1]);
    // convert it to a number in ether
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    // console.log(balance);
    assert(balance > 104);
  });
});
