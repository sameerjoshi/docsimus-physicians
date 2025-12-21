'use client';

import { useState } from 'react';
import { AppHeader } from '@/src/components/layout/app-header';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Badge } from '@/src/components/ui/badge';
import {
  Users, Search, Phone, Mail, Calendar, FileText,
  MoreVertical, Eye, MessageSquare, Video
} from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/src/lib/animations';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API
  const patients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com',
      lastVisit: '2024-12-15',
      condition: 'Diabetes',
      status: 'active'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      phone: '+91 98765 43211',
      email: 'priya.s@email.com',
      lastVisit: '2024-12-18',
      condition: 'Hypertension',
      status: 'active'
    },
    {
      id: 3,
      name: 'Amit Patel',
      age: 28,
      gender: 'Male',
      phone: '+91 98765 43212',
      email: 'amit.p@email.com',
      lastVisit: '2024-12-10',
      condition: 'Allergy',
      status: 'inactive'
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Patients', value: '42', color: 'text-blue-600', bgColor: 'bg-blue-500/10' },
    { label: 'Active', value: '38', color: 'text-green-600', bgColor: 'bg-green-500/10' },
    { label: 'New This Month', value: '12', color: 'text-orange-600', bgColor: 'bg-orange-500/10' },
  ];

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl"
        >
          {/* Header */}
          <motion.div variants={staggerItem} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Patients</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your patient records and history</p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <Card key={i} className="p-4 sm:p-6">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div variants={staggerItem}>
            <Card className="p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Users className="h-4 w-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Patients List - Desktop */}
          <motion.div variants={staggerItem} className="hidden md:block">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.age} years • {patient.gender}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {patient.phone}
                            </p>
                            <p className="text-sm flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{patient.condition}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={patient.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Video className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Patients List - Mobile */}
          <motion.div variants={staggerItem} className="md:hidden space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{patient.age} years • {patient.gender}</p>
                  </div>
                  <Badge className={patient.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                    {patient.status}
                  </Badge>
                </div>
                <div className="space-y-2 mb-3">
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {patient.email}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <Badge variant="outline" className="text-xs">{patient.condition}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-1" /> Chat
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Video className="h-4 w-4 mr-1" /> Call
                  </Button>
                </div>
              </Card>
            ))}
          </motion.div>

          {filteredPatients.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">No patients found matching your search</p>
            </Card>
          )}
        </motion.div>
      </div>
    </>
  );
}
