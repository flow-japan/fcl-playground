import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import * as fcl from '@onflow/fcl';
import { Button, Container, Box, Heading } from '@chakra-ui/react';
import networkState from '../store';

const SignInOutButton = () => {
  const [network] = useRecoilState(networkState);
  const [user, setUser] = useState({});

  const signInOrOut = async (event) => {
    event.preventDefault();

    fcl.config({
      'accessNode.api':
        // eslint-disable-next-line no-nested-ternary
        network === 'testnet'
          ? 'https://rest-testnet.onflow.org'
          : network === 'mainnet'
          ? 'https://rest-mainnet.onflow.org'
          : 'http://localhost:8888',
      'discovery.wallet':
        // eslint-disable-next-line no-nested-ternary
        network === 'testnet'
          ? 'https://fcl-discovery.onflow.org/testnet/authn'
          : network === 'mainnet'
          ? 'https://fcl-discovery.onflow.org/authn'
          : 'http://localhost:3001/testnet/authn',
      'app.detail.title': 'FCL Playground',
      'app.detail.icon':
        'https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cd5704b1c939_favicon.png',
    });

    if (user && user.loggedIn) {
      fcl.unauthenticate();
    } else {
      await fcl.authenticate();
      fcl.currentUser().subscribe((currentUser) => setUser({ ...currentUser }));
    }
  };

  return (
    <Button onClick={signInOrOut}>
      {user && user.loggedIn ? 'Sign Out' : 'Sign In / Up'}
    </Button>
  );
};

const Authenticate = () => {
  return (
    <Container m={4}>
      <Box p={2}>
        <Heading size="lg">Sign In/Out</Heading>
      </Box>
      <Box p={2}>
        <SignInOutButton />
      </Box>
    </Container>
  );
};

export default Authenticate;
