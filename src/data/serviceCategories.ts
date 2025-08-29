import { ServiceCategory } from '../types/services';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'growth-performance',
    title: 'Growth & Performance',
    description: 'Paid Media Strategy & Campaign Management',
    icon: '📈',
    shortDesc: 'Drive measurable growth with data-driven paid media strategies across all major platforms.',
    color: 'from-blue-500 to-cyan-500',
    services: [
      { id: 'paid-strategy', title: 'Paid Media Strategy (Cold/Warm/Hot)' },
      { id: 'ad-testing', title: 'Ad Copy & Creative Testing' },
      { id: 'campaign-management', title: 'Campaign Setup, Management & Scaling (Meta, Google, YouTube, LinkedIn)' },
      { id: 'performance-reviews', title: 'Weekly Performance Reviews & Objectives Tracking' }
    ],
    caseStudy: {
      client: 'TechStartup Solutions',
      brief: 'B2B SaaS company needed to scale from $50k to $500k MRR within 12 months.',
      challenge: 'High competition in SaaS space with expensive CPCs and complex sales funnel requiring multi-touch attribution.',
      solution: 'Developed comprehensive paid media strategy with cold/warm/hot audience segmentation, implemented advanced tracking, and scaled across Meta, Google, and LinkedIn with weekly optimization cycles.',
      results: [
        { metric: 'MRR Growth', value: '850%', description: 'Monthly recurring revenue increase' },
        { metric: 'Cost Per Lead', value: '-67%', description: 'Reduction in qualified lead costs' },
        { metric: 'ROAS', value: '420%', description: 'Return on ad spend achieved' }
      ]
    }
  },
  {
    id: 'funnels-cro',
    title: 'Funnels, CRO & Tracking',
    description: 'Conversion Optimization & Analytics',
    icon: '🔄',
    shortDesc: 'Optimize every step of your customer journey with data-driven conversion rate optimization.',
    color: 'from-purple-500 to-pink-500',
    services: [
      { id: 'funnel-viz', title: 'Funnel Visualisation & Offer Architecture' },
      { id: 'landing-pages', title: 'Landing/Thank-You Pages (Design, Copy, Build)' },
      { id: 'cro-testing', title: 'CRO & Experimentation (A/B tests, heatmaps, form optimization, page speed)' },
      { id: 'analytics-tracking', title: 'Analytics & Tracking (GA4, GTM, Meta Pixel/CAPI, UTM governance, server-side tracking)' }
    ],
    caseStudy: {
      client: 'E-commerce Fashion Brand',
      brief: 'Online retailer with high traffic but poor conversion rates needed funnel optimization.',
      challenge: 'Complex customer journey with multiple touchpoints resulting in 1.2% conversion rate and high cart abandonment.',
      solution: 'Redesigned complete funnel architecture, implemented advanced tracking, created high-converting landing pages, and ran systematic A/B tests across all touchpoints.',
      results: [
        { metric: 'Conversion Rate', value: '+340%', description: 'Overall site conversion improvement' },
        { metric: 'Cart Abandonment', value: '-58%', description: 'Reduction in abandoned carts' },
        { metric: 'Page Speed', value: '+85%', description: 'Improvement in core web vitals' }
      ]
    }
  },
  {
    id: 'creative-studio',
    title: 'Creative & Content Studio',
    description: 'Video Production & Creative Assets',
    icon: '🎬',
    shortDesc: 'Professional video production and creative assets that convert and engage your audience.',
    color: 'from-orange-500 to-red-500',
    services: [
      { id: 'ugc-content', title: 'UGC for Ads & Organic' },
      { id: 'brand-films', title: 'Brand Films & Commercials' },
      { id: 'video-editing', title: 'Reels/Shorts/YouTube Long-form Editing' },
      { id: 'ad-creatives', title: 'Ad Creatives, Motion Graphics, SFX' },
      { id: 'thumbnails', title: 'Thumbnails, Titles & Hooks' },
      { id: 'graphic-design', title: 'Graphic Design (carousels, decks, banners, packaging, mockups)' },
      { id: 'photography', title: 'Photography/Content Shoots (product & founder)' }
    ],
    caseStudy: {
      client: 'Consumer Electronics Brand',
      brief: 'Hardware startup needed professional creative assets to compete with established brands.',
      challenge: 'Limited budget for high-quality video production while needing content for multiple platforms and ad formats.',
      solution: 'Established full creative production pipeline including UGC campaigns, professional shoots, and systematic content repurposing across all platforms.',
      results: [
        { metric: 'Video Engagement', value: '+275%', description: 'Average engagement across all video content' },
        { metric: 'Ad Performance', value: '+180%', description: 'Improvement in creative CTR' },
        { metric: 'Production Cost', value: '-45%', description: 'Reduction in per-asset cost' }
      ]
    }
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    description: 'Complete Social Media Operations',
    icon: '📱',
    shortDesc: 'End-to-end social media management that builds communities and drives engagement.',
    color: 'from-green-500 to-teal-500',
    services: [
      { id: 'platform-management', title: 'Instagram & YouTube Management (calendars, posting, moderation)' },
      { id: 'community-mgmt', title: 'Community Management (DMs, comment ops, response SOPs)' },
      { id: 'content-repurposing', title: 'Cross-platform Repurposing & Distribution' },
      { id: 'social-listening', title: 'Social Listening & Brand Sentiment' }
    ],
    caseStudy: {
      client: 'Lifestyle Wellness Brand',
      brief: 'Health and wellness company needed to build authentic community and drive product sales through social.',
      challenge: 'Highly competitive wellness space requiring authentic engagement while maintaining consistent posting across multiple platforms.',
      solution: 'Developed comprehensive social strategy with community-first approach, implemented systematic content repurposing, and established proactive community management protocols.',
      results: [
        { metric: 'Follower Growth', value: '+380%', description: 'Organic follower increase across platforms' },
        { metric: 'Engagement Rate', value: '12.4%', description: 'Average engagement rate achieved' },
        { metric: 'Social Commerce', value: '+250%', description: 'Revenue from social media' }
      ]
    }
  },
  {
    id: 'personal-branding',
    title: 'Personal Branding for Founders',
    description: 'Executive Thought Leadership',
    icon: '👑',
    shortDesc: 'Build founder authority and thought leadership across all major platforms.',
    color: 'from-indigo-500 to-purple-500',
    services: [
      { id: 'youtube-management', title: 'YouTube & Instagram Management (Starter/Growth/Hyper Growth)' },
      { id: 'linkedin-leadership', title: 'LinkedIn Thought Leadership & Ghostwriting' },
      { id: 'authority-assets', title: 'Authority Assets (media kit, speaker kit, bio, press page)' },
      { id: 'collab-pipeline', title: 'Collab & Guesting Pipelines' }
    ],
    caseStudy: {
      client: 'Tech CEO - AI Startup',
      brief: 'Startup founder needed to establish thought leadership in competitive AI space to attract investors and talent.',
      challenge: 'Unknown founder in saturated market needing to build credibility and attract high-profile opportunities.',
      solution: 'Developed comprehensive personal brand strategy with LinkedIn thought leadership, strategic guesting, and professional authority assets.',
      results: [
        { metric: 'LinkedIn Followers', value: '+1,200%', description: 'Growth in LinkedIn following' },
        { metric: 'Speaking Opportunities', value: '15+', description: 'Major conference speaking slots' },
        { metric: 'Media Mentions', value: '+500%', description: 'Increase in press coverage' }
      ]
    }
  },
  {
    id: 'podcast-studio',
    title: 'Podcast Studio',
    description: 'Podcast-as-a-Service',
    icon: '🎙️',
    shortDesc: 'Complete podcast production and distribution service from strategy to syndication.',
    color: 'from-yellow-500 to-orange-500',
    services: [
      { id: 'show-strategy', title: 'Show Strategy, Format & Story Arcs' },
      { id: 'production', title: 'End-to-End Production (recording, editing, sound design)' },
      { id: 'clips-engine', title: 'Clips & Reels Engine (shorts factory)' },
      { id: 'guest-sourcing', title: 'Guest Sourcing & Booking' },
      { id: 'distribution-seo', title: 'Distribution, SEO & Syndication' },
      { id: 'sponsorship', title: 'Sponsorship Outreach & Ad Spots' },
      { id: 'press-amplification', title: 'Press & PR Amplification for Episodes' }
    ],
    caseStudy: {
      client: 'B2B Marketing Podcast',
      brief: 'Marketing agency wanted to launch podcast for lead generation and thought leadership.',
      challenge: 'No podcasting experience while needing professional production quality and consistent audience growth.',
      solution: 'Provided complete podcast-as-a-service including strategy development, guest booking, production, and multi-platform distribution with sponsorship monetization.',
      results: [
        { metric: 'Downloads', value: '50K+', description: 'Monthly downloads achieved in 6 months' },
        { metric: 'Lead Generation', value: '+180%', description: 'Qualified leads from podcast' },
        { metric: 'Sponsorship Revenue', value: '$15K+', description: 'Monthly sponsorship income' }
      ]
    }
  },
  {
    id: 'influencer-partnerships',
    title: 'Influencer, Creators & Partnerships',
    description: 'Creator Economy & Partnerships',
    icon: '🤝',
    shortDesc: 'Strategic influencer partnerships and creator collaborations that drive authentic engagement.',
    color: 'from-pink-500 to-rose-500',
    services: [
      { id: 'influencer-campaigns', title: 'Influencer Campaigns (nano → macro; sourcing, contracts, briefs)' },
      { id: 'podcast-featuring', title: 'Podcast Featuring & Collabs' },
      { id: 'meme-marketing', title: 'Meme Page Marketing' },
      { id: 'affiliate-programs', title: 'Affiliate/Ambassador Programs' },
      { id: 'ugc-whitelisting', title: 'UGC Whitelisting & Creator Licensing' }
    ],
    caseStudy: {
      client: 'Beauty Brand Launch',
      brief: 'New cosmetics brand needed to establish market presence through authentic creator partnerships.',
      challenge: 'Saturated beauty market requiring strategic influencer selection and authentic content creation at scale.',
      solution: 'Developed tiered influencer strategy from nano to macro creators, implemented UGC campaigns, and established affiliate program with performance tracking.',
      results: [
        { metric: 'Brand Awareness', value: '+320%', description: 'Increase in brand mention volume' },
        { metric: 'UGC Content', value: '500+', description: 'Pieces of authentic user content' },
        { metric: 'Influencer ROI', value: '380%', description: 'Return on influencer spend' }
      ]
    }
  },
  {
    id: 'seo-organic',
    title: 'SEO & Organic Growth',
    description: 'Search Engine Optimization',
    icon: '🔍',
    shortDesc: 'Comprehensive SEO strategy that drives sustainable organic growth and visibility.',
    color: 'from-emerald-500 to-green-500',
    services: [
      { id: 'technical-seo', title: 'Technical & On-Page SEO' },
      { id: 'content-strategy', title: 'Content Strategy & Topical Maps' },
      { id: 'local-seo', title: 'Local SEO / Google Business Profile (listing optimisation, reviews, citations)' },
      { id: 'youtube-seo', title: 'YouTube SEO (metadata, retention diagnostics)' },
      { id: 'reputation-mgmt', title: 'Reputation Management (ORM)' }
    ],
    caseStudy: {
      client: 'Local Service Business',
      brief: 'Multi-location service business needed to dominate local search results across all markets.',
      challenge: 'High competition in local markets with inconsistent NAP data and poor local visibility.',
      solution: 'Implemented comprehensive local SEO strategy with technical optimization, review management, and location-specific content strategy.',
      results: [
        { metric: 'Local Rankings', value: '95%', description: 'Top 3 rankings for target keywords' },
        { metric: 'Organic Traffic', value: '+280%', description: 'Increase in local search traffic' },
        { metric: 'Review Score', value: '4.8/5', description: 'Average review rating across locations' }
      ]
    }
  },
  {
    id: 'b2b-demand-gen',
    title: 'B2B Demand Gen & Outreach',
    description: 'Business Development & Lead Generation',
    icon: '🎯',
    shortDesc: 'Systematic B2B lead generation and outreach that fills your sales pipeline.',
    color: 'from-slate-500 to-gray-500',
    services: [
      { id: 'linkedin-outreach', title: 'LinkedIn Outreach & Appointment Setting' },
      { id: 'email-outreach', title: 'Email Outreach & Nurture Sequences' },
      { id: 'lead-magnets', title: 'Lead Magnets, Webinars & VSLs' },
      { id: 'crm-pipeline', title: 'CRM Pipeline Design (HubSpot/Zoho/Freshsales)' }
    ],
    caseStudy: {
      client: 'Enterprise Software Company',
      brief: 'B2B software company needed systematic lead generation to support aggressive growth targets.',
      challenge: 'Long sales cycles and high-value deals requiring sophisticated nurturing and multiple touchpoints.',
      solution: 'Built comprehensive demand generation system with LinkedIn outreach, email sequences, lead magnets, and CRM automation.',
      results: [
        { metric: 'Qualified Leads', value: '+340%', description: 'Increase in SQL generation' },
        { metric: 'Pipeline Value', value: '+250%', description: 'Growth in pipeline value' },
        { metric: 'Close Rate', value: '+45%', description: 'Improvement in lead-to-close rate' }
      ]
    }
  },
  {
    id: 'marketing-automation',
    title: 'Marketing Automation & CRM',
    description: 'Automated Customer Journeys',
    icon: '⚙️',
    shortDesc: 'Sophisticated marketing automation that nurtures leads and maximizes customer lifetime value.',
    color: 'from-cyan-500 to-blue-500',
    services: [
      { id: 'whatsapp-api', title: 'WhatsApp API Journeys (lead capture, reminders, reactivation)' },
      { id: 'automation-integrations', title: 'n8n/Zapier Integrations & Routing' },
      { id: 'lifecycle-campaigns', title: 'Lifecycle & Drip Campaigns' },
      { id: 'attribution-scoring', title: 'Attribution Stitching & Lead Scoring' }
    ],
    caseStudy: {
      client: 'Ed-Tech Platform',
      brief: 'Online education platform needed automated nurturing to convert free users to paid customers.',
      challenge: 'Complex user journey with multiple course offerings requiring personalized communication at scale.',
      solution: 'Implemented sophisticated automation including WhatsApp API, multi-channel nurturing, and behavioral lead scoring.',
      results: [
        { metric: 'Conversion Rate', value: '+195%', description: 'Free-to-paid conversion improvement' },
        { metric: 'Customer LTV', value: '+120%', description: 'Increase in lifetime value' },
        { metric: 'Automation Efficiency', value: '85%', description: 'Reduction in manual tasks' }
      ]
    }
  },
  {
    id: 'analytics-bi',
    title: 'Analytics, BI & Reporting',
    description: 'Data Intelligence & Insights',
    icon: '📊',
    shortDesc: 'Advanced analytics and business intelligence that drive data-informed decision making.',
    color: 'from-violet-500 to-purple-500',
    services: [
      { id: 'kpi-trees', title: 'KPI Trees & North-Star Metrics' },
      { id: 'dashboards', title: 'Dashboards & MIS (Looker Studio)' },
      { id: 'cohort-analysis', title: 'Cohort, CAC/LTV & Funnel Analysis' },
      { id: 'testing-frameworks', title: 'Testing Frameworks & Experiment Logs' }
    ],
    caseStudy: {
      client: 'Multi-Brand Retailer',
      brief: 'Retail company with multiple brands needed unified analytics to optimize marketing spend.',
      challenge: 'Fragmented data across platforms making it impossible to calculate true ROAS and optimize budget allocation.',
      solution: 'Built comprehensive BI system with unified dashboards, cohort analysis, and automated reporting across all brands.',
      results: [
        { metric: 'Data Accuracy', value: '+98%', description: 'Improvement in attribution accuracy' },
        { metric: 'Decision Speed', value: '+300%', description: 'Faster data-driven decisions' },
        { metric: 'Marketing Efficiency', value: '+60%', description: 'Improvement in marketing ROI' }
      ]
    }
  },
  {
    id: 'web-ecommerce',
    title: 'Web & E-commerce',
    description: 'Website & E-commerce Development',
    icon: '💻',
    shortDesc: 'Conversion-optimized websites and e-commerce platforms that turn visitors into customers.',
    color: 'from-teal-500 to-cyan-500',
    services: [
      { id: 'websites', title: 'Websites & Microsites (WordPress/Elementor)' },
      { id: 'ecommerce-setup', title: 'Shopify/WooCommerce Setup & Feed Optimisation' },
      { id: 'conversion-ux', title: 'Conversion-first UX & Page Speed' }
    ],
    caseStudy: {
      client: 'Luxury Goods Retailer',
      brief: 'High-end retailer needed e-commerce platform that matched their premium brand positioning.',
      challenge: 'Complex product catalog with premium user experience requirements and high performance standards.',
      solution: 'Built custom Shopify Plus solution with advanced UX design, performance optimization, and conversion-focused features.',
      results: [
        { metric: 'Conversion Rate', value: '+180%', description: 'Improvement in e-commerce conversion' },
        { metric: 'Page Speed', value: '+150%', description: 'Core Web Vitals improvement' },
        { metric: 'Average Order Value', value: '+75%', description: 'Increase in purchase value' }
      ]
    }
  },
  {
    id: 'events-launch',
    title: 'Events & Launch Marketing',
    description: 'Event Marketing & Product Launches',
    icon: '🚀',
    shortDesc: 'Strategic event marketing and product launches that create buzz and drive results.',
    color: 'from-amber-500 to-yellow-500',
    services: [
      { id: 'event-marketing', title: 'Event Hype, Teasers & Recaps' },
      { id: 'live-coverage', title: 'Live Coverage + Same-Day Edits' },
      { id: 'registration-funnels', title: 'Registration Funnels & Sponsor Packs' }
    ],
    caseStudy: {
      client: 'Tech Conference Organizer',
      brief: 'Technology conference needed to double attendance and attract premium sponsors.',
      challenge: 'Highly competitive conference space requiring differentiated marketing approach and sponsor value demonstration.',
      solution: 'Developed comprehensive event marketing strategy with multi-channel promotion, live coverage, and sponsor activation campaigns.',
      results: [
        { metric: 'Attendance', value: '+220%', description: 'Increase in event registration' },
        { metric: 'Sponsor Revenue', value: '+180%', description: 'Growth in sponsorship income' },
        { metric: 'Social Reach', value: '+400%', description: 'Event hashtag impressions' }
      ]
    }
  },
  {
    id: 'pr-communications',
    title: 'PR & Communications',
    description: 'Public Relations & Media Outreach',
    icon: '📰',
    shortDesc: 'Strategic PR and communications that build brand credibility and manage reputation.',
    color: 'from-rose-500 to-pink-500',
    services: [
      { id: 'press-releases', title: 'Press Releases & Media Outreach' },
      { id: 'publication-placements', title: 'Publication Placements & Founder Features' },
      { id: 'crisis-comms', title: 'Crisis Comms Basics & Review Response Playbooks' }
    ],
    caseStudy: {
      client: 'FinTech Startup',
      brief: 'Financial technology startup needed credible PR to support Series A fundraising.',
      challenge: 'Highly regulated industry requiring careful messaging and credible media relationships.',
      solution: 'Developed strategic PR campaign with targeted media outreach, thought leadership placements, and crisis communication protocols.',
      results: [
        { metric: 'Media Coverage', value: '25+', description: 'Tier-1 publication features' },
        { metric: 'Brand Sentiment', value: '+85%', description: 'Positive mention increase' },
        { metric: 'Funding Support', value: 'Series A', description: 'Successful $10M raise' }
      ]
    }
  },
  {
    id: 'strategy-leadership',
    title: 'Strategy, Training & Fractional Leadership',
    description: 'Strategic Consulting & Leadership',
    icon: '🧠',
    shortDesc: 'Strategic guidance and fractional leadership to accelerate your marketing maturity.',
    color: 'from-gray-500 to-slate-500',
    services: [
      { id: 'gtm-strategy', title: 'Go-to-Market & Offer Strategy' },
      { id: 'workshops-training', title: 'Workshops & Team Training (ads, content, sales enablement)' },
      { id: 'brand-tev', title: 'Brand TEV Workshops (Tone-Emotion-Voice)' },
      { id: 'fractional-cmo', title: 'Fractional CMO Engagements & Quarterly Growth Sprints' }
    ],
    caseStudy: {
      client: 'Scale-up SaaS Company',
      brief: 'Growing SaaS company needed strategic marketing leadership without full-time CMO cost.',
      challenge: 'Rapid growth requiring sophisticated marketing strategy but lacking senior marketing leadership.',
      solution: 'Provided fractional CMO services with strategic planning, team training, and quarterly growth sprint methodology.',
      results: [
        { metric: 'Team Capability', value: '+200%', description: 'Marketing team skill improvement' },
        { metric: 'Strategic Clarity', value: '100%', description: 'Clear GTM strategy execution' },
        { metric: 'Growth Velocity', value: '+150%', description: 'Acceleration in growth rate' }
      ]
    }
  }
];