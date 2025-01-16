import { Alert, AlertTitle, Box, Snackbar } from '@mui/material';
import { type ConnectErrorType } from '@wagmi/core';
import { ComponentProps, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';

const formatAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);

const Button = ({ sx, ...props }: ComponentProps<typeof Box> & { href?: string; target?: string }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        color: 'white',
        textDecoration: 'none',
        textTransform: 'uppercase',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 0, lg: 3 },
        mb: { xs: 3, lg: 0 },
        fontSize: '24px',
        lineHeight: '6px',
        width: '324px',
        height: '45px',
        borderRadius: '6px',
        backgroundColor: '#00dbe3',
        outline: 'none',
        borderWidth: 0,
        borderStyle: 'none',
        ...sx,
      }}
      {...props}
    />
  );
};

export const WalletButton = () => {
  const [error, setError] = useState<ConnectErrorType | null>(null);
  const account = useAccount();
  const connect = useConnect();

  const metamaskConnector = connect.connectors.find((connector) => connector.name === 'MetaMask');

  const renderButton = () => {
    if (!metamaskConnector) {
      // Adding as a fallback, but the connector itself should always be present
      return (
        <Button component="a" href="https://metamask.io/download/" target="_blank" rel="noreferrer noopener">
          Install MetaMask
        </Button>
      );
    }

    if (account.status === 'disconnected') {
      const handleConnect = async () => {
        try {
          await metamaskConnector.connect();
        } catch (error) {
          console.error(error);
          setError(error as ConnectErrorType);
        }
      };

      return (
        <Button component="button" sx={{ cursor: 'pointer' }} onClick={handleConnect}>
          Connect Wallet
        </Button>
      );
    }

    if (account.status === 'connecting' || account.status === 'reconnecting') {
      return <Button>Connecting...</Button>;
    }

    return <Button>{formatAddress(account.address)}</Button>;
  };

  return (
    <>
      {renderButton()}

      <Snackbar open={!!error} onClose={() => setError(null)} autoHideDuration={5000}>
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          <AlertTitle>Error while connecting the wallet</AlertTitle>

          {error?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
