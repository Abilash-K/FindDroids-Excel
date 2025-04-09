import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { usePaymentStore } from '../../store/paymentStore';
import type { Payment, Account } from '../../store/paymentStore';

type Report = {
  payments: Payment[];
  accounts: Account[];
  generated_at: string;
};

const AccountReport: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const { generateReport } = usePaymentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateReport();
      if (result) {
        setReport(result);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleGenerateReport}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Current Report'}
      </Button>
      
      {error && (
        <div style={{ color: '#dc3545', marginTop: '10px' }}>
          {error}
        </div>
      )}
      
      {report && (
        <div style={{ marginTop: '20px' }}>
          <h3>Report Generated at: {new Date(report.generated_at).toLocaleString()}</h3>
          
          <h4>Account Status</h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Name</TableCell>
                  <TableCell align="right">Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.name}</TableCell>
                    <TableCell align="right">${account.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <h4>Recent Payments</h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.vendors?.name || 'Unknown'}</TableCell>
                    <TableCell>{payment.accounts?.name || 'Unknown'}</TableCell>
                    <TableCell align="right">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.payment_date}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default AccountReport; 