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

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  shortDesc: string;
  caseStudy: CaseStudy;
}

export interface RequirementFormData {
  name: string;
  email: string;
  serviceType: string;
  message: string;
}