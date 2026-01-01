'use client';

import { useState } from 'react';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  DollarSign, TrendingUp, Calendar, Download, CreditCard, Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';
import { RouteGuard } from '@/src/components/RouteGuard';

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const earnings = {
    total: 145000,
    thisMonth: 45000,
    lastMonth: 42000,
    pending: 5000,
    growth: 7.1
  };

  const transactions = [
    { id: 1, patient: 'Rajesh Kumar', amount: 1200, date: '2024-12-20', status: 'completed', type: 'consultation' },
    { id: 2, patient: 'Priya Sharma', amount: 1500, date: '2024-12-19', status: 'completed', type: 'consultation' },
    { id: 3, patient: 'Amit Patel', amount: 1000, date: '2024-12-18', status: 'pending', type: 'consultation' },
    { id: 4, patient: 'Neha Singh', amount: 1200, date: '2024-12-17', status: 'completed', type: 'consultation' },
    { id: 5, patient: 'Vikram Joshi', amount: 1800, date: '2024-12-16', status: 'completed', type: 'follow-up' },
  ];

  const monthlyData = [
    { month: 'Jan', earnings: 38000 },
    { month: 'Feb', earnings: 42000 },
    { month: 'Mar', earnings: 45000 },
    { month: 'Apr', earnings: 41000 },
    { month: 'May', earnings: 48000 },
    { month: 'Jun', earnings: 52000 },
  ];

  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  return (
    <RouteGuard>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl"
        >
          {/* Header */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Earnings</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Track your income and transactions</p>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  {earnings.growth}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                ₹{earnings.thisMonth.toLocaleString('en-IN')}
              </p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-2xl sm:text-3xl font-bold">₹{earnings.total.toLocaleString('en-IN')}</p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold">₹{earnings.pending.toLocaleString('en-IN')}</p>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Last Month</p>
              <p className="text-2xl sm:text-3xl font-bold">₹{earnings.lastMonth.toLocaleString('en-IN')}</p>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div variants={staggerItem} className="lg:col-span-2">
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold">Revenue Overview</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('month')}
                    >
                      Month
                    </Button>
                    <Button
                      variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod('year')}
                    >
                      Year
                    </Button>
                  </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="space-y-4">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-12">{data.month}</span>
                      <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-lg transition-all duration-500"
                          style={{ width: `${(data.earnings / maxEarnings) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold w-20 text-right">
                        ₹{(data.earnings / 1000).toFixed(0)}k
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div variants={staggerItem}>
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Transactions
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{txn.patient}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                        </div>
                        {txn.status === 'completed' ? (
                          <Badge className="bg-green-600 text-white text-xs">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-600 text-white text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground capitalize">{txn.type}</span>
                        <span className="text-sm font-bold text-foreground">
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* All Transactions Table - Desktop */}
          <motion.div variants={staggerItem} className="mt-6 hidden md:block">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">All Transactions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium">{txn.patient}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm capitalize">{txn.type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">{new Date(txn.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold">₹{txn.amount.toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={txn.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-amber-600 text-white'
                          }>
                            {txn.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </RouteGuard>
  );
}
