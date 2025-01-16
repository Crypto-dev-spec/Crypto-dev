import { type GetBalanceReturnType } from '@wagmi/core';
import { formatUnits } from 'viem';

export const formatBalance = (data?: GetBalanceReturnType) => {
  if (!data || !('value' in data)) {
    return '-';
  }

  return `${formatUnits(data.value, data.decimals)} ETH`;
};

export const formatAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);
