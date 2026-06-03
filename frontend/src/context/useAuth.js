import { useContext } from 'react';
import { AuthContext } from './AuthContextProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Jangan lempar error agar tidak membuat layar putih saat inisialisasi
  return context || {};
};
