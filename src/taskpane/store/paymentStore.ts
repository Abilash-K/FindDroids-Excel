import { create } from 'zustand';
import { useAuth } from './authStore';
import { useVendorStore } from './vendorStore';
/* global Excel */

// Ensure Office is available
declare const Office: any;
declare const Excel: any;

export type PaymentStatus = 'pending' | 'completed' | 'cancelled';

export interface Account {
  id: string;
  name: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  vendor_id: string;
  account_id: string;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  // UI specific fields from relationships
  vendors?: {
    name: string;
  };
  accounts?: {
    name: string;
    balance?: number;
  };
}

interface CreatePaymentRequest {
  vendor_id: string;
  account_id: string;
  amount: number;
  payment_date: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    payment?: Payment & {
      accounts?: {
        id: string;
        balance: number;
      };
    };
    payments?: Payment[];
    previous_balance?: number;
    new_balance?: number;
    amount_deducted?: number;
    current_balance?: number;
    payment_amount?: number;
  };
}

interface PaymentState {
  payments: Payment[];
  accounts: Account[];
  loading: boolean;
  error: string | null;
  lastTransactionDetails: {
    previousBalance?: number;
    newBalance?: number;
    amountDeducted?: number;
    currentBalance?: number;
    paymentAmount?: number;
  } | null;
  fetchPayments: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  createPayment: (request: CreatePaymentRequest) => Promise<boolean>;
  deletePayment: (id: string) => Promise<boolean>;
  confirmPayment: (id: string) => Promise<boolean>;
  generateReport: () => Promise<{
    payments: Payment[];
    accounts: Account[];
    generated_at: string;
  } | null>;
}

const API_BASE_URL = 'https://sturdy-rampart-455614-f6.el.r.appspot.com/';

export const usePaymentStore = create<PaymentState>((set, get) => ({
  payments: [],
  accounts: [],
  loading: false,
  error: null,
  lastTransactionDetails: null,

  fetchPayments: async () => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: PaymentResponse = await response.json();
      if (data.success && data.data?.payments) {
        set({ payments: data.data.payments });
      } else {
        set({ error: data.error || data.message });
      }
    } catch (error) {
      set({ error: 'Failed to fetch payments' });
    } finally {
      set({ loading: false });
    }
  },

  fetchAccounts: async () => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        set({ accounts: data.data.accounts });
      } else {
        set({ error: data.message });
      }
    } catch (error) {
      set({ error: 'Failed to fetch accounts' });
    } finally {
      set({ loading: false });
    }
  },

  createPayment: async (request: CreatePaymentRequest) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const data: PaymentResponse = await response.json();
      if (data.success && data.data?.payment) {
        const { vendors } = useVendorStore.getState();
        const { accounts } = get();

        const vendor = vendors.find(v => v.id === request.vendor_id);
        const account = accounts.find(a => a.id === request.account_id);

        const paymentWithRelations: Payment = {
          ...data.data.payment,
          vendors: { name: vendor?.name || 'Unknown Vendor' },
          accounts: { 
            name: account?.name || 'Unknown Account',
            balance: account?.balance
          }
        };

        set((state) => ({ 
          payments: [...state.payments, paymentWithRelations]
        }));
        return true;
      }
      set({ 
        error: data.error || data.message,
        lastTransactionDetails: data.data ? {
          currentBalance: data.data.current_balance,
          paymentAmount: data.data.payment_amount
        } : null
      });
      return false;
    } catch (error) {
      set({ error: 'Failed to create payment' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  confirmPayment: async (id: string) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/${id}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: PaymentResponse = await response.json();
      if (data.success && data.data?.payment) {
        // Update the payment and store transaction details
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id ? {
              ...payment,
              ...data.data!.payment!,
              accounts: {
                ...payment.accounts,
                balance: data.data!.payment!.accounts?.balance
              }
            } : payment
          ),
          lastTransactionDetails: {
            previousBalance: data.data.previous_balance,
            newBalance: data.data.new_balance,
            amountDeducted: data.data.amount_deducted
          }
        }));
        return true;
      }
      set({ 
        error: data.error || data.message,
        lastTransactionDetails: data.data ? {
          currentBalance: data.data.current_balance,
          paymentAmount: data.data.payment_amount
        } : null
      });
      return false;
    } catch (error) {
      set({ error: 'Failed to confirm payment' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deletePayment: async (id: string) => {
    const { token } = useAuth.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data: PaymentResponse = await response.json();
      if (data.success) {
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
        }));
        return true;
      }
      set({ error: data.error || data.message });
      return false;
    } catch (error) {
      set({ error: 'Failed to delete payment' });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  generateReport: async () => {
    const { token } = useAuth.getState();
    const { vendors } = useVendorStore.getState();
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/api/report`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        set({
          payments: data.data.payments,
          accounts: data.data.accounts,
        });

        // Ensure we're in Excel context
        if (!Office || !Excel) {
          console.error('Office.js API is not loaded. Office:', Office, 'Excel:', Excel);
          throw new Error('Office.js API is not loaded');
        }

        try {
          console.log('Starting Excel report generation with Office.js version:', Office.context?.diagnostics?.version);
          
          await Excel.run(async (context) => {
            console.log('Inside Excel.run callback');
            
            // Get the current worksheet and ensure it exists
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            sheet.load("name");
            await context.sync();
            console.log('Active worksheet:', sheet.name);

            // Clear the existing content
            console.log('Clearing worksheet content...');
            const usedRange = sheet.getUsedRange();
            usedRange.clear();
            await context.sync();
            console.log('Sheet cleared');

            // Add title
            console.log('Adding title...');
            const titleRange = sheet.getRange("A1");
            titleRange.values = [["Financial Report"]];
            titleRange.format.font.bold = true;
            titleRange.format.font.size = 14;
            await context.sync();
            console.log('Title added');

            // Add Accounts section first (since it's shown in the UI first)
            console.log('Adding accounts data...');
            const accountsHeaderRange = sheet.getRange("A3");
            accountsHeaderRange.values = [["Account Status"]];
            accountsHeaderRange.format.font.bold = true;

            const accountsTableRange = sheet.getRange("A4:B" + (data.data.accounts.length + 4));
            const accountsData = [
              ["Account Name", "Balance"],
              ...data.data.accounts.map(account => [
                account.name,
                account.balance
              ])
            ];
            accountsTableRange.values = accountsData;
            accountsTableRange.format.autofitColumns();
            console.log('Accounts data added:', accountsData);

            // Format accounts header
            const accountsHeaderRow = sheet.getRange("A4:B4");
            accountsHeaderRow.format.fill.color = "#f8f9fa";
            accountsHeaderRow.format.font.bold = true;
            await context.sync();
            console.log('Accounts section completed');

            // Add Recent Payments section
            const paymentsStartRow = data.data.accounts.length + 6;
            console.log('Adding payments data starting at row', paymentsStartRow);
            
            const paymentsHeaderRange = sheet.getRange(`A${paymentsStartRow}`);
            paymentsHeaderRange.values = [["Recent Payments"]];
            paymentsHeaderRange.format.font.bold = true;

            const paymentsTableStartRow = paymentsStartRow + 1;
            const paymentsRange = sheet.getRange(`A${paymentsTableStartRow}:E${paymentsTableStartRow + data.data.payments.length}`);
            const paymentsData = [
              ["Vendor", "Account", "Amount", "Date", "Status"],
              ...data.data.payments.map(payment => [
                payment.vendors?.name || "Unknown",
                payment.accounts?.name || "Unknown",
                payment.amount,
                payment.payment_date,
                payment.status
              ])
            ];
            paymentsRange.values = paymentsData;
            paymentsRange.format.autofitColumns();
            console.log('Payments data added:', paymentsData);

            // Format payments header
            const paymentsHeaderRow = sheet.getRange(`A${paymentsTableStartRow}:E${paymentsTableStartRow}`);
            paymentsHeaderRow.format.fill.color = "#f8f9fa";
            paymentsHeaderRow.format.font.bold = true;
            await context.sync();
            console.log('Payments section completed');

            // Add timestamp at the top
            console.log('Adding timestamp...');
            const dateRange = sheet.getRange("A2");
            dateRange.values = [[`Report Generated at: ${new Date().toLocaleString()}`]];
            dateRange.format.font.italic = true;
            await context.sync();
            console.log('Timestamp added');

            console.log('Excel report generation completed successfully');
          });
        } catch (error) {
          console.error('Error writing to Excel:', error);
          if (error instanceof Error) {
            console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              name: error.name
            });
          }
          set({ error: 'Failed to generate Excel report: ' + (error as Error).message });
        }

        return {
          payments: data.data.payments,
          accounts: data.data.accounts,
          generated_at: new Date().toISOString()
        };
      }
      set({ error: data.message });
      return null;
    } catch (error) {
      set({ error: 'Failed to generate report' });
      return null;
    } finally {
      set({ loading: false });
    }
  },
})); 