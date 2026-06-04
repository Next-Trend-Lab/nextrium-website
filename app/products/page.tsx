import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ProductsClient from './ProductsClient'

export const metadata = {
  title: 'Our Builds',
  description:
    'Products designed and built by NexTrium. Each one addresses a real gap in an underserved market.',
}

export interface Product {
  slug: string
  name: string
  tagline: string
  description: string
  status: 'in_development' | 'beta' | 'live' | 'sunset'
  category: string[]
  tech_stack: string[]
  bodyColor: string
  website_url?: string
  github_url?: string
}

// Static data — replaced by Supabase query in Phase 2
export const ALL_PRODUCTS: Product[] = [
  {
    slug: 'zivana',
    name: 'Zivana Protocol',
    tagline: "Open Layer 2 trust infrastructure for Africa's informal economy.",
    description:
      'Zivana Protocol is an open Layer 2 trust infrastructure built on Cardano and Midnight. It enables participants in Africa\'s informal economy to build verifiable trust profiles they own and control, making invisible capability visible to capital providers, institutions, and partners.',
    status: 'in_development',
    category: ['Web3', 'Infrastructure', 'Trust'],
    tech_stack: ['Cardano', 'Midnight', 'Aiken', 'TypeScript'],
    bodyColor: '#0A8B8B',
    github_url: 'https://github.com/zivana-labs',
  },
  {
    slug: 'sovela',
    name: 'Sovela',
    tagline: 'Community credit and market intelligence built on Zivana Protocol.',
    description:
      'Sovela is the flagship application built on Zivana Protocol. It targets Nigeria\'s MSME financing gap by enabling traders and small business owners to build reputation-backed credit profiles, access community lending pools, and participate in a market intelligence network.',
    status: 'in_development',
    category: ['Fintech', 'MSME', 'Community'],
    tech_stack: ['Zivana Protocol', 'Next.js', 'Supabase', 'Cardano'],
    bodyColor: '#4A6FA5',
    website_url: 'https://sovela.app',
  },
  {
    slug: 'accordiax',
    name: 'Accordiax',
    tagline: 'Trust-based student-consultant agreement platform for Nigeria.',
    description:
      'Accordiax connects Nigerian students with educational consultants through a structured agreement system. Both parties define clear terms before any payment is made, creating accountability and trust in a market where informal arrangements routinely fail students.',
    status: 'in_development',
    category: ['EdTech', 'Trust', 'Nigeria'],
    tech_stack: ['Next.js', 'Supabase', 'TypeScript'],
    bodyColor: '#D4A843',
  },
]

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <ProductsClient products={ALL_PRODUCTS} />
      <Footer />
    </>
  )
}