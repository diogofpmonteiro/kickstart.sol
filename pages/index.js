// import React, { Component } from "react";
import { useEffect, useState } from "react";
import factory from "./../ethereum/factory";

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const getCampaignList = async () => {
      const campaignsList = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(campaignsList);
    };
    getCampaignList();
  }, []);

  //   console.log("campaigns list -", campaigns);
  return (
    <>
      <div>Home</div>
      <div>
        <div>Campaigns list: </div>
        {campaigns.length > 0 &&
          campaigns.map((eachCampaign) => {
            return eachCampaign;
          })}
      </div>
    </>
  );
};

export default HomePage;
