"use client"

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';

type Application = {
  id: string;
  projectTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  responseDate?: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([
    { id: '1', projectTitle: "AI-Powered Study Assistant", company: "TechEd Solutions", appliedDate: "2023-09-15", status: "pending" },
    { id: '2', projectTitle: "Campus Event Planner App", company: "UniConnect", appliedDate: "2023-09-01", status: "approved", responseDate: "2023-09-10" },
    { id: '3', projectTitle: "Blockchain-based Voting System", company: "CivicTech Innovations", appliedDate: "2023-08-20", status: "rejected", responseDate: "2023-08-30" },
    { id: '4', projectTitle: "Smart City IoT Platform", company: "UrbanTech", appliedDate: "2023-07-01", status: "expired" },
    { id: '5', projectTitle: "E-commerce Analytics Dashboard", company: "DataRetail", appliedDate: "2023-09-20", status: "pending" },
  ]);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
    }
  };

  const filterApplications = (status: Application['status']) => {
    return applications.filter(app => app.status === status);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
          <div className="flex items-center space-x-2">
            <Input className="w-[300px]" placeholder="Search applications..." />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          {(['all', 'pending', 'approved', 'rejected', 'expired'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(tab === 'all' ? applications : filterApplications(tab)).map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <CardTitle className="text-xl">{application.projectTitle}</CardTitle>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          Applied: {application.appliedDate}
                        </div>
                      </div>
                      {application.responseDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          Response: {application.responseDate}
                        </div>
                      )}
                      <Button className="w-full mt-4" variant={application.status === 'pending' ? 'default' : 'outline'}>
                        {application.status === 'pending' ? 'Withdraw Application' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageContainer>
  );
}