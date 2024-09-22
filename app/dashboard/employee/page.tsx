"use client"

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Users, Settings, PlusCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
};

type Team = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  tasks: Task[];
  progress: number;
  userRole: 'leader' | 'member';
};

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'AI Research Team',
      description: 'Exploring cutting-edge AI technologies',
      members: [
        { id: '1', name: 'John Doe', role: 'Team Lead', avatar: '/placeholder-user.jpg' },
        { id: '2', name: 'Jane Smith', role: 'AI Engineer', avatar: '/placeholder-user.jpg' },
        { id: '3', name: 'Bob Johnson', role: 'Data Scientist', avatar: '/placeholder-user.jpg' },
      ],
      tasks: [
        { id: '1', title: 'Implement new ML algorithm', status: 'in-progress', dueDate: '2023-10-15' },
        { id: '2', title: 'Prepare dataset for training', status: 'completed', dueDate: '2023-10-10' },
        { id: '3', title: 'Optimize model performance', status: 'todo', dueDate: '2023-10-20' },
      ],
      progress: 65,
      userRole: 'leader',
    },
    {
      id: '2',
      name: 'UI/UX Design Team',
      description: 'Creating beautiful and intuitive user interfaces',
      members: [
        { id: '4', name: 'Alice Williams', role: 'UX Lead', avatar: '/placeholder-user.jpg' },
        { id: '5', name: 'Charlie Brown', role: 'UI Designer', avatar: '/placeholder-user.jpg' },
      ],
      tasks: [
        { id: '4', title: 'Design new landing page', status: 'in-progress', dueDate: '2023-10-18' },
        { id: '5', title: 'User testing for mobile app', status: 'todo', dueDate: '2023-10-25' },
      ],
      progress: 40,
      userRole: 'member',
    },
  ]);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">My Teams</h2>
          <div className="flex items-center space-x-2">
            <Input className="w-[300px]" placeholder="Search teams..." />
            
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Teams</TabsTrigger>
            <TabsTrigger value="leader">Teams I Lead</TabsTrigger>
            <TabsTrigger value="member">Teams I'm In</TabsTrigger>
          </TabsList>

          {(['all', 'leader', 'member'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teams
                  .filter(team => tab === 'all' || team.userRole === tab)
                  .map((team) => (
                    <Card key={team.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{team.name}</CardTitle>
                          <Badge variant={team.userRole === 'leader' ? 'default' : 'secondary'}>
                            {team.userRole === 'leader' ? 'Leader' : 'Member'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Team Members</h4>
                            <div className="flex -space-x-2 overflow-hidden">
                              {team.members.map((member) => (
                                <Avatar key={member.id} className="border-2 border-background">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Recent Tasks</h4>
                            <ul className="space-y-2">
                              {team.tasks.slice(0, 3).map((task) => (
                                <li key={task.id} className="flex items-center justify-between text-sm">
                                  <span className="flex items-center">
                                    {getStatusIcon(task.status)}
                                    <span className="ml-2">{task.title}</span>
                                  </span>
                                  <span className="text-muted-foreground">{task.dueDate}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Team Progress</h4>
                            <Progress value={team.progress} className="h-2" />
                            <p className="text-sm text-right text-muted-foreground mt-1">{team.progress}% Complete</p>
                          </div>
                          <div className="flex justify-between items-center pt-4">
                            <Button variant="outline">View Details</Button>
                            {team.userRole === 'leader' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Team Management</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>Manage Members</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Add New Task</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Team Settings</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
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