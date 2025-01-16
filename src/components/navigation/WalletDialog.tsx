import InfoIcon from '@mui/icons-material/Info';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useBalance, useEnsName } from 'wagmi';
import { formatAddress, formatBalance } from './utils';

const AddressDetails = ({ address }: { address: Address }) => {
  const ensName = useEnsName({
    address,
  });
  const balance = useBalance({
    address,
  });

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="td" scope="row">
        {formatAddress(address)}
      </TableCell>

      <TableCell component="td" scope="row">
        {ensName.data ?? '-'}
      </TableCell>

      <TableCell component="td" scope="row">
        {formatBalance(balance.data)}
      </TableCell>
    </TableRow>
  );
};

export const WalletDialog = () => {
  const account = useAccount();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const isOpen = open && !!account.address;

  return (
    <>
      <IconButton aria-label="close" onClick={() => setOpen(true)} sx={{ color: 'white' }}>
        <InfoIcon />
      </IconButton>

      <Dialog onClose={handleClose} aria-labelledby="wallet-dialog-title" open={isOpen}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="wallet-dialog-title">
          Connected accounts
        </DialogTitle>

        <DialogContent dividers>
          <Table sx={{ width: '100%' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Address</TableCell>
                <TableCell>ENS name</TableCell>
                <TableCell>ETH balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {account.addresses?.map((address) => <AddressDetails key={address} address={address} />)}
            </TableBody>
          </Table>
        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
