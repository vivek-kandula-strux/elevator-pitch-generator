export interface CaseStudy {
  client: string;
  brief: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    description: string;
  }[];
  imageUrl?: string;
}

export interface SubService {
  id: string;
  title: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  shortDesc: string;
  services: SubService[];
  caseStudy: CaseStudy;
  color: string;
}

export interface Service extends ServiceCategory {} // For backwards compatibility

export interface RequirementFormData {
  name: string;
  email: string;
  company: string;
  whatsapp: string;
  serviceType: string;
  message: string;
}