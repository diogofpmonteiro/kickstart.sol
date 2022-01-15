import { useEffect, useState } from "react";
import factory from "./../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";
import { Link } from "../routes";

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const getCampaignList = async () => {
      const campaignsList = await factory.methods.getDeployedCampaigns().call();
      setCampaigns(campaignsList);
    };
    getCampaignList();
  }, []);

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Open Campaigns</h3>
      <Link route='/campaigns/new'>
        <Button floated='right' content='Create Campaign' icon='add circle' secondary />
      </Link>
      <div>{renderCampaigns()}</div>
    </Layout>
  );
};

export default HomePage;
