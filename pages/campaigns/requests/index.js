import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import "semantic-ui-css/semantic.min.css";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import CampaignInstance from "../../../ethereum/campaign";
import { useEffect, useState } from "react";

const RequestIndex = ({ address }) => {
  const campaign = CampaignInstance(address);
  const [requestCount, setRequestCount] = useState("");
  const [requests, setRequests] = useState([]);
  const [approversCount, setApproversCount] = useState(0);

  // since in solidity we cannot return arrays of structs we need to do this workaround so we can list our requests
  useEffect(() => {
    const getRequests = async () => {
      const requestCountVar = await campaign.methods.getRequestsCount().call();
      const approversCountVar = await campaign.methods.approversCount().call();
      const requestsVar = await Promise.all(
        Array(parseInt(requestCountVar))
          // fill an array with our request results
          .fill()
          // map through the array
          .map((element, index) => {
            return campaign.methods.requests(index).call();
          })
      );
      setRequestCount(requestCountVar);
      setRequests(requestsVar);
      setApproversCount(approversCountVar);
    };
    getRequests();
  }, []);

  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return <RequestRow key={index} id={index} request={request} address={address} approversCount={approversCount} />;
    });
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}`}>
        <a>Back</a>
      </Link>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button secondary floated='right' style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount in ether</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests. </div>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};

export default RequestIndex;
