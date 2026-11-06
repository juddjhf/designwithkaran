import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight, Camera, Menu, X } from 'lucide-react'
import { getPublic } from '../api'
import { instagramUrl } from '../data'

const navigation = [
  { label: 'Home', path: '/', section: 'home' },
  { label: 'About', path: '/about', section: 'about' },
  { label: 'Portfolio', path: '/work', section: 'portfolio' },
  { label: 'Videos', path: '/videos', section: 'videos' },
  { label: 'Services', path: '/services', section: 'services' },
  { label: 'Testimonials', path: '/#testimonials', section: 'testimonials', anchor: true },
  { label: 'Contact', path: '/contact', section: 'contact' },
]
const copyrightYear = new Date().getFullYear()

export function SiteLayout() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState({})
  const [activeSection, setActiveSection] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    getPublic('/settings', {}).then(setSettings)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return

    const sections = navigation
      .map((item) => document.getElementById(item.section))
      .filter(Boolean)

    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (current) setActiveSection(current.target.id)
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.35] })

    sections.forEach((section) => observer.observe(section))
    const target = location.hash && document.querySelector(location.hash)
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    return () => observer.disconnect()
  }, [location.pathname, location.hash])

  const navClass = (item) => {
    const active = location.pathname === '/' ? activeSection === item.section : location.pathname === item.path
    return active ? 'site-nav-link active' : 'site-nav-link'
  }

  function navigateTo(item, event) {
    setOpen(false)
    if (location.pathname === '/') {
      event.preventDefault()
      if (item.section === 'home') window.scrollTo({ top: 0, behavior: 'smooth' })
      else document.getElementById(item.section)?.scrollIntoView({ behavior: 'smooth' })
    } else if (item.anchor) {
      event.preventDefault()
      navigate(item.path)
    }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="wordmark" onClick={(event) => navigateTo(navigation[0], event)}>
          <span className="mark">D<span>·</span>K</span>
          <span>{settings.brandName || 'DESIGN WITH KARAN'}<small>GRAPHIC DESIGNER</small></span>
        </Link>
        <button className="mobile-menu" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          {navigation.map((item) => item.anchor
            ? <a href={item.path} key={item.label} className={navClass(item)} onClick={(event) => navigateTo(item, event)}>{item.label}</a>
            : <Link to={item.path} key={item.label} className={navClass(item)} onClick={(event) => navigateTo(item, event)}>{item.label}</Link>)}
          <Link className="nav-contact" to="/contact" onClick={() => setOpen(false)}>Let&apos;s talk <ArrowUpRight size={15} /></Link>
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="footer-main">
          <div><Link to="/" className="footer-name">{settings.brandName || 'Design With Karan'}<span>.</span></Link><p>Independent design for ambitious ideas.</p></div>
          <a className="footer-top" href="#home">Back to top <ArrowDownRight size={15} /></a>
        </div>
        <div className="footer-bottom">
          <span>© {copyrightYear} Karan Maddeshiya</span>
          <a href={settings.instagramUrl || instagramUrl} target="_blank" rel="noreferrer"><Camera size={15} /> Instagram <ArrowUpRight size={13} /></a>
          {settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail} <ArrowUpRight size={13} /></a> : <span className="email-placeholder">Email · to be configured</span>}
        </div>
      </footer>
    </div>
  )
}
