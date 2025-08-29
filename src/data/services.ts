import { Service } from '../types/services';

export const services: Service[] = [
  {
    id: 'seo',
    title: 'SEO',
    description: 'Search Engine Optimization',
    icon: '🔍',
    shortDesc: 'Boost your organic visibility and drive qualified traffic with data-driven SEO strategies.',
    caseStudy: {
      client: 'TechStyle E-commerce',
      brief: 'A fashion e-commerce brand struggling with organic visibility and high customer acquisition costs.',
      challenge: 'The client had poor search rankings for high-intent keywords and was heavily reliant on paid advertising.',
      solution: 'Implemented comprehensive SEO strategy including technical optimization, content marketing, and link building campaigns.',
      results: [
        {
          metric: 'Organic Traffic',
          value: '+287%',
          description: 'Increase in organic sessions within 8 months'
        },
        {
          metric: 'Keyword Rankings',
          value: '150+',
          description: 'First page rankings for target keywords'
        },
        {
          metric: 'Revenue Growth',
          value: '+156%',
          description: 'Organic revenue increase year-over-year'
        }
      ]
    }
  },
  {
    id: 'sem',
    title: 'SEM',
    description: 'Search Engine Marketing',
    icon: '📊',
    shortDesc: 'Maximize ROI with targeted search campaigns and conversion-focused ad strategies.',
    caseStudy: {
      client: 'CloudTech SaaS',
      brief: 'B2B SaaS company needed to scale lead generation while maintaining cost efficiency.',
      challenge: 'High competition in the SaaS space leading to expensive CPCs and low conversion rates.',
      solution: 'Developed targeted Google Ads campaigns with advanced audience segmentation and landing page optimization.',
      results: [
        {
          metric: 'Cost Per Lead',
          value: '-64%',
          description: 'Reduction in average cost per qualified lead'
        },
        {
          metric: 'Conversion Rate',
          value: '+189%',
          description: 'Improvement in landing page conversion rate'
        },
        {
          metric: 'ROAS',
          value: '420%',
          description: 'Return on ad spend achieved'
        }
      ]
    }
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Social Media Marketing',
    icon: '📱',
    shortDesc: 'Build brand awareness and engagement across all major social platforms.',
    caseStudy: {
      client: 'UrbanFit Lifestyle',
      brief: 'Fitness brand wanted to increase brand awareness and drive community engagement.',
      challenge: 'Low social media presence and difficulty reaching target demographic of young professionals.',
      solution: 'Created comprehensive social media strategy with influencer partnerships and user-generated content campaigns.',
      results: [
        {
          metric: 'Followers Growth',
          value: '+425%',
          description: 'Increase across all social platforms'
        },
        {
          metric: 'Engagement Rate',
          value: '8.7%',
          description: 'Average engagement rate achieved'
        },
        {
          metric: 'Brand Mentions',
          value: '+310%',
          description: 'Increase in organic brand mentions'
        }
      ]
    }
  },
  {
    id: 'email',
    title: 'Email Marketing',
    description: 'Email Marketing & Automation',
    icon: '✉️',
    shortDesc: 'Nurture leads and retain customers with personalized email campaigns.',
    caseStudy: {
      client: 'Gourmet Kitchen Co.',
      brief: 'Kitchenware retailer wanted to improve customer retention and increase repeat purchases.',
      challenge: 'Low email open rates and poor customer lifetime value metrics.',
      solution: 'Implemented segmented email automation flows and personalized product recommendations.',
      results: [
        {
          metric: 'Open Rate',
          value: '+156%',
          description: 'Improvement in average email open rate'
        },
        {
          metric: 'Click-Through Rate',
          value: '+243%',
          description: 'Increase in email click-through rate'
        },
        {
          metric: 'Revenue per Email',
          value: '+189%',
          description: 'Growth in revenue attribution to email'
        }
      ]
    }
  },
  {
    id: 'content',
    title: 'Content Marketing',
    description: 'Content Strategy & Creation',
    icon: '✍️',
    shortDesc: 'Engage your audience with compelling content that drives action and builds trust.',
    caseStudy: {
      client: 'FinTech Solutions Inc.',
      brief: 'Financial technology company needed to establish thought leadership and educate their market.',
      challenge: 'Complex product offerings required clear communication to build trust with potential customers.',
      solution: 'Developed comprehensive content marketing strategy including blog, whitepapers, and video content.',
      results: [
        {
          metric: 'Blog Traffic',
          value: '+378%',
          description: 'Increase in monthly blog visitors'
        },
        {
          metric: 'Lead Generation',
          value: '+234%',
          description: 'Growth in content-driven leads'
        },
        {
          metric: 'Time on Site',
          value: '+127%',
          description: 'Improvement in average session duration'
        }
      ]
    }
  },
  {
    id: 'ppc',
    title: 'PPC Advertising',
    description: 'Pay-Per-Click Campaigns',
    icon: '🎯',
    shortDesc: 'Drive immediate results with targeted paid advertising across multiple platforms.',
    caseStudy: {
      client: 'Luxury Home Decor',
      brief: 'High-end furniture retailer needed to increase online sales during competitive holiday season.',
      challenge: 'High-value products required sophisticated targeting to reach qualified buyers efficiently.',
      solution: 'Launched multi-platform PPC campaigns with advanced audience targeting and dynamic product ads.',
      results: [
        {
          metric: 'ROAS',
          value: '540%',
          description: 'Return on advertising spend achieved'
        },
        {
          metric: 'Conversion Rate',
          value: '+167%',
          description: 'Improvement in ad-to-sale conversion'
        },
        {
          metric: 'Average Order Value',
          value: '+89%',
          description: 'Increase in purchase value per customer'
        }
      ]
    }
  }
];