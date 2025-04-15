
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Printer, Download, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PurchaseOrderDetail } from '@/types/purchase';

const PurchaseOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<PurchaseOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API in production
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for now
        if (id) {
          const mockOrder: PurchaseOrderDetail = {
            id,
            supplierId: '1',
            supplierName: 'Tech Supplies Inc',
            poNumber: `PO-${id.slice(-6)}`,
            poDate: '2025-04-10',
            status: 'Processing',
            items: [
              {
                itemId: '1',
                name: 'Samsung Galaxy S23',
                quantity: 20,
                unitPrice: 699.99,
                totalPrice: 13999.80,
              },
              {
                itemId: '5',
                name: 'Sony WH-1000XM5',
                quantity: 15,
                unitPrice: 299.99,
                totalPrice: 4499.85,
              }
            ],
            total: 18499.65,
            notes: 'Please deliver to main warehouse entrance',
            createdAt: '2025-04-10T14:30:00Z',
            createdBy: 'Admin User',
            supplier: {
              id: '1',
              name: 'Tech Supplies Inc',
              contactPerson: 'John Smith',
              email: 'john@techsupplies.com',
              phone: '123-456-7890',
              address: '123 Tech St, San Francisco, CA'
            },
            timeline: [
              {
                date: '2025-04-10T14:30:00Z',
                status: 'Created',
                user: 'Admin User'
              },
              {
                date: '2025-04-10T15:45:00Z',
                status: 'Sent to Supplier',
                user: 'System'
              },
              {
                date: '2025-04-11T09:15:00Z',
                status: 'Confirmed by Supplier',
                user: 'John Smith',
                notes: 'Estimated delivery on April 15'
              }
            ]
          };
          
          setOrder(mockOrder);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details');
        toast({
          title: 'Error',
          description: 'Failed to load purchase order details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, toast]);

  const handleReceiveOrder = () => {
    toast({
      title: "Items Received",
      description: "Items have been added to inventory",
    });
    
    if (order) {
      setOrder({
        ...order,
        status: 'Received'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
          </Button>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-40">
                <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                <p className="text-lg font-medium">Error loading purchase order</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Purchase Orders
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
            {order.status === 'Processing' && (
              <Button size="sm" onClick={handleReceiveOrder}>
                <CheckCircle className="mr-2 h-4 w-4" /> Receive Items
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Purchase Order: {order.poNumber}</CardTitle>
                <CardDescription>Created on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <Badge className={`${getStatusColor(order.status)} text-xs px-3 py-1 rounded-full`}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Supplier</h3>
                <p className="font-medium">{order.supplier.name}</p>
                <p>{order.supplier.contactPerson}</p>
                <p>{order.supplier.email}</p>
                <p>{order.supplier.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Shipping Address</h3>
                <p className="font-medium">Main Warehouse</p>
                <p>{order.supplier.address}</p>
              </div>
            </div>

            <Separator className="my-6" />
            
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2 text-right">Quantity</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-medium">${item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium">Total</td>
                    <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {order.notes && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-muted-foreground">{order.notes}</p>
                </div>
              </>
            )}
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-4">Timeline</h3>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {event.status === 'Created' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : event.status === 'Sent to Supplier' ? (
                        <Truck className="h-5 w-5 text-blue-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.status}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">By {event.user}</p>
                      {event.notes && <p className="text-sm mt-1">{event.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PurchaseOrderDetailPage;
