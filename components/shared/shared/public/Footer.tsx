import Link from 'next/link'
import Wordmark from '@/components/shared/Wordmark'

const FOOTER_LINKS = {
  Company: [
    { label: 'About',   href: '/about'      },
    { label: 'Team',    href: '/about#team' },
    { label: 'The Hub', href: '/hub'        },
    { label: 'Contact', href: '/contact'    },
  ],
  Products: [
    { label: 'All builds', href: '/products'           },
    { label: 'Zivana',     href: '/products/zivana'    },
    { label: 'Sovela',     href: '/products/sovela'    },
    { label: 'Accordiax',  href: '/products/accordiax' },
  ],
  Resources: [
    { label: 'Services', href: '/services' },
    { label: 'Events',   href: '/events'   },
    { label: 'Blog',     href: '/blog'     },
    { label: 'Careers',  href: '/careers'  },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{`
        .footer {
          background: var(--navy-deep); padding: 60px 0 32px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        .footer-col-title {
          font-family: var(--font-dm); font-size: 11px; font-weight: 500;
          color: var(--grey-mid); letter-spacing: 0.05em;
          text-transform: uppercase; margin-bottom: 16px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          font-family: var(--font-dm); font-size: 14px;
          color: var(--grey-dark); text-decoration: none;
          transition: color var(--transition-base);
        }
        .footer-links a:hover { color: var(--white); }
        .footer-tagline {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--grey-dark); margin-top: 12px; margin-bottom: 20px;
        }
        .footer-rc {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.08em; color: var(--grey-dark); line-height: 1.9;
        }
        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.1em; color: var(--grey-dark);
        }
        .footer-social { display: flex; gap: 16px; }
        .footer-social a {
          font-family: var(--font-mono); font-size: 8px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--grey-dark); text-decoration: none;
          transition: color var(--transition-base);
        }
        .footer-social a:hover { color: var(--orange); }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Link href="/" aria-label="NexTrium home">
                <Wordmark size="sm" variant="dark" />
              </Link>
              <p className="footer-tagline">Innovation. Incubation. Impact.</p>
              <address className="footer-rc" style={{ fontStyle: 'normal' }}>
                NexTrium Global Innovations Ltd<br />
                RC: 9506507<br />
                69 Abeokuta Street, Ilaje Bariga<br />
                Lagos, Nigeria — 100223
              </address>
            </div>
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <div className="footer-col-title">{group}</div>
                <ul className="footer-links">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">
              © {year} NexTrium Global Innovations Ltd. All rights reserved.
            </span>
            <div className="footer-social">
              <a href="#" rel="noopener noreferrer">Twitter</a>
              <a href="#" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/NexTrium" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
