"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import Link from "next/link";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);

interface StatItem {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
  refundedOrders: number;
}

interface RevenueDay {
  date: string;
  revenue: number;
  orders: number;
}

interface StatusBucket {
  status: string;
  count: number;
}

interface DashboardProps {
  stats: StatItem;
  revenueByDay: RevenueDay[];
  statusDistribution: StatusBucket[];
}

export default function OrderAdminDashboard({ stats, revenueByDay, statusDistribution }: DashboardProps) {
  const statCards = [
    { title: "Total Orders", value: stats.totalOrders || 0, description: "All time", icon: "📦" },
    { title: "Total Revenue", value: formatCurrency(stats.totalRevenue || 0), description: "All time", icon: "💰" },
    { title: "Today's Orders", value: stats.todayOrders || 0, description: "Since midnight", icon: "📋" },
    { title: "Today's Revenue", value: formatCurrency(stats.todayRevenue || 0), description: "Since midnight", icon: "💵" },
    { title: "Avg Order Value", value: formatCurrency(stats.avgOrderValue || 0), description: "Per order", icon: "📊" },
    { title: "Pending", value: stats.pendingOrders || 0, description: "Awaiting action", color: "text-yellow-600", icon: "⏳" },
    { title: "Completed", value: stats.completedOrders || 0, description: "Delivered/Paid", color: "text-green-600", icon: "✅" },
    { title: "Refunded", value: stats.refundedOrders || 0, description: "Returns processed", color: "text-red-600", icon: "🔄" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.title}</CardDescription>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <CardTitle className={cn("text-2xl", stat.color)}>
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
            <CardDescription>Daily revenue and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? formatCurrency(value) : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ status, count }: { status: string; count: number }) => `${status}: ${count}`}
                  >
                    {statusDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/orders">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-base group-hover:text-primary transition-colors">📋 Manage Orders</CardTitle>
              <CardDescription>View, edit, and process orders</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/orders?status=pending">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-base group-hover:text-primary transition-colors">⏳ Pending Orders</CardTitle>
              <CardDescription>{stats.pendingOrders || 0} orders need attention</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/returns">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-base group-hover:text-primary transition-colors">🔄 Returns & Refunds</CardTitle>
              <CardDescription>Process returns and exchanges</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/reports">
          <Card className="hover:border-primary transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="text-base group-hover:text-primary transition-colors">📊 Reports</CardTitle>
              <CardDescription>Analytics and data export</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
