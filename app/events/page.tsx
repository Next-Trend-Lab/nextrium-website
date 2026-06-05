import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import EventsClient from './EventsClient'

export const metadata = {
  title: 'Events',
  description:
    'Past and upcoming events from NexTrium and the NexTrium Hub. Hackathons, workshops, summits, and community sessions.',
}

export interface NTEvent {
  slug: string
  title: string
  description: string
  event_type: 'hackathon' | 'workshop' | 'summit' | 'community' | 'other'
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  start_date: string
  end_date?: string
  location: string
  is_hub_event: boolean
  cover_color: string
}

export const ALL_EVENTS: NTEvent[] = [
  {
    slug: 'cats-hackathon-2026',
    title: 'Cardano Africa Tech Summit Hackathon',
    description:
      'A five-day hackathon bringing together builders across Nigeria to design and ship products on Cardano infrastructure. Teams competed across agriculture, fintech, EdTech, and identity verticals. Three products shipped.',
    event_type: 'hackathon',
    status: 'completed',
    start_date: 'March 2026',
    end_date: 'March 2026',
    location: 'Lagos, Nigeria',
    is_hub_event: true,
    cover_color: '#0A8B8B',
  },
  {
    slug: 'drep-workshop-2026',
    title: 'Cardano Intersect DRep Workshop',
    description:
      'A practical workshop introducing community members to the Cardano governance model and the role of Delegated Representatives. Participants left with a clear understanding of on-chain participation.',
    event_type: 'workshop',
    status: 'completed',
    start_date: 'February 2026',
    location: 'Lagos, Nigeria',
    is_hub_event: true,
    cover_color: '#4A6FA5',
  },
  {
    slug: 'nextrend-wada-launch-2026',
    title: 'NexTrend x WADA Hub Launch',
    description:
      'The official launch event for the NexTrend Hub in partnership with WADA. Community builders, developers, and innovators gathered to mark the beginning of a structured programme for African tech talent.',
    event_type: 'community',
    status: 'completed',
    start_date: 'January 2026',
    location: 'Lagos, Nigeria',
    is_hub_event: true,
    cover_color: '#D4A843',
  },
]

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <EventsClient events={ALL_EVENTS} />
      <Footer />
    </>
  )
}
