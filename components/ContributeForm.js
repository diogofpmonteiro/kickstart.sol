import "semantic-ui-css/semantic.min.css";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { useState } from "react";
import Campaign from "./../ethereum/campaign";
import web3 from "../ethereum/web3";

const ContributeForm = ({ address }) => {
  const [contributionValue, setContributionValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const campaign = Campaign(address);

    setIsLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(contributionValue, "ether"),
      });
    } catch (error) {
      setErrorMessage(error.message);
    }

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);

    setIsLoading(false);
    setContributionValue("");
  };

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            label='ether'
            labelPosition='right'
            placeholder='100'
            value={contributionValue}
            onChange={(event) => setContributionValue(event.target.value)}
          />
        </Form.Field>

        {errorMessage && (
          <Message negative>
            <Message.Header>Sorry, something went wrong.</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}

        <Button loading={isLoading} disabled={isLoading} secondary>
          Contribute
        </Button>

        {isLoading && <p>Please wait until the transaction finishes executing.</p>}
      </Form>
    </>
  );
};

export default ContributeForm;
