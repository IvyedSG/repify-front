"use client"

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Book, Edit2, GraduationCap, Globe, MapPin, Save, User, AtSign, Bell } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type UserProfile = {
  name: string;
  email: string;
  bio: string;
  location: string;
  university: string;
  major: string;
  graduationYear: string;
  interests: string[];
  achievements: string[];
  joinDate: string;
  academicYear: string;
};

type UserSettings = {
  emailNotifications: boolean;
  language: string;
  privacyLevel: 'public' | 'private' | 'university';
};

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ana García',
    email: 'ana.garcia@universidad.edu',
    bio: 'Estudiante apasionada por la investigación en biología molecular y su aplicación en la medicina regenerativa.',
    location: 'Madrid, España',
    university: 'Universidad Autónoma de Madrid',
    major: 'Biología',
    graduationYear: '2025',
    interests: ['Biología Molecular', 'Medicina Regenerativa', 'Genética'],
    achievements: ['Premio al Mejor Proyecto de Investigación 2023', 'Beca de Excelencia Académica'],
    joinDate: '2022-09-01',
    academicYear: '3er año',
  });

  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    language: 'es',
    privacyLevel: 'university',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (key: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Perfil Actualizado",
      description: "Tu perfil ha sido actualizado exitosamente.",
    });
  };

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" /> Editar Perfil
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-user.jpg" alt={profile.name} />
                    <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-2xl font-semibold">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.major} - {profile.academicYear}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      {profile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      name="location"
                      value={profile.location}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">Universidad</Label>
                    <Input
                      id="university"
                      name="university"
                      value={profile.university}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Carrera</Label>
                    <Input
                      id="major"
                      name="major"
                      value={profile.major}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Año de Graduación</Label>
                    <Input
                      id="graduationYear"
                      name="graduationYear"
                      value={profile.graduationYear}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Logros</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {profile.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Miembro desde {profile.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{profile.academicYear}</span>
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter>
                  <Button onClick={handleSave} className="ml-auto">Guardar Cambios</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de la Cuenta</CardTitle>
                <CardDescription>Gestiona tus preferencias y configuración de la cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones por Correo
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingsChange('emailNotifications', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => handleSettingsChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyLevel" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nivel de Privacidad
                  </Label>
                  <Select
                    value={settings.privacyLevel}
                    onValueChange={(value: 'public' | 'private' | 'university') => handleSettingsChange('privacyLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el nivel de privacidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="university">Solo Universidad</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast({ title: "Configuración Guardada", description: "Tu configuración ha sido actualizada exitosamente." })} className="ml-auto">Guardar Configuración</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Progreso Académico</CardTitle>
            <CardDescription>Visualiza tu avance en la carrera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso en la Carrera</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">24/32 Cursos Completados</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Promedio: 8.7/10</span>
              </div>
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">3 Proyectos de Investigación</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}