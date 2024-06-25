import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function checkTokenBalance(walletAddress, tokenAddress) {
  const connection = new Connection(
    'https://small-cosmological-sky.solana-mainnet.quiknode.pro/80c5ecd2dc468492c00dd64b4a307cfc3225cfde/',
    'confirmed'
  );
  const walletPublicKey = new PublicKey(walletAddress);
  const tokenPublicKey = new PublicKey(tokenAddress);

  try {
    console.log(`Checking balance for wallet: ${walletAddress}`);
    console.log(`Token address: ${tokenAddress}`);

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    console.log(`Found ${tokenAccounts.value.length} token accounts`);

    let foundMatch = false;
    tokenAccounts.value.forEach((accountInfo, index) => {
      const mintAddress = accountInfo.account.data.parsed.info.mint;
      const balance = accountInfo.account.data.parsed.info.tokenAmount.uiAmount;
      console.log(`Account ${index}:`);
      console.log(`  Mint: ${mintAddress}`);
      console.log(`  Balance: ${balance}`);

      if (mintAddress === tokenAddress) {
        console.log(`  MATCH FOUND!`);
        foundMatch = true;
      }
    });

    if (foundMatch) {
      const matchingAccount = tokenAccounts.value.find(
        (accountInfo) =>
          accountInfo.account.data.parsed.info.mint === tokenAddress
      );
      const balance =
        matchingAccount.account.data.parsed.info.tokenAmount.uiAmount;
      console.log(`Token balance: ${balance}`);
      return balance;
    } else {
      console.log(
        'No matching token account found. Balance is assumed to be 0.'
      );
      return 0;
    }
  } catch (error) {
    console.error('Error checking token balance:', error);
    throw error;
  }
}
