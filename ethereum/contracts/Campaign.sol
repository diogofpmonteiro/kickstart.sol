pragma solidity ^0.4.17;

contract CampaignFactory {
    // address list of all deployed campaigns
    address[] public deployedCampaigns;

    
    // the uint is the minimum contribution 
    function createCampaign(uint minimum) public {
         // deploys a new instance of a Campaign contract with the minimum contribution
        address newCampaign = new Campaign(minimum, msg.sender);
        // store the resulting address in the deployed campaigns list
        deployedCampaigns.push(newCampaign);
    }


    // view function that returns all of the deployed campaigns
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

// create campaign contract
contract Campaign {
    // our request struct represents our campaigns
    // type of field - field name
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        // this uint keeps track of the "yes" votes since the "no" votes do not matter to us
        uint approvalCount;
        // keep track if someone has voted on a given request
        mapping(address => bool) approvals;
    }

    // declare our state variables
    // our struct variable as a requests array/list, each request has our struct structure
    Request[] public requests;
    // manager address variable
    address public manager;
    // minimum contribution variable
    uint public minimumContribution;
    // "approvers" variable as mapping 
    // we will use mappings because they a WAY MORE EFFICIENT data structure then arrays
    // because in smart contracts when we need to iterate over an array, the gas cost will always increase
    // arrays use a linear time search meaning that the size of the array dictates how long the search will take
    // mappings use a constant time search meaning that no matter how many pieces of data inside the mapping, it will always take the same amount of time to search
    // this mapping is a type boolean so we can get a true or false value when comparing if a certain address exists inside 
    // mapping(type of key we want to store => type of value when retrieving the key)
    // a mapping is solely a look up object, it cannot be iterated through
    mapping(address => bool) public approvers;
    uint public approversCount;


    // create restriction modifier to lock down access to certain functions
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // Campaign contract constructor that contains the creator address and minimum contribution
    constructor(uint minimum, address creator) public {
        // set manager as the creator of the contract
        manager = creator;
        // minimum amount of money required for a contribution
        minimumContribution = minimum;
    }

    // payable makes this function able to receive some amount of money
    function contribute() public payable {
        // require the min. contribution
        require(msg.value > minimumContribution);

        // add msg.sender address as a key to approvers mapping
        // only the value "true" is stored in the mapping, there is no record of the address
        // however if we try to look the address up, it would map it to the value "true"
        approvers[msg.sender] = true;
        approversCount++;
    }


    // public because it should be called by an external account but restricted
    function createRequest(string description, uint value, address recipient) public restricted {
        // take arguments and create new request with Request({...arguments})
        // memory keyword means 
        Request memory newRequest = Request({
            // here we initialize the values of the struct
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
           // we only need to initialize value types 
           // we don't need to initialize reference types like mappings
        });

        /* 
        Alternative syntax to declare structs basically only providing values instead of field-values pair
        Advice is not to use this version
        Request (description, value, recipient, false) 
        However if the order changes in the struct definition, it will throw an error 
        */

        // add new request to requests array
        requests.push(newRequest);
    }

    // our uint argument is the index of the request we want to approve
    function approveRequest(uint index) public {
        // assign request state variable to a storage local variable
        Request storage request = requests[index];

        // check if this person is a contributor
        require(approvers[msg.sender]);
        // check if this person has NOT voted on this specific request yet
        require(!request.approvals[msg.sender]);

        
        // add this person's address to the approvals mapping, meaning it is now a contributor
        request.approvals[msg.sender] = true;
        // increment approval count
        request.approvalCount++;
    }

    // public so the manager can see it but restricted so only the manager can call it
    function finalizeRequest(uint index) public restricted {
        // assign request state variable to a storage local variable so we can edit it
        // remember to write Request with capital R to reference the struct
        Request storage request = requests[index];

        // make sure more than 50% of the contributors are approvers, meaning they voted "yes"
        require(request.approvalCount > (approversCount / 2));
        
        // make sure the request hasn't been finalized
        require(!request.complete);

        // send the money to the designed request to the specific recipient
        // using the struct key and method recipient.transfer(amount of money to send)
        request.recipient.transfer(request.value);
        // finalize the request 
        request.complete = true;
    }

    // get general information for a certain campaign
    function getSummary() public view  returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount, 
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}