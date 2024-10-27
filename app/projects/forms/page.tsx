"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateFormDialog } from "@/components/forms/CreateFormDialog";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

type Form = {
  id: string;
  title: string;
  link: string;
  date: string;
};

export default function FormsSection() {
  const [forms, setForms] = useState<Form[]>([
    {
      id: "1",
      title: "Psicologia Clinica",
      link: "https://example.com/form1",
      date: "2023-04-10",
    },
    {
      id: "2",
      title: "Calentamiento Global",
      link: "https://example.com/form2",
      date: "2023-05-15",
    },
    {
      id: "3",
      title: "Analisis Estructural",
      link: "https://example.com/form3",
      date: "2023-06-20",
    },
    {
      id: "4",
      title: "Fisica III",
      link: "https://example.com/form4",
      date: "2023-08-05",
    },
    {
      id: "5",
      title: "El ABP y las TIC",
      link: "https://example.com/form5",
      date: "2023-09-12",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addNewForm = (newForm: Omit<Form, 'id' | 'date'>) => {
    const newFormWithId = {
      ...newForm,
      id: (forms.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
    };
    setForms((prevForms) => [...prevForms, newFormWithId]);
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">FORMULARIOS</h2>
          <p className="text-muted-foreground">
            SUBA Y VISUALIZE OTROS FORMULARIOS DE LA COMUNDIAD
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Publicar Formulario</Button>
          </DialogTrigger>
          <DialogContent>
            <CreateFormDialog setIsDialogOpen={setIsDialogOpen} onFormSubmit={addNewForm} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Link className="h-6 w-6" />
              <div>
                <CardTitle>{form.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  <a href={form.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {form.link}
                  </a>
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow" />
            <div
              className="bg-muted p-2 text-center text-sm text-muted-foreground"
              style={{
                borderTopLeftRadius: '0px',
                borderTopRightRadius: '0px',
                borderBottomLeftRadius: '8px', // Ajusta este valor según lo que necesites
                borderBottomRightRadius: '8px',
              }}
            >
              Subido el {new Date(form.date).toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
