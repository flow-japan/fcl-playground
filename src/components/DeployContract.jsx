import React, { useState } from 'react';
import * as fcl from '@onflow/fcl';
import * as t from '@onflow/types';
import {
  Button,
  Code,
  Container,
  Heading,
  Box,
  Text,
  Link,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import CodeEditor from './CodeEditor';
import JsonViewer from './JsonViewer';

const deployTransaction = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "HelloWorld", code: code.decodeHex())
  }
}
/*
// If you want to delete the contract, run the following code in [Send Transaction] tab:
transaction {
  prepare(acct: AuthAccount) {
    acct.contracts.remove(name: "HelloWorld")
  }
}
*/
`;

const simpleContract = `\
pub contract HelloWorld {
  pub let greeting: String
  pub event HelloEvent(message: String)

  init() {
    self.greeting = "Hello, World!"
  }

  pub fun hello(message: String): String {
    emit HelloEvent(message: message)
    return self.greeting
  }
}
`;

const DeployContract = () => {
  const [status, setStatus] = useState('Not started');
  const [transactionId, setTransactionId] = useState('');
  const [transactionResult, setTransactionResult] = useState();
  const [, setContractName] = useState('HelloWorld');
  const [transaction, setTransaction] = useState(deployTransaction);

  const updateContractName = (contractName) => {
    setContractName(contractName);
    const string = `\
transaction(code: String) {
  prepare(acct: AuthAccount) {
    acct.contracts.add(name: "${contractName}", code: code.decodeHex())
  }
}
`;
    setTransaction(string);
  };

  const [contract, setContract] = useState(simpleContract);
  const updateContract = (value) => {
    setContract(value);
    const regexResult = value.match(/pub\s+contract\s+(.+?)\s*?[:{]/);
    if (!regexResult) {
      return;
    }
    const contractName = regexResult.length >= 1 ? regexResult[1] : '';
    updateContractName(contractName);
  };

  const runTransaction = async (event) => {
    event.preventDefault();

    setStatus('Resolving...');

    const isSealed = false;
    const blockResponse = await fcl.send([fcl.getBlock(isSealed)]);
    const block = await fcl.decode(blockResponse);

    try {
      const tx = await fcl.send([
        fcl.transaction(transaction),
        fcl.args([
          fcl.arg(Buffer.from(contract, 'utf8').toString('hex'), t.String),
        ]),
        fcl.limit(999),
        fcl.proposer(fcl.currentUser().authorization),
        fcl.authorizations([fcl.currentUser().authorization]),
        fcl.payer(fcl.currentUser().authorization),
        fcl.ref(block.id),
      ]);

      setStatus('Transaction sent, waiting for confirmation');
      setTransactionId(transactionId);

      const unsub = fcl
        .tx({ transactionId: tx.transactionId })
        .subscribe((currentTransaction) => {
          setTransactionResult(currentTransaction);
          if (fcl.tx.isSealed(currentTransaction)) {
            setStatus('Transaction is Sealed');
            unsub();
          }
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus('Transaction failed');
    }
  };

  return (
    <Container m={4} maxWidth="3xl">
      <Box p={2}>
        <Heading size="lg">Deploy Contract</Heading>
      </Box>
      <Box p={2}>
        <Text size="md">Please edit the contract to be deployed.</Text>
        <CodeEditor value={contract} onChange={updateContract} />
      </Box>
      <Box p={2}>
        <Text size="md">Transaction(generated automatically)</Text>
        <JsonViewer value={transaction} height="230px" />
      </Box>
      <Box p={2}>
        <Button type="button" onClick={runTransaction}>
          Deploy Contract
        </Button>
      </Box>
      <Box p={2}>
        <Code w="100%">Status: {status}</Code>
      </Box>
      {transactionId ? (
        <Box p={2}>
          Tx Detail:&nbsp;
          <Link
            href={`https://flow-view-source.com/testnet/tx/${transactionId}`}
            isExternal
          >
            {`https://flow-view-source.com/testnet/tx/${transactionId}`}{' '}
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
      ) : null}
      <Box p={2}>
        <Heading size="md">Result:</Heading>
        <JsonViewer value={JSON.stringify(transactionResult, null, 2)} />
      </Box>
    </Container>
  );
};

export default DeployContract;
