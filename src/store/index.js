import { atom } from 'recoil';

const networkState = atom({
  key: 'network',
  default: 'testnet',
});

export default networkState;
