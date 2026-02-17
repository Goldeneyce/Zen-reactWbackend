"use client";

import { useState, useEffect } from "react";
import { getMonthlyReport, getPaymentMethodReport, getTopCustomers, getOrderStats } from "@/lib/order-admin-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

interface MonthlyRow {
  month: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
}

interface PaymentMethodRow {
  method: string;
  count: number;
  totalRevenue: number;
}

interface CustomerRow {
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  completedOrders: number;
}

export default function ReportsClient() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRow[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerRow[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [months, setMonths] = useState("12");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [monthly, payment, customers, orderStats] = await Promise.all([
          getMonthlyReport(Number(months)),
          getPaymentMethodReport(),
          getTopCustomers(10),
          getOrderStats(),
        ]);
        setMonthlyData(monthly || []);
        setPaymentMethods(payment || []);
        setTopCustomers(customers || []);
        setStats(orderStats);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [months]);

  if (loading) {
    return <div className="text-center py-16 text-muted-foreground">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.totalRevenue || 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Lifetime</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-2xl">{stats.totalOrders || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Lifetime</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Order Value</CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(stats.avgOrderValue || 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completion Rate</CardDescription>
              <CardTitle className="text-2xl">
                {stats.totalOrders > 0
                  ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%`
                  : "—"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stats.completedOrders} completed</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Period Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Report Period:</span>
        <Select value={months} onValueChange={setMonths}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last 12 Months</SelectItem>
            <SelectItem value="24">Last 24 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue & Orders</CardTitle>
          <CardDescription>Revenue and order volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-87.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="revenue" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
                <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    name === "totalRevenue" ? formatCurrency(value) :
                    name === "avgOrderValue" ? formatCurrency(value) : value,
                    name === "totalRevenue" ? "Revenue" :
                    name === "totalOrders" ? "Orders" :
                    name === "avgOrderValue" ? "Avg Value" : name,
                  ]}
                />
                <Legend />
                <Bar yAxisId="revenue" dataKey="totalRevenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar yAxisId="orders" dataKey="totalOrders" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Order Completion Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Trends</CardTitle>
          <CardDescription>Completed, cancelled, and refunded orders over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completedOrders" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.3} name="Completed" />
                <Area type="monotone" dataKey="cancelledOrders" stackId="2" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} name="Cancelled" />
                <Area type="monotone" dataKey="refundedOrders" stackId="3" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.3} name="Refunded" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Revenue and usage by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    dataKey="count"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ method, count }: { method: string; count: number }) => `${method === "cod" ? "COD" : "Card"}: ${count}`}
                  >
                    {paymentMethods.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [value, name === "cod" ? "Pay on Delivery" : "Card"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethods.map((pm) => (
                <div key={pm.method} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{pm.method === "cod" ? "Pay on Delivery" : pm.method || "Card"}</span>
                  <div className="text-right">
                    <span className="font-medium">{pm.count} orders</span>
                    <span className="text-muted-foreground ml-2">({formatCurrency(pm.totalRevenue)})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Order Value Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>AOV trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), "Avg Order Value"]} />
                  <Line type="monotone" dataKey="avgOrderValue" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Highest spending customers by lifetime value</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead className="text-center">Total Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                    No customer data available.
                  </TableCell>
                </TableRow>
              ) : (
                topCustomers.map((customer, i: number) => (
                  <TableRow key={customer.email}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-center">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.lastOrder).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Breakdown</CardTitle>
          <CardDescription>Detailed monthly metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Avg Value</TableHead>
                <TableHead className="text-center">Completed</TableHead>
                <TableHead className="text-center">Cancelled</TableHead>
                <TableHead className="text-center">Refunded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-16 text-center text-muted-foreground">
                    No data available for the selected period.
                  </TableCell>
                </TableRow>
              ) : (
                monthlyData.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.totalRevenue)}</TableCell>
                    <TableCell className="text-center">{row.totalOrders}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.avgOrderValue)}</TableCell>
                    <TableCell className="text-center text-green-600">{row.completedOrders}</TableCell>
                    <TableCell className="text-center text-red-600">{row.cancelledOrders}</TableCell>
                    <TableCell className="text-center text-purple-600">{row.refundedOrders}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
