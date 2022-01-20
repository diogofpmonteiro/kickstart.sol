import Layout from "../../../components/Layout";
import "semantic-ui-css/semantic.min.css";
import { Button } from "semantic-ui-react";
import { Link } from "../../../routes";

const RequestIndex = ({ address }) => {
  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button secondary>Add Request</Button>
        </a>
      </Link>
      <Link route={`/campaigns/${address}`}>
        <a>
          <Button secondary>Campaign Page</Button>
        </a>
      </Link>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};

export default RequestIndex;
