import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, Clock } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    {
      title: "AI-Powered Study Assistant",
      organization: "TechEd Solutions",
      tags: ["AI", "Education"],
      startDate: "10 de Septiembre",
      endDate: "20 de Septiembre",
      members: 4,
      progress: 75,
      isFlexible: false,
      publishedAgo: "hace 3 días"
    },
    {
      title: "Campus Event Planner App",
      organization: "UniConnect",
      tags: ["Mobile", "UI/UX"],
      startDate: "15 de Septiembre",
      endDate: "15 de Octubre",
      members: 3,
      progress: 40,
      isFlexible: true,
      publishedAgo: "hace 15 días"
    },
    {
      title: "Blockchain-based Voting System",
      organization: "CivicTech Innovations",
      tags: ["Blockchain", "Security"],
      startDate: "1 de Octubre",
      endDate: "30 de Noviembre",
      members: 5,
      progress: 60,
      isFlexible: false,
      publishedAgo: "hace 2 meses"
    }
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Publish Project</Button>
          </div>
        </div>

        <div className="flex space-x-2">
          <Input className="flex-grow" placeholder="Search projects..." />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="ai">AI</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="blockchain">Blockchain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="relative h-40 bg-gray-100 p-0">
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-300">
                  IMAGE
                </div>
                <div className="absolute top-2 left-2 flex items-center space-x-2">
                  <Badge variant={project.isFlexible ? "secondary" : "default"}>
                    {project.isFlexible ? "Flexible" : "Cronograma"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-white/80 text-gray-800">
                    <Clock className="mr-1 h-3 w-3" />
                    {project.publishedAgo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{project.organization}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="rounded-full">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {project.startDate} - {project.endDate}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Users className="mr-2 h-4 w-4" />
                  {project.members} members
                </div>
                <Progress value={project.progress} className="mb-2" />
                <p className="text-sm text-right text-muted-foreground">{project.progress}% Complete</p>
                <Button className="w-full mt-4">Ver Detalles</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}