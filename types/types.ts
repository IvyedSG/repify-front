export interface Collaborator {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  project_type: string[];
  priority: string;
  responsible: number;
  name_responsible: string;
  detailed_description: string;
  objectives: string[];
  necessary_requirements: string[];
  progress: number;
  accepting_applications: boolean;
  type_aplyuni: string;
  collaboration_count: number;
  collaborators: Collaborator[]; // Update this to use the Collaborator interface
}

  export const projectTypes = [
    "Investigación Académica", "Desarrollo Social", "Desarrollo de Software", "Creativo", "Consultoría",
    "Educación", "Ambiental", "Diseño", "Tecnología", "Prototipo", "Análisis de Datos", "Estudio de Caso",
    "Informe", "Ensayo", "Planificación", "Gestión", "Innovación", "Emprendimiento", "Comunitario",
    "Evaluación", "Simulación y Modelado", "Clínico", "Biomédico"
  ];