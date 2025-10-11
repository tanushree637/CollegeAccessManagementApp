import React, { createContext, useState, useContext } from 'react';

const QRContext = createContext();

export const QRProvider = ({ children }) => {
  const [qrData, setQrData] = useState({});

  const generateQR = (userId, type) => {
    const qrString = `${userId}-${type}-${Date.now()}`;
    setQrData({ ...qrData, [type]: qrString });
  };

  return (
    <QRContext.Provider value={{ qrData, generateQR }}>
      {children}
    </QRContext.Provider>
  );
};

export const useQR = () => useContext(QRContext);
