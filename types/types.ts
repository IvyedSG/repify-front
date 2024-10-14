export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    project_type: string[];
    priority: string;
    detailed_description: string;
    objectives: string[];
    necessary_requirements: string[];
    progress: number;
    accepting_applications: boolean;
    name_uniuser: string;
    collaboration_count: number;
    collaborators: string[];
    type_aplyuni: string;
  }
  
  export const projectTypes = [
    "Investigación Académica", "Desarrollo Social", "Desarrollo de Software", "Creativo", "Consultoría",
    "Educación", "Ambiental", "Diseño", "Tecnología", "Prototipo", "Análisis de Datos", "Estudio de Caso",
    "Informe", "Ensayo", "Planificación", "Gestión", "Innovación", "Emprendimiento", "Comunitario",
    "Evaluación", "Simulación y Modelado", "Clínico", "Biomédico"
  ];