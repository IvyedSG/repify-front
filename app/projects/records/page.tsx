"use client"

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Clock, 
  Award, 
  Briefcase, 
  CheckCircle, 
  Target, 
  TrendingUp,
  Users,
  BookOpen,
  Lightbulb,
  Heart,
  GraduationCap,
  FileText,
  Microscope
} from 'lucide-react';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
};

type ProjectMetric = {
  name: string;
  hours: number;
};

type Skill = {
  name: string;
  level: number;
};

export default function StudentRecordsPage() {
  const [userMetrics] = useState({
    totalHours: 450,
    projectsCompleted: 8,
    currentProjects: 2,
    averageGrade: 8.5,
    totalContributions: 32,
    coursesCompleted: 15,
  });

  const [achievements] = useState<Achievement[]>([
    { 
      id: '1', 
      title: 'First Steps', 
      description: 'Completed your first project', 
      icon: <GraduationCap className="h-8 w-8 text-yellow-400" />,
      date: '2022-05-15'
    },
    { 
      id: '2', 
      title: 'Team Player', 
      description: 'Collaborated on 3 group projects', 
      icon: <Users className="h-8 w-8 text-blue-500" />,
      date: '2022-09-30'
    },
    { 
      id: '3', 
      title: 'Research Enthusiast', 
      description: 'Conducted your first academic research', 
      icon: <Microscope className="h-8 w-8 text-green-500" />,
      date: '2023-01-22'
    },
    { 
      id: '4', 
      title: 'Problem Solver', 
      description: 'Successfully completed a challenging project', 
      icon: <Lightbulb className="h-8 w-8 text-purple-500" />,
      date: '2023-06-10'
    },
    { 
      id: '5', 
      title: 'Dedicated Learner', 
      description: 'Completed 400 hours of academic work', 
      icon: <Clock className="h-8 w-8 text-red-500" />,
      date: '2023-08-05'
    },
    { 
      id: '6', 
      title: 'Innovator', 
      description: 'Proposed a new research topic', 
      icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
      date: '2023-09-20'
    },
  ]);

  const [projectMetrics] = useState<ProjectMetric[]>([
    { name: 'Research Paper', hours: 100 },
    { name: 'Group Project', hours: 80 },
    { name: 'Thesis Work', hours: 150 },
    { name: 'Internship', hours: 200 },
    { name: 'Course Project', hours: 70 },
  ]);

  const [skills] = useState<Skill[]>([
    { name: 'Academic Writing', level: 85 },
    { name: 'Research Methods', level: 80 },
    { name: 'Data Analysis', level: 75 },
    { name: 'Presentation Skills', level: 70 },
    { name: 'Teamwork', level: 85 },
  ]);

  const getLevel = (hours: number) => {
    if (hours >= 2000) return 'Senior Student';
    if (hours >= 1000) return 'Advanced Student';
    if (hours >= 500) return 'Intermediate Student';
    return 'Junior Student';
  };

  const level = getLevel(userMetrics.totalHours);
  const nextLevel = getLevel(userMetrics.totalHours + 1);
  const progress = (userMetrics.totalHours % 500) / 5;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Academic Records & Achievements</h2>
            <p className="text-muted-foreground">Track your academic progress and celebrate your successes</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder-user.png" alt="Student" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Jane Smith</p>
              <Badge variant="secondary" className="text-sm">
                Level: {level}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Academic Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.totalHours}</div>
              <Progress 
                value={progress} 
                className="mt-2" 
                indicatorColor={progress >= 80 ? "bg-green-500" : ""}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {progress}% to {nextLevel}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.projectsCompleted}</div>
              <p className="text-xs text-muted-foreground">+1 from last semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.currentProjects}</div>
              <p className="text-xs text-muted-foreground">Active academic projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.averageGrade}</div>
              <p className="text-xs text-muted-foreground">Out of 10</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.totalContributions}</div>
              <p className="text-xs text-muted-foreground">Across all academic activities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userMetrics.coursesCompleted}</div>
              <p className="text-xs text-muted-foreground">Subjects mastered</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Project Metrics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hours per Project Type</CardTitle>
                <CardDescription>Distribution of time across different academic activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {achievement.icon}
                    <div>
                      <CardTitle>{achievement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow" />
                  <div className="bg-muted p-2 text-center text-sm text-muted-foreground">
                    Achieved on {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skill Proficiency</CardTitle>
                <CardDescription>Your expertise levels in various academic skills</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={skills}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="level"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {skills.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Academic Growth Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Badge variant="outline">Next Goal</Badge>
                <span>Complete 500 total academic hours</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">Upcoming Achievement</Badge>
                <span>Finish 10 projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Badge variant="outline">Skill Focus</Badge>
                <span>Improve in Research Methods and Data Analysis</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}