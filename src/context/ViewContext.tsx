import React, { createContext, useContext, useState } from 'react';

export type TabType = 'basic' | 'farm' | 'heifer' | 'sequestration' | 'effectiveness' | 'scenarios' | 'financing';

interface ViewContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basic');

  return (
    <ViewContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};