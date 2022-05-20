import React from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import GetAccount from './GetAccount';
import Script from './Script';
import Authenticate from './Authenticate';
import UserInfo from './UserInfo';
import SendTransaction from './SendTransaction';
import DeployContract from './DeployContract';
import networkState from '../store';

const Home = () => {
  const [, setNetwork] = useRecoilState(networkState);

  return (
    <Box p={4}>
      <Tabs variant="soft-rounded" colorScheme="gray" mb={4} size="sm">
        <TabList>
          <Tab
            onClick={() => {
              setNetwork('testnet');
            }}
          >
            Testnet
          </Tab>
          <Tab
            onClick={() => {
              setNetwork('mainnet');
            }}
          >
            Mainnet
          </Tab>
          <Tab
            onClick={() => {
              setNetwork('emulator');
            }}
          >
            Emulator
          </Tab>
        </TabList>
      </Tabs>
      <Tabs variant="enclosed" mb={4}>
        <TabList>
          <Tab>Authenticate</Tab>
          <Tab>Get Account Info</Tab>
          <Tab>Run Script</Tab>
          <Tab>Send Transaction</Tab>
          <Tab>Deploy Contract</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Authenticate />
            <UserInfo />
          </TabPanel>
          <TabPanel>
            <GetAccount />
          </TabPanel>
          <TabPanel>
            <Script />
          </TabPanel>
          <TabPanel>
            <SendTransaction />
          </TabPanel>
          <TabPanel>
            <DeployContract />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Home;
