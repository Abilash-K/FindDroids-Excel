import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AuthWrapper } from './auth/AuthWrapper';
import VendorList from './vendor/VendorList';
import PaymentSchedule from './payment/PaymentSchedule';
import AccountReport from './report/AccountReport';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <AuthWrapper>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Vendors" />
              <Tab label="Payments" />
              <Tab label="Reports" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <VendorList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PaymentSchedule />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <AccountReport />
          </TabPanel>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default App;
