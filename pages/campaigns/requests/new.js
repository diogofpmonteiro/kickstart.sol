import CampaignInstance from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import { Link, Router } from "../../../routes";
import "semantic-ui-css/semantic.min.css";
import { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";

const NewRequest = ({ address }) => {
  const [requestDescription, setRequestDescription] = useState("");
  const [requestValue, setRequestValue] = useState("");
  const [requestRecipient, setRequestRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const campaign = CampaignInstance(address);

    try {
      const accounts = await web3.eth.getAccounts();
      const request = await campaign.methods
        .createRequest(requestDescription, web3.utils.toWei(requestValue, "ether"), requestRecipient)
        .send({
          from: accounts[0],
        });
      console.log(request);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 6000);
    setIsLoading(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>

      <h3>Create a Request</h3>
      <Form onSubmit={onFormSubmit}>
        <Form.Field>
          <label>Request description</label>
          <Input
            placeholder='Description goes here..'
            value={requestDescription}
            onChange={(event) => setRequestDescription(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value</label>
          <Input
            label='eth'
            placeholder='0'
            labelPosition='right'
            value={requestValue}
            onChange={(event) => setRequestValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input placeholder='0x...' value={requestRecipient} onChange={(event) => setRequestRecipient(event.target.value)} />
        </Form.Field>

        {errorMessage && (
          <Message negative>
            <Message.Header>Sorry, something went wrong.</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}

        <Button loading={isLoading} disabled={isLoading} secondary>
          Create
        </Button>
        {isLoading && <p>Please wait until the transaction finishes executing.</p>}
      </Form>
    </Layout>
  );
};

NewRequest.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};

export default NewRequest;
