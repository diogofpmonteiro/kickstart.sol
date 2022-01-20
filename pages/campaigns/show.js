import "semantic-ui-css/semantic.min.css";
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";
import CampaignInstance from "../../ethereum/campaign";
import { useEffect, useState } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

const CampaignShow = ({ address }) => {
  const campaignInstance = CampaignInstance(address);
  const [campaignSummary, setCampaignSummary] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getSummary = async () => {
      const response = await campaignInstance.methods.getSummary().call();

      // redefine response object and assign names to the keys
      const summary = {
        address,
        minimumContribution: response[0],
        balance: response[1],
        requestsCount: response[2],
        approversCount: response[3],
        manager: response[4],
      };
      setCampaignSummary(summary);
      setLoaded(true);
    };
    getSummary();
  }, []);

  const renderSummary = () => {
    const { balance, manager, minimumContribution, requestsCount, approversCount } = campaignSummary;

    // our card composition
    const items = [
      {
        header: manager,
        description: "Manager is the creator of the campaign",
        meta: "Address of Manager",
        style: { width: "fit-content" },
      },
      {
        header: minimumContribution,
        description: "You must contribute at least this much wei to become an approver.",
        meta: "Minimum Contribution (wei)",
        style: { width: "fit-content" },
      },
      {
        header: requestsCount,
        description: "A request tries to withdraw money from the contract. Requests must be approved by contributors.",
        meta: "Number of requests",
        style: { width: "fit-content", maxWidth: "76%" },
      },
      {
        header: approversCount,
        description: "How many contributors have donated to this campaign.",
        meta: "Number of approvers",
        style: { width: "fit-content" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        description: "Amount of money this campaign has left to spend.",
        meta: "Campaign balance (ether)",
        style: { width: "fit-content" },
      },
    ];

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <h3>Show campaigns</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{loaded && renderSummary()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests/`}>
              <a>
                <Button secondary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};

export default CampaignShow;
