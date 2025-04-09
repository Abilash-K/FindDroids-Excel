import React, { useState, useEffect } from 'react';
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
  schedule: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#e9ecef',
    color: '#495057',
    textTransform: 'capitalize' as const,
  }
};

const VendorList: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: '', payment_schedule: 'weekly' });
  
  const { vendors, loading, error, fetchVendors, createVendor } = useVendorStore();

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddVendor = async () => {
    const success = await createVendor(newVendor.name, newVendor.payment_schedule);
    if (success) {
      setOpenDialog(false);
      setNewVendor({ name: '', payment_schedule: 'weekly' });
    }
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
          Add New Vendor
        </button>
      </div>

      {loading ? (
        <div style={styles.spinner}>Loading...</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Vendor Name</th>
              <th style={styles.tableHeader}>Payment Schedule</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <div style={{ fontWeight: 500 }}>{vendor.name}</div>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.schedule}>
                    {vendor.payment_schedule}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {openDialog && (
        <>
          <div style={styles.overlay} onClick={() => setOpenDialog(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Add New Vendor</h2>
            </div>
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="vendorName">Vendor Name</label>
              <input
                id="vendorName"
                type="text"
                style={styles.input}
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>
            
            <div style={styles.formField}>
              <label style={styles.label} htmlFor="schedule">Payment Schedule</label>
              <select
                id="schedule"
                style={styles.select}
                value={newVendor.payment_schedule}
                onChange={(e) => setNewVendor({ ...newVendor, payment_schedule: e.target.value })}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="on-demand">On-demand</option>
              </select>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.secondaryButton} onClick={() => setOpenDialog(false)}>
                Cancel
              </button>
              <button
                style={styles.button}
                onClick={handleAddVendor}
                disabled={!newVendor.name}
              >
                Add Vendor
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorList; 