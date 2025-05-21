import React, { createContext, useContext, useState } from 'react';

type NotificationContextType = {
  notification: boolean;
  toggleNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notification: false,
  toggleNotification: () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setnotification] = useState(false);
  
  
  const toggleNotification = () => setnotification(!notification);

  return (
    <NotificationContext.Provider value={{ notification, toggleNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);