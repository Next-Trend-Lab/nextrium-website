import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog',
  description:
    'Product updates, announcements, event recaps, and research notes from NexTrium.',
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  post_type: 'editorial' | 'announcement' | 'product_update' | 'event_recap' | 'research' | 'recruitment'
  tags: string[]
  author: string
  published_at: string
}

export const ALL_POSTS: BlogPost[] = [
  {
    slug: 'zivana-protocol-update',
    title: "Zivana Protocol: Trust Infrastructure for Africa's Informal Economy",
    excerpt: 'How we are building an open Layer 2 protocol that makes invisible capability visible to capital providers and institutions.',
    content: 'Zivana Protocol is our answer to a fundamental question: how does a trader in Lagos with five years of consistent sales history demonstrate that to a capital provider? Today she cannot. Zivana makes it possible. The protocol sits as a Layer 2 on Cardano and Midnight, allowing participants in Africa\'s informal economy to build verifiable trust profiles they own and control. We are in active development. The litepaper is being refined. The GitHub repositories are live. This is what we are building and why it matters.',
    post_type: 'product_update',
    tags: ['Zivana', 'Web3', 'Cardano', 'Trust'],
    author: 'Abdulbasit Abdulrahman',
    published_at: 'Jun 2026',
  },
  {
    slug: 'nextrium-incorporated',
    title: 'NexTrium is Now an Officially Registered Company in Nigeria',
    excerpt: 'We received our CAC registration certificate. RC: 9506507. Here is what it means and what comes next for the company.',
    content: 'On 27 April 2026, NexTrium Global Innovations Ltd was officially registered with the Corporate Affairs Commission of Nigeria. RC: 9506507. This is not just a legal formality. It is the foundation on which everything else gets built. Contracts, partnerships, bank accounts, grant applications, investor conversations — all of it becomes more credible the moment there is a registered entity behind the work. Here is what it means for where we are going.',
    post_type: 'announcement',
    tags: ['NexTrium', 'Nigeria', 'CAC'],
    author: 'Abdulbasit Abdulrahman',
    published_at: 'Apr 2026',
  },
  {
    slug: 'cats-hackathon-recap',
    title: 'CATS Hackathon: What the Teams Built and What We Learned',
    excerpt: 'Three teams, three products, one hackathon. A recap of the Cardano Africa Tech Summit Hackathon organised by the Hub.',
    content: 'The Cardano Africa Tech Summit Hackathon ran for five days. Three teams entered. Three products shipped. AgriDatum tackled agricultural data access for smallholder farmers. TechKR built a reputation layer for technical contributors. Medisure addressed health identity for informal economy workers. None of these ideas came from us. They came from the community. Our job was to create the conditions. Here is what we learned from running the event and what we are doing differently next time.',
    post_type: 'event_recap',
    tags: ['CATS', 'Hackathon', 'Hub', 'Cardano'],
    author: 'NexTrium Hub',
    published_at: 'Mar 2026',
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogClient posts={ALL_POSTS} />
      <Footer />
    </>
  )
}
