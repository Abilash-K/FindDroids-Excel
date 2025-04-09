import React, { useState, useEffect } from 'react';
import { usePaymentStore } from '../../store/paymentStore';
import { useVendorStore } from '../../store/vendorStore';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: '14px',
    fontWeight: '600',
    borderBottom: '2px solid #dee2e6',
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  tableCell: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#212529',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0078d4',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#106ebe',
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#0078d4',
    border: '1px solid #0078d4',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#f0f5ff',
    },
  },
  formField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginBottom: '20px',
  },
  label: {
    fontWeight: '500',
    color: '#495057',
    fontSize: '14px',
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    width: '100%',
    fontSize: '14px',
    color: '#495057',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#0078d4',
      outline: 'none',
    },
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    width: '100%',
    fontSize: '14px',
    color: '#495057',
    transition: 'border-color 0.2s',
    '&:focus': {
      borderColor: '#0078d4',
      outline: 'none',
    },
  },
  error: {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
  modal: {
    position: 'fixed' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    width: '90%',
    maxWidth: '500px',
    zIndex: 1000,
  },
  modalHeader: {
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
    color: '#0078d4',
  },
  status: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    textTransform: 'capitalize' as const,
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusConfirmed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  actionColumn: {
    textAlign: 'right' as const,
    width: '150px',
  }
};

const PaymentSchedule: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    vendor_id: '',
    account_id: '',
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0]
  });

  const { 
    payments, 
    accounts, 
    loading: paymentLoading, 
    error: paymentError, 
    fetchPayments, 
    fetchAccounts, 
    createPayment,
    confirmPayment
  } = usePaymentStore();
  const { vendors, loading: vendorLoading, error: vendorError, fetchVendors } = useVendorStore();

  useEffect(() => {
    fetchPayments();
    fetchAccounts();
    fetchVendors();
  }, []);

  const handleAddPayment = async () => {
    const success = await createPayment({
      vendor_id: newPayment.vendor_id,
      account_id: newPayment.account_id,
      amount: newPayment.amount,
      payment_date: newPayment.payment_date
    });
    if (success) {
      // Fetch fresh data to ensure we have all relationships
      await Promise.all([
        fetchPayments(),
        fetchAccounts(),
        fetchVendors()
      ]);
      
      setOpenDialog(false);
      setNewPayment({
        vendor_id: '',
        account_id: '',
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleConfirmPayment = async (id: string) => {
    const success = await confirmPayment(id);
    if (success) {
      // Refresh data after confirming payment
      await Promise.all([
        fetchPayments(),
        fetchAccounts()
      ]);
    }
  };

  const loading = paymentLoading || vendorLoading;
  const error = paymentError || vendorError;

  const formatPaymentDisplay = (payment: any) => {
    const vendorName = payment.vendors?.name || 'Unknown Vendor';
    const accountName = payment.accounts?.name || 'Unknown Account';
    const amount = typeof payment.amount === 'number' ? `$${payment.amount.toFixed(2)}` : '$0.00';
    const date = payment.payment_date || 'No date';
    const status = payment.status || 'pending';

    return {
      primary: `${vendorName} - ${amount}`,
      secondary: `Date: ${date} | Status: ${status} | Account: ${accountName}`,
      status
    };
  };

  return (
    <div style={styles.root}>
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
      
      <div style={styles.header}>
        <button style={styles.button} onClick={() => setOpenDialog(true)}>
          Schedule New Payment
        </button>
      </div>

      {loading ? (
        <div style={styles.spinner}>Loading...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Payment Details</th>
              <th style={styles.tableHeader}>Date & Status</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const display = formatPaymentDisplay(payment);
              return (
                <tr key={payment.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    <div style={{ fontWeight: 500 }}>{display.primary}</div>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ 
                      ...styles.status, 
                      ...(display.status === 'pending' ? styles.statusPending : styles.statusConfirmed)
                    }}>
                      {display.secondary}
                    </div>
                  </td>
                  <td style={{...styles.tableCell, ...styles.actionColumn}}>
                    {display.status === 'pending' && (
                      <button 
                        style={styles.button}
                        onClick={() => handleConfirmPayment(payment.id)}
                      >
                        Confirm Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Create Payment Modal */}
      {openDialog && (
        <>
          <div style={styles.overlay} onClick={() => setOpenDialog(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Schedule New Payment</h2>
            </div>
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="vendor">Vendor</label>
              <select
                id="vendor"
                style={styles.select}
                value={newPayment.vendor_id}
                onChange={(e) => setNewPayment({ ...newPayment, vendor_id: e.target.value })}
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="account">Account</label>
              <select
                id="account"
                style={styles.select}
                value={newPayment.account_id}
                onChange={(e) => setNewPayment({ ...newPayment, account_id: e.target.value })}
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} (${account.balance})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formField}>
              <label style={styles.label} htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                style={styles.input}
                value={newPayment.amount}
                onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label} htmlFor="date">Payment Date</label>
              <input
                id="date"
                type="date"
                style={styles.input}
                value={newPayment.payment_date}
                onChange={(e) => setNewPayment({ ...newPayment, payment_date: e.target.value })}
              />
            </div>

            <div style={styles.modalActions}>
              <button style={styles.secondaryButton} onClick={() => setOpenDialog(false)}>
                Cancel
              </button>
              <button
                style={styles.button}
                onClick={handleAddPayment}
                disabled={!newPayment.vendor_id || !newPayment.account_id || !newPayment.amount || !newPayment.payment_date}
              >
                Schedule
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentSchedule; 