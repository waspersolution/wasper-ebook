
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Banknote, CreditCard, Smartphone, Receipt } from 'lucide-react';
import { Customer, Payment } from './Types';

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPaymentMethod: Payment['method'];
  currentPaymentAmount: number;
  onPaymentMethodChange: (value: Payment['method']) => void;
  onPaymentAmountChange: (amount: number) => void;
  onAddPayment: () => void;
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customerId: string) => void;
  remainingAmount: number;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  currentPaymentMethod,
  currentPaymentAmount,
  onPaymentMethodChange,
  onPaymentAmountChange,
  onAddPayment,
  customers,
  selectedCustomer,
  onSelectCustomer,
  remainingAmount,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            {remainingAmount > 0 
              ? `Remaining amount: $${remainingAmount.toFixed(2)}`
              : `Total amount: $${currentPaymentAmount.toFixed(2)}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <RadioGroup
            defaultValue="cash"
            value={currentPaymentMethod}
            onValueChange={(value) => onPaymentMethodChange(value as Payment['method'])}
            className="grid grid-cols-1 gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" /> Cash
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Credit Card
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mobile_payment" id="mobile_payment" />
              <Label htmlFor="mobile_payment" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" /> Mobile Payment
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pos_terminal" id="pos_terminal" />
              <Label htmlFor="pos_terminal" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" /> POS Terminal
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_account" id="credit_account" />
              <Label htmlFor="credit_account" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Credit Account
              </Label>
            </div>
          </RadioGroup>
          
          {currentPaymentMethod === 'credit_account' && (
            <div className="mt-2">
              <Label htmlFor="customer" className="mb-1 block">Select Customer:</Label>
              <Select 
                onValueChange={(value) => onSelectCustomer(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} (Limit: ${customer.credit_limit?.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="mt-2">
            <Label htmlFor="amount" className="mb-1 block">Amount:</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={currentPaymentAmount}
              onChange={(e) => onPaymentAmountChange(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onAddPayment();
              onOpenChange(false);
            }}
            disabled={currentPaymentAmount <= 0 || (currentPaymentMethod === 'credit_account' && !selectedCustomer)}
          >
            Add Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
