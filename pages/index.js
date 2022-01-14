import { useEffect, useState } from "react";
import factory from "./../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const getCampaignList = async () => {
      const campaignsList = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(campaignsList);
    };
    getCampaignList();
  }, []);
  // console.log("campaigns list -", campaigns);

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true,
      };
    });
    // console.log(items);
    return <Card.Group items={items} />;
  };

  return (
    <div className='main-container'>
      <Layout>
        <h3>Open Campaigns</h3>
        <Button floated='right' content='Create Campaign' icon='add circle' secondary />
        <div>{renderCampaigns()}</div>
      </Layout>
    </div>
  );
};

export default HomePage;
