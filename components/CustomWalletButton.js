import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const CustomWalletButton = () => {
  const { wallet, publicKey, connecting } = useWallet();

  const truncateAddress = (address) => {
    if (!address) return '';
    const middle = Math.floor(address.length / 2);
    const length = 4;
    return `${address.slice(0, length)}...${address.slice(
      middle - length / 2,
      middle + length / 2
    )}...${address.slice(-length)}`;
  };

  const buttonText = () => {
    if (connecting) return 'Connecting...';
    if (!wallet) return 'Access GameCrafter v2';
    if (publicKey) return truncateAddress(publicKey.toString());
    return 'Access GameCrafter v2';
  };

  return (
    <WalletMultiButton className="connect-wallet-button">
      {buttonText()}
    </WalletMultiButton>
  );
};

export default CustomWalletButton;
