"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  updateOrder, updateOrderStatus, markOrderPaid, updateFraudAnalysis,
  addOrderNote, getOrderActivity, createReturn,
} from "@/lib/order-admin-api";

interface ProductItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
  productId?: string;
}

interface ShippingDetails {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
}

interface FraudAnalysis {
  riskLevel: string;
  riskScore?: number;
  flags?: string[];
  ipAddress?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

interface OrderData {
  _id: string;
  email: string;
  userId: string;
  status: string;
  amount: number;
  paymentMethod: string;
  priority?: string;
  assignedTo?: string;
  adminNotes?: string;
  tags?: string[];
  shippingAddress?: string;
  shippingDetails?: ShippingDetails;
  fraudAnalysis?: FraudAnalysis;
  products?: ProductItem[];
  createdAt: string;
  updatedAt: string;
}

interface ActivityEntry {
  _id?: string;
  action: string;
  description: string;
  noteType?: string;
  performedBy?: string;
  performedByEmail?: string;
  createdAt: string;
}

interface ReturnEntry {
  _id: string;
  type: string;
  status: string;
  reason: string;
  refundAmount?: number;
  items?: Array<{ name: string; quantity: number }>;
  createdAt: string;
}

interface ShipmentInfo {
  id: string;
  trackingNumber?: string;
  carrier?: string;
  status: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "edit", label: "Edit Order" },
  { id: "fraud", label: "Fraud Analysis" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "notes", label: "Notes & Logs" },
];

const STATUS_OPTIONS = [
  "pending", "processing", "paid", "shipped", "delivered",
  "completed", "cancelled", "unpaid", "refunded", "partially_refunded", "on_hold",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    processing: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    paid: "bg-green-500/20 text-green-700 dark:text-green-400",
    shipped: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
    delivered: "bg-teal-500/20 text-teal-700 dark:text-teal-400",
    completed: "bg-green-600/20 text-green-800 dark:text-green-300",
    cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
    unpaid: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
    refunded: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
    partially_refunded: "bg-purple-400/20 text-purple-600 dark:text-purple-300",
    on_hold: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
  };
  return map[status] || "bg-gray-500/20";
};

interface Props {
  order: OrderData;
  activity: ActivityEntry[];
  returns: ReturnEntry[];
  shipments: ShipmentInfo[];
}

export default function OrderDetailClient({ order: initialOrder, activity: initialActivity, returns: initialReturns, shipments }: Props) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");
  const [order, setOrder] = useState(initialOrder);
  const [activity, setActivity] = useState(initialActivity);
  const [orderReturns, setOrderReturns] = useState(initialReturns);
  const [saving, setSaving] = useState(false);

  const refreshActivity = async () => {
    try {
      const data = await getOrderActivity(order._id);
      setActivity(data);
    } catch { /* ignore */ }
  };

  // ─── Overview Tab ───────────────────────────────────────────
  const OverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Order Summary */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Summary</CardTitle>
            <span className={cn("px-3 py-1 rounded-full text-sm font-medium", statusColor(order.status))}>
              {order.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order ID</span>
              <p className="font-mono">{order._id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount</span>
              <p className="text-lg font-semibold">{formatCurrency(order.amount)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Method</span>
              <p>{order.paymentMethod === "cod" ? "Pay on Delivery" : "Card"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Priority</span>
              <p className="capitalize">{order.priority || "normal"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Created</span>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated</span>
              <p>{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Status Change */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Quick Actions</Label>
            <div className="flex flex-wrap gap-2">
              {order.status !== "paid" && (
                <Button size="sm" variant="outline" onClick={async () => {
                  try {
                    const updated = await markOrderPaid(order._id);
                    setOrder(updated);
                    toast.success("Order marked as paid");
                    refreshActivity();
                  } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
                }}>
                  Mark as Paid
                </Button>
              )}
              {!["delivered", "completed"].includes(order.status) && (
                <Button size="sm" variant="outline" onClick={async () => {
                  try {
                    const updated = await updateOrderStatus(order._id, "delivered");
                    setOrder(updated);
                    toast.success("Order marked as delivered");
                    refreshActivity();
                  } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
                }}>
                  Mark as Delivered
                </Button>
              )}
              {order.status !== "cancelled" && (
                <Button size="sm" variant="destructive" onClick={async () => {
                  try {
                    const updated = await updateOrderStatus(order._id, "cancelled", "Admin cancelled");
                    setOrder(updated);
                    toast.success("Order cancelled");
                    refreshActivity();
                  } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
                }}>
                  Cancel Order
                </Button>
              )}
              {order.status !== "on_hold" && (
                <Button size="sm" variant="secondary" onClick={async () => {
                  try {
                    const updated = await updateOrderStatus(order._id, "on_hold");
                    setOrder(updated);
                    toast.success("Order put on hold");
                    refreshActivity();
                  } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
                }}>
                  Put On Hold
                </Button>
              )}
            </div>
          </div>

          {/* Tags */}
          {order.tags && order.tags.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-1">
                {order.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Info */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Name</span>
              <p>{order.shippingDetails?.fullName || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email</span>
              <p>{order.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p>{order.shippingDetails?.phone || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">User ID</span>
              <p className="font-mono text-xs">{order.userId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{order.shippingDetails?.address || order.shippingAddress}</p>
            <p>{order.shippingDetails?.city}{order.shippingDetails?.state ? `, ${order.shippingDetails.state}` : ""}</p>
          </CardContent>
        </Card>

        {/* Fraud Quick View */}
        {order.fraudAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fraud Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "px-3 py-2 rounded text-sm font-medium text-center",
                order.fraudAnalysis.riskLevel === "low" && "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
                order.fraudAnalysis.riskLevel === "medium" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400",
                order.fraudAnalysis.riskLevel === "high" && "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
                order.fraudAnalysis.riskLevel === "critical" && "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
              )}>
                {order.fraudAnalysis.riskLevel?.toUpperCase()} RISK
                {order.fraudAnalysis.riskScore ? ` (Score: ${order.fraudAnalysis.riskScore})` : ""}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Products Table */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products?.map((product: ProductItem, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{product.sku || "—"}</TableCell>
                  <TableCell className="text-center">{product.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price * product.quantity)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-semibold">Order Total</TableCell>
                <TableCell className="text-right font-bold text-lg">{formatCurrency(order.amount)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ─── Edit Tab ───────────────────────────────────────────────
  const EditTab = () => {
    const [editData, setEditData] = useState({
      status: order.status,
      email: order.email,
      amount: order.amount,
      paymentMethod: order.paymentMethod || "card",
      priority: order.priority || "normal",
      assignedTo: order.assignedTo || "",
      adminNotes: order.adminNotes || "",
      tags: (order.tags || []).join(", "),
      shippingAddress: order.shippingAddress || "",
      fullName: order.shippingDetails?.fullName || "",
      phone: order.shippingDetails?.phone || "",
      address: order.shippingDetails?.address || "",
      city: order.shippingDetails?.city || "",
      state: order.shippingDetails?.state || "",
    });

    const handleSave = async () => {
      setSaving(true);
      try {
        const updated = await updateOrder(order._id, {
          status: editData.status,
          email: editData.email,
          amount: Number(editData.amount),
          paymentMethod: editData.paymentMethod,
          priority: editData.priority,
          assignedTo: editData.assignedTo || undefined,
          adminNotes: editData.adminNotes || undefined,
          tags: editData.tags ? editData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          shippingAddress: editData.shippingAddress,
          shippingDetails: {
            fullName: editData.fullName,
            phone: editData.phone,
            address: editData.address,
            city: editData.city,
            state: editData.state,
          },
        });
        setOrder(updated);
        toast.success("Order updated successfully");
        refreshActivity();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Edit order information and customer details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={editData.status} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              </div>
              <div>
                <Label>Amount (cents)</Label>
                <Input type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Select value={editData.paymentMethod} onValueChange={(v) => setEditData({ ...editData, paymentMethod: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cod">Pay on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={editData.priority} onValueChange={(v) => setEditData({ ...editData, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input value={editData.assignedTo} onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })} placeholder="Admin user ID or name" />
              </div>
              <div className="md:col-span-2">
                <Label>Tags (comma separated)</Label>
                <Input value={editData.tags} onChange={(e) => setEditData({ ...editData, tags: e.target.value })} placeholder="vip, priority, review-needed" />
              </div>
              <div className="md:col-span-2">
                <Label>Admin Notes</Label>
                <Textarea value={editData.adminNotes} onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })} rows={3} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={editData.fullName} onChange={(e) => setEditData({ ...editData, fullName: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={editData.city} onChange={(e) => setEditData({ ...editData, city: e.target.value })} />
              </div>
              <div>
                <Label>State</Label>
                <Input value={editData.state} onChange={(e) => setEditData({ ...editData, state: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Shipping Address (Legacy)</Label>
                <Input value={editData.shippingAddress} onChange={(e) => setEditData({ ...editData, shippingAddress: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  };

  // ─── Fraud Tab ──────────────────────────────────────────────
  const FraudTab = () => {
    const [fraudData, setFraudData] = useState({
      riskLevel: order.fraudAnalysis?.riskLevel || "low",
      riskScore: order.fraudAnalysis?.riskScore || 0,
      flags: (order.fraudAnalysis?.flags || []).join(", "),
      ipAddress: order.fraudAnalysis?.ipAddress || "",
      notes: order.fraudAnalysis?.notes || "",
    });

    const handleSaveFraud = async () => {
      setSaving(true);
      try {
        const updated = await updateFraudAnalysis(order._id, {
          riskLevel: fraudData.riskLevel,
          riskScore: Number(fraudData.riskScore),
          flags: fraudData.flags ? fraudData.flags.split(",").map((f: string) => f.trim()).filter(Boolean) : [],
          ipAddress: fraudData.ipAddress,
          notes: fraudData.notes,
        });
        setOrder(updated);
        toast.success("Fraud analysis updated");
        refreshActivity();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Analysis</CardTitle>
            <CardDescription>Review and update fraud risk assessment for this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Level Display */}
              <div className="md:col-span-2">
                <div className={cn(
                  "p-6 rounded-lg text-center",
                  fraudData.riskLevel === "low" && "bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800",
                  fraudData.riskLevel === "medium" && "bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800",
                  fraudData.riskLevel === "high" && "bg-orange-50 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-800",
                  fraudData.riskLevel === "critical" && "bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-800",
                )}>
                  <p className="text-sm text-muted-foreground mb-1">Current Risk Level</p>
                  <p className="text-3xl font-bold uppercase">{fraudData.riskLevel}</p>
                  <p className="text-lg mt-1">Score: {fraudData.riskScore}/100</p>
                </div>
              </div>

              <div>
                <Label>Risk Level</Label>
                <Select value={fraudData.riskLevel} onValueChange={(v) => setFraudData({ ...fraudData, riskLevel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk Score (0-100)</Label>
                <Input type="number" min={0} max={100} value={fraudData.riskScore} onChange={(e) => setFraudData({ ...fraudData, riskScore: Number(e.target.value) })} />
              </div>
              <div>
                <Label>IP Address</Label>
                <Input value={fraudData.ipAddress} onChange={(e) => setFraudData({ ...fraudData, ipAddress: e.target.value })} placeholder="Customer IP" />
              </div>
              <div>
                <Label>Flags (comma separated)</Label>
                <Input value={fraudData.flags} onChange={(e) => setFraudData({ ...fraudData, flags: e.target.value })} placeholder="mismatched-address, vpn-detected" />
              </div>
              <div className="md:col-span-2">
                <Label>Review Notes</Label>
                <Textarea value={fraudData.notes} onChange={(e) => setFraudData({ ...fraudData, notes: e.target.value })} rows={3} placeholder="Notes about the fraud review..." />
              </div>
            </div>

            {/* Existing Flags */}
            {order.fraudAnalysis?.flags && order.fraudAnalysis.flags.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <Label className="mb-2 block">Current Flags</Label>
                <div className="flex flex-wrap gap-2">
                  {order.fraudAnalysis.flags.map((flag: string, i: number) => (
                    <Badge key={i} variant="destructive">{flag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {order.fraudAnalysis?.reviewedBy && (
              <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                Last reviewed by: {order.fraudAnalysis.reviewedBy} on{" "}
                {order.fraudAnalysis.reviewedAt ? new Date(order.fraudAnalysis.reviewedAt).toLocaleString() : "N/A"}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          {order.status !== "on_hold" && fraudData.riskLevel === "critical" && (
            <Button variant="destructive" onClick={async () => {
              try {
                const updated = await updateOrderStatus(order._id, "on_hold", "High fraud risk");
                setOrder(updated);
                toast.success("Order put on hold due to fraud risk");
                refreshActivity();
              } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              Put Order On Hold
            </Button>
          )}
          <Button onClick={handleSaveFraud} disabled={saving}>
            {saving ? "Saving..." : "Save Fraud Analysis"}
          </Button>
        </div>
      </div>
    );
  };

  // ─── Shipping Tab ───────────────────────────────────────────
  const ShippingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping & Fulfillment</CardTitle>
          <CardDescription>Track shipments and fulfillment status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-sm">
              <span className="text-muted-foreground block">Shipping Address</span>
              <p className="font-medium">{order.shippingDetails?.fullName || "—"}</p>
              <p>{order.shippingDetails?.address || order.shippingAddress}</p>
              <p>{order.shippingDetails?.city}{order.shippingDetails?.state ? `, ${order.shippingDetails.state}` : ""}</p>
              <p>{order.shippingDetails?.phone || ""}</p>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground block">Order Status</span>
              <span className={cn("inline-block px-3 py-1 rounded text-sm font-medium mt-1", statusColor(order.status))}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Shipments */}
          {shipments.length > 0 ? (
            <div>
              <h3 className="font-semibold mb-3">Shipments</h3>
              {shipments.map((shipment: ShipmentInfo) => (
                <Card key={shipment.id} className="mb-3">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tracking #</span>
                        <p className="font-mono">{shipment.trackingNumber || "—"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Carrier</span>
                        <p>{shipment.carrier || "—"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status</span>
                        <p className="capitalize">{shipment.status}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Delivery</span>
                        <p>{shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : "—"}</p>
                      </div>
                    </div>
                    {shipment.trackingUrl && (
                      <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm mt-2 inline-block">
                        Track Package &rarr;
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-2">No shipments found for this order.</p>
              <p className="text-xs">Shipments are created via the logistics service.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick fulfillment actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fulfillment Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {order.status === "pending" && (
            <Button size="sm" onClick={async () => {
              try {
                const updated = await updateOrderStatus(order._id, "processing");
                setOrder(updated);
                toast.success("Order moved to processing");
                refreshActivity();
              } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              Start Processing
            </Button>
          )}
          {order.status === "processing" && (
            <Button size="sm" onClick={async () => {
              try {
                const updated = await updateOrderStatus(order._id, "shipped");
                setOrder(updated);
                toast.success("Order marked as shipped");
                refreshActivity();
              } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              Mark as Shipped
            </Button>
          )}
          {order.status === "shipped" && (
            <Button size="sm" onClick={async () => {
              try {
                const updated = await updateOrderStatus(order._id, "delivered");
                setOrder(updated);
                toast.success("Order marked as delivered");
                refreshActivity();
              } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              Mark as Delivered
            </Button>
          )}
          {order.status === "delivered" && (
            <Button size="sm" onClick={async () => {
              try {
                const updated = await updateOrderStatus(order._id, "completed");
                setOrder(updated);
                toast.success("Order completed");
                refreshActivity();
              } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
            }}>
              Complete Order
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // ─── Returns Tab ────────────────────────────────────────────
  const ReturnsTab = () => {
    const [showForm, setShowForm] = useState(false);
    const [returnForm, setReturnForm] = useState({
      type: "return" as "return" | "refund" | "exchange",
      reason: "",
      refundAmount: 0,
      refundMethod: "original",
      notes: "",
      selectedItems: [] as number[],
    });

    const handleCreateReturn = async () => {
      setSaving(true);
      try {
        const items = returnForm.selectedItems.map((i) => order.products?.[i]).filter(Boolean) as ProductItem[];
        const ret = await createReturn({
          orderId: order._id,
          userId: order.userId,
          email: order.email,
          type: returnForm.type,
          reason: returnForm.reason,
          items: items.map((p: ProductItem) => ({ name: p.name, quantity: p.quantity, price: p.price, productId: p.productId })),
          refundAmount: Number(returnForm.refundAmount),
          refundMethod: returnForm.refundMethod,
          notes: returnForm.notes,
        });
        setOrderReturns((prev) => [ret, ...prev]);
        setShowForm(false);
        toast.success("Return request created");
        refreshActivity();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to create return");
      } finally {
        setSaving(false);
      }
    };

    const returnStatusColor = (s: string) => {
      const map: Record<string, string> = {
        requested: "bg-yellow-500/20 text-yellow-700",
        approved: "bg-blue-500/20 text-blue-700",
        rejected: "bg-red-500/20 text-red-700",
        received: "bg-indigo-500/20 text-indigo-700",
        refunded: "bg-green-500/20 text-green-700",
        exchanged: "bg-purple-500/20 text-purple-700",
      };
      return map[s] || "bg-gray-500/20";
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Returns, Refunds & Exchanges</CardTitle>
                <CardDescription>Manage return requests and process refunds</CardDescription>
              </div>
              <Button size="sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "New Return Request"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* New Return Form */}
            {showForm && (
              <Card className="mb-6 border-primary/30">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={returnForm.type} onValueChange={(v: "return" | "refund" | "exchange") => setReturnForm({ ...returnForm, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="return">Return</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                          <SelectItem value="exchange">Exchange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Refund Amount (cents)</Label>
                      <Input type="number" value={returnForm.refundAmount} onChange={(e) => setReturnForm({ ...returnForm, refundAmount: Number(e.target.value) })} />
                    </div>
                    <div>
                      <Label>Refund Method</Label>
                      <Select value={returnForm.refundMethod} onValueChange={(v) => setReturnForm({ ...returnForm, refundMethod: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original Payment</SelectItem>
                          <SelectItem value="store_credit">Store Credit</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Input value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })} placeholder="Reason for return/refund" />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Select Items</Label>
                    <div className="space-y-2">
                      {order.products?.map((product: ProductItem, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-2 border rounded">
                          <Checkbox
                            checked={returnForm.selectedItems.includes(i)}
                            onCheckedChange={(checked) => {
                              setReturnForm((prev) => ({
                                ...prev,
                                selectedItems: checked
                                  ? [...prev.selectedItems, i]
                                  : prev.selectedItems.filter((idx) => idx !== i),
                              }));
                            }}
                          />
                          <span className="flex-1">{product.name}</span>
                          <span className="text-sm text-muted-foreground">x{product.quantity}</span>
                          <span className="text-sm">{formatCurrency(product.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <Textarea value={returnForm.notes} onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })} rows={2} />
                  </div>

                  <Button onClick={handleCreateReturn} disabled={saving || !returnForm.reason}>
                    {saving ? "Creating..." : "Create Return Request"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Existing Returns */}
            {orderReturns.length > 0 ? (
              <div className="space-y-3">
                {orderReturns.map((ret: ReturnEntry) => (
                  <Card key={ret._id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{ret.type}</span>
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", returnStatusColor(ret.status))}>
                              {ret.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{ret.reason}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="font-medium">{formatCurrency(ret.refundAmount || 0)}</p>
                          <p className="text-muted-foreground">{new Date(ret.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ret.items?.map((item: { name: string; quantity: number }, i: number) => (
                          <span key={i}>
                            {item.name} x{item.quantity}
                            {ret.items && i < ret.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !showForm ? (
              <div className="text-center py-8 text-muted-foreground">
                No return requests for this order.
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    );
  };

  // ─── Notes & Activity Log Tab ───────────────────────────────
  const NotesTab = () => {
    const [noteText, setNoteText] = useState("");
    const [noteType, setNoteType] = useState("internal");

    const handleAddNote = async () => {
      if (!noteText.trim()) return;
      setSaving(true);
      try {
        await addOrderNote(order._id, noteText, noteType);
        setNoteText("");
        toast.success("Note added");
        refreshActivity();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to add note");
      } finally {
        setSaving(false);
      }
    };

    const noteTypeColor = (type: string) => {
      const map: Record<string, string> = {
        internal: "bg-blue-500/20 text-blue-700",
        customer: "bg-green-500/20 text-green-700",
        system: "bg-gray-500/20 text-gray-700",
      };
      return map[type] || "bg-gray-500/20";
    };

    const actionIcon = (action: string) => {
      const map: Record<string, string> = {
        status_changed: "🔄",
        order_updated: "✏️",
        marked_paid: "💰",
        fraud_review: "🛡️",
        note_added: "📝",
        return_created: "📦",
        return_updated: "🔁",
        bulk_status_change: "⚡",
      };
      return map[action] || "📋";
    };

    return (
      <div className="space-y-6">
        {/* Add Note */}
        <Card>
          <CardHeader>
            <CardTitle>Add Note</CardTitle>
            <CardDescription>Add internal notes or customer communication logs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Select value={noteType} onValueChange={setNoteType}>
                <SelectTrigger className="w-35"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your note here..."
                className="flex-1"
                rows={2}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={handleAddNote} disabled={saving || !noteText.trim()}>
                {saving ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Complete history of all actions on this order</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length > 0 ? (
              <div className="space-y-0">
                {activity.map((entry: ActivityEntry, i: number) => (
                  <div key={entry._id || i} className="flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{actionIcon(entry.action)}</span>
                      {i < activity.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium", noteTypeColor(entry.noteType || "system"))}>
                          {entry.noteType || "system"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{entry.description}</p>
                      {entry.performedBy && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By: {entry.performedByEmail || entry.performedBy}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No activity recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "edit" && <EditTab />}
      {activeTab === "fraud" && <FraudTab />}
      {activeTab === "shipping" && <ShippingTab />}
      {activeTab === "returns" && <ReturnsTab />}
      {activeTab === "notes" && <NotesTab />}
    </div>
  );
}
