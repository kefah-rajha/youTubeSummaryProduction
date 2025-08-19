export interface Tier {
  name: string;
  _id:string;
  id: 'starter' | 'pro' | 'advanced';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}

// export const PricingTier: Tier[] = [
//   {
//     name: 'Starter',
//     id: 'starter',
//     icon: '/assets/icons/price-tiers/free-icon.svg',
//     description: 'Ideal for individuals who want to get started with simple design tasks.',
//     features: ['1 workspace', 'Limited collaboration', 'Export to PNG and SVG'],
//     featured: false,
//     priceId: { month: 'pri_01jwc5cm1dqf520fhxaqk3yrff'	, year: 'pri_01jwc5gr085tgh554yyas7evj3' },
//   },
//   {
//     name: 'Pro',
//     id: 'pro',
//     icon: '/assets/icons/price-tiers/basic-icon.svg',
//     description: 'Enhanced design tools for scaling teams who need more flexibility.',
//     features: ['Integrations', 'Unlimited workspaces', 'Advanced editing tools', 'Everything in Starter'],
//     featured: true,
//     priceId: { month: 'pri_01jwc5m1p5mtzsa4brqqhcebgw', year: 'pri_01jwc5n462gs01sra99vgt8fmq' },
//   },
//   {
//     name: 'Advanced',
//     id: 'advanced',
//     icon: '/assets/icons/price-tiers/pro-icon.svg',
//     description: 'Powerful tools designed for extensive collaboration and customization.',
//     features: [
//       'Single sign on (SSO)',
//       'Advanced version control',
//       'Assets library',
//       'Guest accounts',
//       'Everything in Pro',
//     ],
//     featured: false,
//     priceId: { month: 'pri_01jwc5vcvxhvcz3vepcaae8k60', year: 'pri_01jwc5wtt2x67e9rym2qq3twyn' },
//   },
// ];