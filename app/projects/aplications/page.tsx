"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type Application = {
  id_solicitud: number;
  id_user: number;
  id_project: number;
  status: string;
  name_user: string;
  name_lider: string;
  name_project: string;
  created_at: string;
};

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user.accessToken) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/usuario/projects/project_solicitudes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({}) // Add any required body parameters here
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterApplications = (status: string) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase());
  };

  if (loading) {
    return <PageContainer scrollable={true}><div>Loading...</div></PageContainer>;
  }

  if (error) {
    return <PageContainer scrollable={true}><div>{error}</div></PageContainer>;
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
          <div className="flex items-center space-x-2">
            <Input className="w-[300px]" placeholder="Search applications..." />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pendiente">Pending</SelectItem>
                <SelectItem value="aprobado">Approved</SelectItem>
                <SelectItem value="rechazado">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pendiente">Pending</TabsTrigger>
            <TabsTrigger value="aprobado">Approved</TabsTrigger>
            <TabsTrigger value="rechazado">Rejected</TabsTrigger>
          </TabsList>

          {(['all', 'pendiente', 'aprobado', 'rechazado'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filterApplications(tab).map((application) => (
                  <Card key={application.id_solicitud}>
                    <CardHeader>
                      <CardTitle className="text-xl">{application.name_project}</CardTitle>
                      <p className="text-sm text-muted-foreground">Leader: {application.name_lider}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          Applied: {new Date(application.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        Application ID: {application.id_solicitud}
                      </div>
                      <Button className="w-full mt-4" variant={application.status.toLowerCase() === 'pendiente' ? 'default' : 'outline'}>
                        {application.status.toLowerCase() === 'pendiente' ? 'Withdraw Application' : 'View Details'}
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