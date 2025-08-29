export interface ServicePillar {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isPopular?: boolean;
  services: {
    id: string;
    title: string;
    description: string;
    isCore?: boolean;
  }[];
  caseStudy: {
    client: string;
    result: string;
    metric: string;
  };
}

export const servicePillars: ServicePillar[] = [
  {
    id: 'growth-advertising',
    title: 'Growth & Advertising',
    description: 'Paid media strategies that scale your business with measurable ROI across all major platforms.',
    icon: '📈',
    color: 'from-primary to-primary-glow',
    isPopular: true,
    services: [
      {
        id: 'paid-media-strategy',
        title: 'Paid Media Strategy',
        description: 'Cold/Warm/Hot audience segmentation and campaign architecture',
        isCore: true
      },
      {
        id: 'campaign-management',
        title: 'Campaign Management & Scaling',
        description: 'Meta, Google, YouTube, LinkedIn campaign optimization',
        isCore: true
      },
      {
        id: 'creative-testing',
        title: 'Ad Creative & Copy Testing',
        description: 'Systematic A/B testing for maximum performance'
      },
      {
        id: 'performance-tracking',
        title: 'Performance Reviews & Analytics',
        description: 'Weekly optimization and objective tracking'
      }
    ],
    caseStudy: {
      client: 'TechStartup Solutions',
      result: '850% MRR Growth',
      metric: '420% ROAS Achieved'
    }
  },
  {
    id: 'seo-content',
    title: 'SEO & Content',
    description: 'Organic growth strategies that build long-term visibility and sustainable traffic.',
    icon: '🔍',
    color: 'from-secondary to-secondary-muted',
    services: [
      {
        id: 'technical-seo',
        title: 'Technical & On-Page SEO',
        description: 'Complete site optimization for search engines',
        isCore: true
      },
      {
        id: 'content-strategy',
        title: 'Content Strategy & Topical Authority',
        description: 'Strategic content planning and editorial calendars'
      },
      {
        id: 'local-seo',
        title: 'Local SEO & Google Business',
        description: 'Local search domination and review management'
      },
      {
        id: 'creative-production',
        title: 'Video & Creative Production',
        description: 'UGC, brand films, reels, and ad creatives'
      },
      {
        id: 'social-management',
        title: 'Social Media Management',
        description: 'Instagram, YouTube, and community management'
      }
    ],
    caseStudy: {
      client: 'Local Service Business',
      result: '95% Top 3 Rankings',
      metric: '+280% Organic Traffic'
    }
  },
  {
    id: 'branding-strategy',
    title: 'Branding & Strategy',
    description: 'Build authority and thought leadership that positions you as the industry expert.',
    icon: '👑',
    color: 'from-accent to-muted',
    services: [
      {
        id: 'personal-branding',
        title: 'Personal Branding for Founders',
        description: 'LinkedIn thought leadership and authority building',
        isCore: true
      },
      {
        id: 'podcast-studio',
        title: 'Podcast Production & Strategy',
        description: 'End-to-end podcast-as-a-service'
      },
      {
        id: 'influencer-partnerships',
        title: 'Influencer & Creator Partnerships',
        description: 'Strategic influencer campaigns and UGC'
      },
      {
        id: 'pr-amplification',
        title: 'PR & Media Amplification',
        description: 'Press coverage and media relationship building'
      }
    ],
    caseStudy: {
      client: 'Tech CEO - AI Startup',
      result: '1,200% LinkedIn Growth',
      metric: '15+ Speaking Opportunities'
    }
  },
  {
    id: 'conversion-automation',
    title: 'Conversion & Automation',
    description: 'Optimize every touchpoint and automate your customer journey for maximum efficiency.',
    icon: '⚙️',
    color: 'from-success to-warning',
    services: [
      {
        id: 'funnel-optimization',
        title: 'Funnel & CRO Optimization',
        description: 'Landing pages, A/B testing, and conversion optimization',
        isCore: true
      },
      {
        id: 'marketing-automation',
        title: 'Marketing Automation & CRM',
        description: 'WhatsApp API, lifecycle campaigns, and lead scoring'
      },
      {
        id: 'b2b-demand-gen',
        title: 'B2B Demand Generation',
        description: 'LinkedIn outreach, email sequences, and appointment setting'
      },
      {
        id: 'analytics-bi',
        title: 'Analytics & Business Intelligence',
        description: 'KPI tracking, dashboards, and data-driven insights'
      },
      {
        id: 'web-ecommerce',
        title: 'Web & E-commerce Development',
        description: 'High-converting websites and e-commerce platforms'
      }
    ],
    caseStudy: {
      client: 'E-commerce Fashion Brand',
      result: '340% Conversion Rate',
      metric: '58% Reduced Cart Abandonment'
    }
  }
];