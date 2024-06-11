import { useState } from 'react';

export default function useDisclosureWithData(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const open = (address: any) => {
    if (!isOpen) {
      setSelectedAddress(address);
      setIsOpen(true);
    }
  };

  const close = () => {
    if (isOpen) {
      setSelectedAddress(null);
      setIsOpen(false);
    }
  };

  const toggle = (address: any) => {
    if (isOpen) {
      close();
    } else {
      open(address);
    }
  };

  return [isOpen, selectedAddress, { open, close, toggle }] as const;
}
