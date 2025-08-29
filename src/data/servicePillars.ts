import { ServiceCategory } from '../types/services';
import { serviceCategories } from './serviceCategories';

export interface ServicePillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  heroServices: string[]; // Service IDs for hero display
  allServices: string[]; // All service IDs in this pillar
}

export const servicePillars: ServicePillar[] = [
  {
    id: 'growth',
    title: 'Growth & Acquisition',
    description: 'Paid media strategies and demand generation that drive measurable growth',
    icon: '📈',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    heroServices: ['growth-performance', 'b2b-demand-gen'],
    allServices: ['growth-performance', 'b2b-demand-gen', 'influencer-partnerships']
  },
  {
    id: 'optimization',
    title: 'Optimization & Analytics',
    description: 'Conversion optimization and data intelligence that maximize performance',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 to-pink-500/20',
    heroServices: ['funnels-cro', 'analytics-bi'],
    allServices: ['funnels-cro', 'analytics-bi', 'marketing-automation', 'web-ecommerce']
  },
  {
    id: 'brand',
    title: 'Brand & Content',
    description: 'Creative production and content strategies that build lasting brand presence',
    icon: '🎨',
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/20 to-red-500/20',
    heroServices: ['creative-studio', 'social-media'],
    allServices: ['creative-studio', 'social-media', 'personal-branding', 'podcast-studio', 'seo-organic', 'events-launch']
  }
];

// Helper functions
export const getServicesByPillar = (pillarId: string): ServiceCategory[] => {
  const pillar = servicePillars.find(p => p.id === pillarId);
  if (!pillar) return [];
  
  return pillar.allServices
    .map(serviceId => serviceCategories.find(service => service.id === serviceId))
    .filter((service): service is ServiceCategory => service !== undefined);
};

export const getHeroServices = (pillarId: string): ServiceCategory[] => {
  const pillar = servicePillars.find(p => p.id === pillarId);
  if (!pillar) return [];
  
  return pillar.heroServices
    .map(serviceId => serviceCategories.find(service => service.id === serviceId))
    .filter((service): service is ServiceCategory => service !== undefined);
};

export const getPopularServices = (): ServiceCategory[] => {
  // Most popular services across all pillars
  const popularServiceIds = ['growth-performance', 'funnels-cro', 'creative-studio'];
  return popularServiceIds
    .map(serviceId => serviceCategories.find(service => service.id === serviceId))
    .filter((service): service is ServiceCategory => service !== undefined);
};

export const getServicePillar = (serviceId: string): ServicePillar | undefined => {
  return servicePillars.find(pillar => pillar.allServices.includes(serviceId));
};