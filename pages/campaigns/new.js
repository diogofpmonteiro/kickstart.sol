import Layout from "../../components/Layout";
import "semantic-ui-css/semantic.min.css";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { useState } from "react";
import factory from "./../../ethereum/factory";
import web3 from "./../../ethereum/web3";
import { Router } from "../../routes";

const NewCampaign = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });

      Router.pushRoute("/");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
    setIsLoading(false);
  };

  return (
    <>
      <Layout>
        <h1>Create a Campaign</h1>

        <Form onSubmit={onFormSubmit}>
          <Form.Field>
            <label>Minimum contribution</label>
            <Input
              label='wei'
              placeholder='100'
              labelPosition='right'
              value={minimumContribution}
              onChange={(event) => setMinimumContribution(event.target.value)}
            />
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
        </Form>
      </Layout>
    </>
  );
};

export default NewCampaign;
