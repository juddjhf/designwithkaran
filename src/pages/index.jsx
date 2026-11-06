import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Camera, Check, Clock3, Play, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react'
import api, { getPublic } from '../api'
import { categories, formatINR, instagramUrl, projects as sampleProjects, services as sampleServices, videos as sampleVideos } from '../data'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectModal } from '../components/ProjectModal'
import { AboutPreview, CategoryShowcase, ContactShowcase, HomeHero, ProcessShowcase, StatsStrip, TestimonialShowcase } from '../components/HomeSections'
import { imageConfig, resolveImage } from '../imageConfig'

const rise = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-70px' }, transition: { duration: .6 } }
const SectionHeading = ({ eyebrow, title, action, to }) => <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <Link className="text-link" to={to}>{action}<ArrowUpRight size={16} /></Link>}</div>
const PageIntro = ({ eyebrow, title, copy }) => <section className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</section>

export function HomePage() {
  const [work, setWork] = useState(sampleProjects.slice(0, 3))
  const [offers, setOffers] = useState(sampleServices.slice(0, 3))
  const [featuredVideos, setFeaturedVideos] = useState(sampleVideos.slice(0, 2))
  const [testimonials, setTestimonials] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  useEffect(() => {
    getPublic('/projects').then((items) => { if (items?.length) setWork(items.slice(0, 3)) })
    getPublic('/services').then((items) => { if (items?.length) setOffers(items.slice(0, 3)) })
    getPublic('/videos').then((items) => { if (items?.length) setFeaturedVideos(items.slice(0, 2)) })
    getPublic('/testimonials').then(setTestimonials)
  }, [])
  return <div className="homepage">
    <HomeHero />
    <StatsStrip />
    <AboutPreview />
    <section className="featured-work section-pad" id="portfolio">
      <motion.div {...rise} className="section-heading redesign-heading"><div><span className="eyebrow eyebrow-line">SELECTED WORK · A FEW RECENT FAVOURITES</span><h2>Ideas, out in<br /><span>the world.</span></h2></div><Link className="underlined-link" to="/work">Explore the portfolio <ArrowUpRight size={16} /></Link></motion.div>
      <div className="project-grid home-grid">{work.map((project, index) => <motion.div key={project._id || project.title} {...rise} transition={{ delay: index * .1 }}><ProjectCard project={project} onClick={() => setSelectedProject(project)} /></motion.div>)}</div>
    </section>
    <CategoryShowcase />
    <section className="home-motion-section section-pad" id="videos">
      <motion.div {...rise} className="section-heading redesign-heading"><div><span className="eyebrow eyebrow-line">MOTION, MEET MEANING</span><h2>Give good ideas<br /><span>some movement.</span></h2></div><Link className="underlined-link" to="/videos">Explore motion work <ArrowUpRight size={16} /></Link></motion.div>
      <div className="video-grid home-video-grid">{featuredVideos.map((video) => <Link className="video-card" key={video._id || video.title} to="/videos"><div className="video-thumb"><img src={resolveImage(video.thumbnail || video.image, imageConfig.video.brandMotion)} alt={`${video.title} video cover`} loading="lazy" /><span className="play-button"><Play fill="currentColor" size={18} /></span><span className="video-category">{video.category}</span></div><div className="video-caption"><h3>{video.title}</h3><ArrowUpRight size={16} /></div></Link>)}</div>
    </section>
    <section className="home-services-band" id="services">
      <div className="home-services-heading"><span className="eyebrow eyebrow-line">WAYS TO WORK TOGETHER</span><h2>Small studio.<br /><span>Big picture.</span></h2><p>Strategy, craft and a healthy obsession with the details—everything your next idea needs to find its voice.</p><Link className="underlined-link" to="/services">See all services <ArrowRight size={16} /></Link></div>
      <div className="home-service-list">{offers.map((service, index) => <Link className="home-service-row" to={`/book/${service._id}`} key={service._id}><span>0{index + 1}</span><div><b>{service.title}</b><small>{service.deliveryTime || 'Timeline confirmed after booking'}</small></div><strong>{formatINR(service.price)}</strong><ArrowUpRight size={17} /></Link>)}<p className="fixed-price-note"><Sparkles size={14} /> Fixed prices. No surprises.</p></div>
    </section>
    <ProcessShowcase />
    <TestimonialShowcase items={testimonials} />
    <ContactShowcase />
    <ProjectModal item={selectedProject} onClose={() => setSelectedProject(null)} />
  </div>
}

export function AboutPage() {
  return <div className="page-wrap"><PageIntro eyebrow="THE PERSON BEHIND THE PIXELS" title={<>Hello, I&apos;m Karan<span className="period">.</span></>} copy="A graphic designer and visual thinker, building thoughtful identities and experiences for people with something to say." />
    <section className="about-feature"><motion.div className="about-portrait" {...rise}><img src={imageConfig.profilePortrait} alt="Karan Maddeshiya - Graphic Designer" loading="lazy" /><span className="portrait-caption">DESIGNER · INDEPENDENT · INDIA</span></motion.div><div className="about-copy"><span className="eyebrow">A LITTLE ABOUT ME</span><h2>Curiosity first.<br />Pixels second.</h2><p>I&apos;m Karan Maddeshiya, an independent graphic designer working with growing businesses, creators and curious people. I believe the best work comes from listening closely, asking better questions and caring about the little things.</p><p>From the first rough sketch to the final exported file, I bring a hands-on approach to every project—combining clear thinking with expressive visual craft.</p><a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">Follow along on Instagram <Camera size={15} /></a></div></section>
    <section className="content-section about-skills"><SectionHeading eyebrow="MY TOOLKIT" title="Good ideas, well made." /><div className="skills-grid">{[['01','Brand identity','Strategy, logos, visual systems'],['02','Graphic design','Campaigns, posters, social'],['03','Motion & video','Motion graphics, editing'],['04','Art direction','Concepts, imagery, storytelling']].map(([n,title,desc])=><div className="skill-card" key={n}><span className="eyebrow">{n} / 04</span><h3>{title}</h3><p>{desc}</p></div>)}</div></section>
    <section className="process-section"><span className="eyebrow">HOW WE GET THERE</span><h2>Simple by design.</h2><div className="process-grid">{[['01','Listen','Every good project starts with a good conversation. I get to know your goals, audience and what makes you different.'],['02','Explore','Research, references and rough concepts. We find the right territory before we make anything precious.'],['03','Make','Focused creative, shared early and refined together. No black boxes, just thoughtful collaboration.'],['04','Deliver','Polished final files, ready for the real world—with the details and formats you actually need.']].map(([n,title,copy])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  </div>
}

export function PortfolioPage() {
  const [items, setItems] = useState(sampleProjects)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const [filter, setFilter] = useState(() => categories.includes(requestedCategory) ? requestedCategory : 'All')
  const [selected, setSelected] = useState(null)
  useEffect(() => { getPublic('/projects', sampleProjects).then((data) => { if (data?.length) setItems(data) }) }, [])
  const filtered = items.filter((item) => filter === 'All' || item.category === filter)
  return <div className="page-wrap"><PageIntro eyebrow="A FEW FAVOURITES" title={<>Work that<br />works<span className="period">.</span></>} copy="A collection of visual identities, campaigns and creative experiments made to mean something." />
    <div className="filter-row">{categories.map((category) => <button className={filter === category ? 'filter-chip active' : 'filter-chip'} key={category} onClick={() => { setFilter(category); setSearchParams(category === 'All' ? {} : { category }) }}>{category}</button>)}</div>
    <div className="project-grid portfolio-grid">{filtered.map((project) => <motion.div key={project._id || project.title} layout {...rise}><ProjectCard project={project} onClick={() => setSelected(project)} /></motion.div>)}</div>
    {!filtered.length && <div className="empty-state">More projects are on the way.</div>}
    <ProjectModal item={selected} onClose={() => setSelected(null)} />
  </div>
}

export function VideosPage() {
  const [items, setItems] = useState(sampleVideos)
  const [filter, setFilter] = useState('All')
  const [playing, setPlaying] = useState(null)
  useEffect(() => { getPublic('/videos', sampleVideos).then((data) => { if (data?.length) setItems(data) }) }, [])
  const filters = ['All', ...new Set(items.map((item) => item.category))]
  const shown = items.filter((item) => filter === 'All' || item.category === filter)
  const embedUrl = (url = '') => {
    const youtube = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/watch\?v=|youtube(?:-nocookie)?\.com\/embed\/)([^&?/]+)/)
    if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1`
    const instagram = url.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/)
    if (instagram) return `https://www.instagram.com/reel/${instagram[1]}/embed`
    return ''
  }
  return <div className="page-wrap"><PageIntro eyebrow="DESIGN, IN A DIFFERENT DIMENSION" title={<>Made to<br />move<span className="period">.</span></>} copy="Motion, edits and moving images. A little more life in every frame." />
    <div className="filter-row">{filters.map((category) => <button className={filter === category ? 'filter-chip active' : 'filter-chip'} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="video-grid">{shown.map((video) => <button className="video-card" key={video._id || video.title} onClick={() => setPlaying(video)}><div className="video-thumb"><img src={resolveImage(video.thumbnail || video.image, imageConfig.video.brandMotion)} alt="" loading="lazy" /><span className="play-button"><Play fill="currentColor" size={18} /></span><span className="video-category">{video.category}</span></div><div className="video-caption"><h3>{video.title}</h3><ArrowUpRight size={16} /></div></button>)}</div>
    {playing && <div className="modal-backdrop" onClick={() => setPlaying(null)} role="presentation"><section className="video-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setPlaying(null)} aria-label="Close">×</button>{embedUrl(playing.youtubeUrl || playing.instagramUrl || playing.link) ? <iframe src={embedUrl(playing.youtubeUrl || playing.instagramUrl || playing.link)} title={playing.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : playing.instagramUrl ? <div className="video-placeholder"><Camera size={32} /><p>This Instagram link can be viewed on Instagram.</p><a className="button button-outline" href={playing.instagramUrl} target="_blank" rel="noreferrer">Open Instagram <ArrowUpRight size={15} /></a></div> : <div className="video-placeholder"><Play size={32} /><p>Add a video link from the admin dashboard to play this project.</p></div>}</section></div>}
  </div>
}

export function ServicesPage() {
  const [items, setItems] = useState(sampleServices)
  useEffect(() => { getPublic('/services', sampleServices).then((data) => { if (data?.length) setItems(data) }) }, [])
  return <div className="page-wrap"><PageIntro eyebrow="WAYS WE CAN WORK TOGETHER" title={<>Good work.<br />Clear pricing<span className="period">.</span></>} copy="Straightforward services with fixed prices and thoughtful delivery. No surprises, just good creative." />
    <div className="service-cards">{items.map((service, index) => <motion.article className="service-card" key={service._id} {...rise} transition={{ delay: index * .08 }}><div className="service-image"><img src={resolveImage(service.image, imageConfig.categories.branding)} alt={service.title} loading="lazy" /><span className="service-number">0{index + 1}</span></div><div className="service-card-copy"><div className="service-title-row"><h2>{service.title}</h2><span className="service-price">{formatINR(service.price)}</span></div><p>{service.description}</p><div className="service-card-foot"><span><Clock3 size={14} /> {service.deliveryTime || 'Timeline confirmed after booking'}</span><Link to={`/book/${service._id}`} className="button button-outline">Order this <ArrowUpRight size={15} /></Link></div></div></motion.article>)}</div>
    <div className="price-note"><ShieldCheck size={19} /><p><b>What you see is what you pay.</b> Each service has a fixed price. Final scope and delivery details are confirmed before work begins.</p></div>
  </div>
}

export function BookingPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [items, setItems] = useState(sampleServices)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const service = items.find((item) => item._id === serviceId || item.slug === serviceId)
  useEffect(() => { getPublic('/services', sampleServices).then((data) => { if (data?.length) setItems(data) }) }, [])
  async function submit(event) {
    event.preventDefault()
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    form.set('serviceId', service._id)
    try {
      const { data } = await api.post('/orders', form)
      sessionStorage.setItem(`dwk_order_${data.order.orderId}`, data.accessToken)
      navigate(`/order/${data.order.orderId}`)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not submit your booking. Please check the details and try again.')
    } finally { setBusy(false) }
  }
  if (!service) return <div className="page-wrap"><PageIntro eyebrow="BOOK A PROJECT" title="Service not found." copy="Choose one of our current services to start a booking." /><Link className="button button-light" to="/services">View services <ArrowRight size={16} /></Link></div>
  return <div className="page-wrap booking-page"><PageIntro eyebrow="LET'S MAKE SOMETHING" title={<>Request {service.title}<span className="period">.</span></>} copy="Share a little about your project and the best way to reach you." />
    <form className="form-panel booking-form" onSubmit={submit}><div className="form-section-label"><span>01</span><div><b>Your details</b><small>Who should we be in touch with?</small></div></div><div className="form-grid"><label>Full name<input required name="customerName" autoComplete="name" placeholder="Your name" maxLength="100" /></label><label>Email address<input required type="email" name="customerEmail" autoComplete="email" placeholder="you@example.com" maxLength="254" /></label><label>Phone / WhatsApp<input required type="tel" name="customerPhone" autoComplete="tel" placeholder="+91 98765 43210" maxLength="20" /></label><label>Selected service<input value={service.title} readOnly /></label></div><div className="form-section-label"><span>02</span><div><b>Tell me about it</b><small>A few details help us get started.</small></div></div><label>Project requirements<textarea required name="requirements" rows="5" maxLength="3000" placeholder="What are you looking to create? Goals, audience, references—anything helpful." /></label><label className="upload-field"><UploadCloud size={19} /><span><b>Reference files <small>(optional)</small></b><small>Images or PDFs, up to 5 MB each</small></span><input type="file" name="references" accept="image/jpeg,image/png,image/webp,application/pdf" multiple /></label>{error && <div className="form-error">{error}</div>}<button className="button button-light submit-button" disabled={busy}>{busy ? 'Submitting…' : 'Submit project request'} <ArrowRight size={17} /></button></form>
  </div>
}

export function OrderStatusPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [accessToken] = useState(() => sessionStorage.getItem(`dwk_order_${orderId}`) || '')
  useEffect(() => {
    if (!accessToken) return
    api.get(`/orders/${orderId}`, { headers: { 'X-Order-Access': accessToken } }).then(({ data }) => setOrder(data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to retrieve this request.'))
  }, [orderId, accessToken])
  if (!accessToken) return <div className="page-wrap"><PageIntro eyebrow="PROJECT REQUEST" title="Request details are private." copy="Open this page in the browser session used to submit the request." /><Link className="button button-light" to="/services">Back to services</Link></div>
  if (error) return <div className="page-wrap"><PageIntro eyebrow="PROJECT REQUEST" title="Unable to load request." copy={error} /><Link className="button button-light" to="/services">Back to services</Link></div>
  if (!order) return <div className="page-wrap"><PageIntro eyebrow="PROJECT REQUEST" title="Loading your request…" /></div>
  return <div className="page-wrap"><PageIntro eyebrow={`REQUEST ${order.orderId}`} title={<>Your request is<br />with the studio<span className="period">.</span></>} copy="Thanks for reaching out. Karan will review your project details and follow up with you." /><section className="request-status-card"><span className="eyebrow">CURRENT STATUS</span><strong className="status-pill">{order.status}</strong><p><b>Service:</b> {order.serviceName}</p><p>Keep this request ID for your records: <b>{order.orderId}</b></p><Link className="text-link" to="/">Back to home <ArrowRight size={15} /></Link></section></div>
}

export function ContactPage() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState({})
  const [serviceOptions, setServiceOptions] = useState(sampleServices)
  useEffect(() => {
    getPublic('/settings', {}).then(setSettings)
    getPublic('/services', sampleServices).then((items) => { if (items?.length) setServiceOptions(items) })
  }, [])
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try { await api.post('/contact', values); setSent(true) }
    catch (requestError) { setError(requestError.response?.data?.message || 'Message could not be sent. Please try again, or contact me on Instagram.') }
    finally { setBusy(false) }
  }
  return <div className="page-wrap"><PageIntro eyebrow="HAVE SOMETHING IN MIND?" title={<>Let&apos;s talk<br />about it<span className="period">.</span></>} copy="Tell me what you’re working on. A rough idea, a specific brief, or just a hello—I’m all ears." />
    <div className="contact-layout"><div className="contact-direct"><span className="eyebrow">A DIRECT LINE</span><a href={settings.instagramUrl || instagramUrl} target="_blank" rel="noreferrer"><Camera size={18} /> Instagram <ArrowUpRight size={16} /></a>{settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail} <ArrowUpRight size={16} /></a> : <span className="email-placeholder">Email · to be configured</span>}{settings.whatsappNumber ? <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={16} /></a> : <span className="email-placeholder">WhatsApp · to be configured</span>}<small>Configure contact details from the admin dashboard.</small></div><form className="form-panel contact-form" onSubmit={submit}>{sent ? <div className="success-panel"><span><Check size={22} /></span><h3>Message sent.</h3><p>Thanks for reaching out. I&apos;ll get back to you soon.</p></div> : <><label>Your name<input name="name" required maxLength="100" placeholder="What should I call you?" /></label><div className="form-grid"><label>Email<input type="email" name="email" required maxLength="254" placeholder="you@example.com" /></label><label>Phone / WhatsApp<input type="tel" name="phone" maxLength="20" placeholder="Optional" /></label></div><label>What can I help with?<select name="service" defaultValue=""><option value="">Choose a service</option>{serviceOptions.map((service) => <option key={service._id}>{service.title}</option>)}<option>Something else</option></select></label><label>Your message<textarea name="message" rows="5" required maxLength="3000" placeholder="A little about your project…" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-light" disabled={busy}>{busy ? 'Sending…' : 'Send your message'} <ArrowUpRight size={16} /></button></>}</form></div>
  </div>
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const payload = Object.fromEntries(new FormData(event.currentTarget))
    try { const { data } = await api.post('/auth/login', payload); localStorage.setItem('dwk_admin_token', data.token); navigate('/admin') }
    catch (requestError) { setError(requestError.response?.data?.message || 'Sign in failed.') }
    finally { setBusy(false) }
  }
  return <div className="admin-login"><Link className="wordmark" to="/"><span className="mark">D<span>·</span>K</span><span>DESIGN WITH KARAN<small>STUDIO ADMIN</small></span></Link><form className="form-panel" onSubmit={submit}><span className="eyebrow">STUDIO ACCESS</span><h1>Welcome back.</h1><label>Email address<input type="email" name="email" required autoComplete="username" /></label><label>Password<input type="password" name="password" required autoComplete="current-password" /></label>{error && <div className="form-error">{error}</div>}<button className="button button-light" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16} /></button><small>Admin access only. Create the first admin using the backend setup command.</small></form><Link className="admin-back" to="/">← Back to portfolio</Link></div>
}

export function AdminPage() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [section, setSection] = useState('Overview')
  const [error, setError] = useState('')
  useEffect(() => { api.get('/admin/overview').then(({ data: result }) => setData(result)).catch((requestError) => { setError(requestError.response?.data?.message || 'Admin session expired.'); localStorage.removeItem('dwk_admin_token') }) }, [])
  function logout() { localStorage.removeItem('dwk_admin_token'); navigate('/admin/login') }
  if (!localStorage.getItem('dwk_admin_token')) return <AdminLoginPage />
  if (error) return <div className="admin-login"><div className="form-panel"><h2>Session ended</h2><p>{error}</p><Link to="/admin/login" className="button button-light">Sign in again</Link></div></div>
  if (!data) return <div className="admin-login"><p>Loading studio…</p></div>
  const sections = ['Overview', 'Orders', 'Services', 'Projects', 'Videos', 'Testimonials', 'Messages', 'Settings']
  async function reloadOverview() {
    const { data: next } = await api.get('/admin/overview')
    setData(next)
  }
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="wordmark" to="/"><span className="mark">D<span>·</span>K</span><span>DESIGN WITH KARAN<small>STUDIO ADMIN</small></span></Link><nav>{sections.map((name) => <button className={section === name ? 'active' : ''} key={name} onClick={() => setSection(name)}>{name}</button>)}</nav><button className="admin-logout" onClick={logout}>Sign out ↗</button></aside><main className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">STUDIO DASHBOARD</span><h1>{section}</h1></div><span className="admin-live"><i /> Connected</span></div>{section === 'Overview' ? <><div className="stats-grid">{[['Total requests',data.totalOrders],['New requests',data.newRequests],['Active projects',data.activeProjects],['Completed requests',data.completedOrders]].map(([label,value])=><div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><AdminOrders orders={data.recentOrders || []} onUpdate={reloadOverview} /></> : <AdminSection name={section} />}
    </main></div>
}

function AdminOrders({ orders, onUpdate }) {
  const [statusOverrides, setStatusOverrides] = useState({})
  const currentOrders = orders.map((order) => ({ ...order, status: statusOverrides[order.orderId] || order.status }))
  const [message, setMessage] = useState('')
  const [detail, setDetail] = useState(null)
  async function changeStatus(orderId, status) {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status })
      setStatusOverrides((current) => ({ ...current, [orderId]: data.status }))
      setDetail((current) => current?.orderId === orderId ? { ...current, status: data.status } : current)
      setMessage(`${orderId} updated to ${data.status}.`)
      if (onUpdate) {
        try { await onUpdate() }
        catch { setMessage(`${orderId} was updated, but dashboard totals could not be refreshed.`) }
      }
    }
    catch (error) { setMessage(error.response?.data?.message || 'Could not update order.') }
  }
  async function showDetails(orderId) {
    try { const { data } = await api.get(`/orders/admin/${orderId}`); setDetail(data) }
    catch (error) { setMessage(error.response?.data?.message || 'Could not load order details.') }
  }
  const adminStatuses = ['New Request', 'Accepted', 'In Progress', 'Revision', 'Completed', 'Cancelled']
  return <section className="admin-table-wrap"><div className="admin-table-heading"><h2>Recent requests</h2><span>Latest customer requests</span></div>{message && <p className="admin-message">{message}</p>}<div className="admin-table-scroll"><table><thead><tr><th>Request</th><th>Customer</th><th>Service</th><th>Status</th><th>Details</th><th>Update status</th></tr></thead><tbody>{currentOrders.map((order) => <tr key={order._id}><td>{order.orderId}</td><td>{order.customerName}<small>{order.customerEmail}</small></td><td>{order.serviceName || order.service?.title}</td><td><span className="status-pill">{order.status}</span></td><td><button className="admin-detail-button" onClick={() => showDetails(order.orderId)}>View</button></td><td><select value={order.status} onChange={(event) => changeStatus(order.orderId, event.target.value)}>{adminStatuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table>{!currentOrders.length && <p className="empty-state">No requests yet. New customer requests will appear here.</p>}</div>{detail && <div className="modal-backdrop" onClick={() => setDetail(null)} role="presentation"><section className="project-modal order-detail-modal" role="dialog" aria-modal="true" aria-label={`Request ${detail.orderId}`} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setDetail(null)} aria-label="Close"><span>×</span></button><div className="modal-info"><span className="eyebrow">{detail.orderId} · {detail.status}</span><h2>{detail.customerName}</h2><p>{detail.customerEmail} · {detail.customerPhone}</p><p><b>{detail.serviceName}</b></p><h3>Project requirements</h3><p className="order-requirements">{detail.requirements}</p>{detail.references?.length > 0 && <div className="order-references"><b>Reference files</b>{detail.references.map((file) => <a href={file.url} target="_blank" rel="noreferrer" key={file.publicId || file.url}>{file.originalName || 'Open reference'} ↗</a>)}</div>}</div></section></div>}</section>
}

function AdminSection({ name }) {
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  const paths = { Orders: '/orders/admin/all', Services: '/services/admin/all', Projects: '/projects/admin/all', Videos: '/videos/admin/all', Testimonials: '/testimonials/admin/all', Messages: '/contact/admin/all', Settings: '/settings' }
  const listPath = paths[name]
  const loadItems = useCallback(async () => {
    try { const { data } = await api.get(listPath); setItems(Array.isArray(data) ? data : [data]) }
    catch (error) { setMessage(error.response?.data?.message || `Unable to load ${name.toLowerCase()}.`) }
  }, [listPath, name])
  useEffect(() => {
    api.get(listPath).then(({ data }) => setItems(Array.isArray(data) ? data : [data]))
      .catch((error) => setMessage(error.response?.data?.message || `Unable to load ${name.toLowerCase()}.`))
  }, [listPath, name])
  if (name === 'Orders') return <AdminOrders orders={items} />
  return <section className="admin-table-wrap"><div className="admin-table-heading"><h2>{name} management</h2><span>Changes require a valid admin session.</span></div>{message && <p className="admin-message">{message}</p>}{name === 'Settings' ? <SettingsForm settings={items[0] || {}} /> : ['Services', 'Projects', 'Videos', 'Testimonials'].includes(name) ? <AdminContentManager name={name} items={items} reload={loadItems} /> : <ContactManager items={items} reload={loadItems} />}</section>
}

function SettingsForm({ settings }) {
  const [message, setMessage] = useState('')
  async function save(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    try { await api.put('/settings', values); setMessage('Settings saved.') }
    catch (error) { setMessage(error.response?.data?.message || 'Settings could not be saved.') }
  }
  return <form className="admin-settings" onSubmit={save}><label>Brand name<input name="brandName" defaultValue={settings.brandName || 'Design With Karan'} /></label><label>Instagram URL<input name="instagramUrl" defaultValue={settings.instagramUrl || instagramUrl} /></label><label>Contact email<input type="email" name="contactEmail" defaultValue={settings.contactEmail || ''} placeholder="Add your actual email before launch" /></label><label>WhatsApp number<input name="whatsappNumber" defaultValue={settings.whatsappNumber || ''} /></label>{message && <p>{message}</p>}<button className="button button-light">Save settings</button></form>
}

function AdminContentManager({ name, items, reload }) {
  const [editing, setEditing] = useState('')
  const [message, setMessage] = useState('')
  const [creating, setCreating] = useState(false)
  const config = {
    Services: { endpoint: 'services', imageField: 'image', fields: [['title','Title'],['slug','URL slug'],['description','Description','textarea'],['price','Fixed price (INR)','number'],['deliveryTime','Delivery time']] },
    Projects: { endpoint: 'projects', imageField: 'image', fields: [['title','Title'],['category','Category','project-category'],['description','Description','textarea'],['type','Project type']] },
    Videos: { endpoint: 'videos', imageField: 'thumbnail', fields: [['title','Title'],['category','Category','video-category'],['description','Description','textarea'],['youtubeUrl','YouTube URL'],['instagramUrl','Instagram URL']] },
    Testimonials: { endpoint: 'testimonials', fields: [['name','Client name'],['role','Role / company'],['quote','Quote','textarea']] },
  }[name]
  async function remove(item) {
    if (!window.confirm(`Delete "${item.title || item.name}"?`)) return
    try { await api.delete(`/${config.endpoint}/${item._id}`); await reload(); setMessage('Item deleted.') }
    catch (error) { setMessage(error.response?.data?.message || 'Could not delete this item.') }
  }
  return <div className="admin-content-manager"><div className="admin-content-top"><button className="button button-outline" onClick={() => { setEditing(''); setCreating(!creating) }}>{creating ? 'Close form' : `Add ${name.slice(0, -1)}`}</button>{message && <span>{message}</span>}</div>{creating && <ContentEditor name={name} config={config} onCancel={() => setCreating(false)} onSave={async (values, file) => { try { await saveContent(name, config, values, file); setCreating(false); setMessage('New item added.'); await reload() } catch (error) { setMessage(error.response?.data?.message || 'Could not save this item.') } }} />}{items.map((item) => <article className="admin-item-card" key={item._id}><div className="admin-item-summary"><b>{item.title || item.name}</b><span>{item.category || item.role || (item.active === false || item.published === false ? 'Unpublished' : 'Published')}{name === 'Services' ? ` · ${formatINR(item.price)} · ${item.deliveryTime}` : ''}</span><div className="admin-item-actions"><button onClick={() => setEditing(editing === item._id ? '' : item._id)}>{editing === item._id ? 'Close' : 'Edit'}</button><button onClick={() => remove(item)}>Delete</button></div></div>{editing === item._id && <ContentEditor name={name} config={config} item={item} onCancel={() => setEditing('')} onSave={async (values, file) => { try { await saveContent(name, config, values, file, item._id); setEditing(''); setMessage('Changes saved.'); await reload() } catch (error) { setMessage(error.response?.data?.message || 'Could not save changes.') } }} />}</article>)}</div>
}

async function saveContent(name, config, values, file, id) {
  const method = id ? 'patch' : 'post'
  if (name === 'Testimonials') return api[method](`/${config.endpoint}${id ? `/${id}` : ''}`, values)
  const body = new FormData()
  Object.entries(values).forEach(([key, value]) => body.append(key, value))
  if (file) body.append(config.imageField, file)
  return api[method](`/${config.endpoint}${id ? `/${id}` : ''}`, body)
}

function ContentEditor({ name, config, item = {}, onSave, onCancel }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(config.fields.map(([field]) => [field, formData.get(field) || '']))
    for (const field of ['active', 'published']) if (publishedField === field) values[field] = formData.has(field)
    const file = formData.get(config.imageField)
    try { await onSave(values, file instanceof File && file.size ? file : null) }
    catch (requestError) { setError(requestError.response?.data?.message || 'Could not save changes.') }
    finally { setBusy(false) }
  }
  const publishedField = name === 'Services' ? 'active' : (name === 'Testimonials' || name === 'Projects' || name === 'Videos') ? 'published' : null
  return <form className="admin-editor" onSubmit={submit}><div className="admin-editor-grid">{config.fields.map(([field,label,kind])=><label key={field}>{label}{kind === 'textarea' ? <textarea name={field} defaultValue={item[field] || ''} required={field !== 'description'} maxLength={3000} /> : kind?.endsWith('category') ? <select name={field} defaultValue={item[field] || ''} required><option value="" disabled>Select category</option>{(kind === 'project-category' ? categories.slice(1) : ['Instagram Reels','Video Editing','Motion Graphics','Promotional Videos','YouTube Videos']).map((category)=><option key={category}>{category}</option>)}</select> : <input name={field} type={kind || 'text'} defaultValue={item[field] ?? ''} required={['title','name','price','deliveryTime','category','role','quote'].includes(field)} maxLength={field === 'description' || field === 'quote' ? 3000 : 500} />}</label>)}{config.imageField && <label>Image / thumbnail<input type="file" name={config.imageField} accept="image/jpeg,image/png,image/webp" required={!item._id && !item.image?.url && !item.thumbnail?.url} />{(item.image?.url || item.thumbnail?.url) && <small>Leave blank to keep the current image.</small>}</label>}{publishedField && <label className="admin-checkbox"><input type="checkbox" name={publishedField} defaultChecked={item[publishedField] ?? (name !== 'Testimonials')} /> Published / active</label>}</div>{error && <p className="form-error">{error}</p>}<div className="admin-item-actions"><button className="button button-light" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button><button type="button" className="button button-outline" onClick={onCancel}>Cancel</button></div></form>
}

function ContactManager({ items, reload }) {
  const [message, setMessage] = useState('')
  async function update(contactId, status) {
    try { await api.patch(`/contact/${contactId}`, { status }); await reload(); setMessage('Contact status updated.') }
    catch (error) { setMessage(error.response?.data?.message || 'Could not update contact.') }
  }
  return <div className="admin-simple-list">{message && <p className="admin-message">{message}</p>}{items.map((contact) => <article key={contact._id}><b>{contact.name} · {contact.email}</b><span>{contact.phone} · {contact.service} · {contact.message}</span><select value={contact.status} onChange={(event) => update(contact._id, event.target.value)}>{['New','Read','Archived'].map((status)=><option key={status}>{status}</option>)}</select></article>)}{!items.length && <p className="empty-state">No contact messages yet.</p>}</div>
}

export function NotFoundPage() {
  return <div className="page-wrap"><PageIntro eyebrow="404 · THAT'S A LITTLE AWKWARD" title={<>This page<br />took a detour<span className="period">.</span></>} copy="The link may have moved. The good news is there’s plenty of other good stuff to see." /><Link to="/" className="button button-light">Take me home <ArrowRight size={16} /></Link></div>
}
