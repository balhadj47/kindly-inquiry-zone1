
import { createContext } from 'react';
import type { RBACContextType } from './types';

export const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const createRBACContext = () => {
  return { RBACContext };
};
