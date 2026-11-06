import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, CirclePlay, Clapperboard, Layers3, PenTool, Play, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { imageConfig } from '../imageConfig'
import { placeholderStats } from '../data'

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: .65, ease: [.22, 1, .36, 1] },
}

const designCategories = [
  { title: 'Brand identity', category: 'Branding', index: '01', image: imageConfig.categories.branding, className: 'category-wide', icon: Sparkles },
  { title: 'Posters & campaigns', category: 'Poster Design', index: '02', image: imageConfig.categories.posters, className: '', icon: PenTool },
  { title: 'Social content', category: 'Social Media', index: '03', image: imageConfig.categories.social, className: '', icon: Layers3 },
  { title: 'Thumbnails & more', category: 'Thumbnail', index: '04', image: imageConfig.categories.thumbnails, className: 'category-wide', icon: Clapperboard },
]

export function HomeHero() {
  const [demoOpen, setDemoOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const reduceMotion = useReducedMotion() || isCompact
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const orbX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 70, damping: 22 })
  const orbY = useSpring(useTransform(pointerY, [-1, 1], [-8, 8]), { stiffness: 70, damping: 22 })
  const stagger = reduceMotion ? 0 : .12

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 650px)')
    const updateCompactMode = () => setIsCompact(mediaQuery.matches)
    updateCompactMode()
    mediaQuery.addEventListener('change', updateCompactMode)
    return () => mediaQuery.removeEventListener('change', updateCompactMode)
  }, [])

  function moveVisual(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - .5) * 2)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - .5) * 2)
  }

  function resetVisual() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <>
      <section className="hero hero-redesign" id="home">
        <motion.div className="hero-ambient hero-ambient-one" animate={reduceMotion ? { x: 0, y: 0, scale: 1 } : { x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }} transition={reduceMotion ? { duration: 0 } : { duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="hero-ambient hero-ambient-two" animate={reduceMotion ? { x: 0, y: 0 } : { x: [0, -18, 0], y: [0, 22, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 16, repeat: Infinity, ease: 'easeInOut' }} />

        <motion.div
          className="hero-visual"
          onPointerMove={moveVisual}
          onPointerLeave={resetVisual}
          initial={{ opacity: 0, scale: .96, x: -18 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: .9, ease: [.22, 1, .36, 1] }}
        >
          <div className="workspace-frame">
            <img
  src="/images/karan-working.png"
  alt="Karan Maddeshiya working as a graphic designer"
  fetchPriority="high"
/>
            <div className="workspace-vignette" />
            <div className="workspace-label"><span className="live-dot" /> THE CREATIVE SPACE <span>01 / 04</span></div>
            <motion.div className="workspace-orbit orbit-a" animate={reduceMotion ? { rotate: -31 } : { rotate: 360 }} transition={reduceMotion ? { duration: 0 } : { duration: 42, ease: 'linear', repeat: Infinity }} />
            <motion.div className="workspace-orbit orbit-b" animate={reduceMotion ? { rotate: 38 } : { rotate: -360 }} transition={reduceMotion ? { duration: 0 } : { duration: 54, ease: 'linear', repeat: Infinity }} />
            <motion.div className="software-badge software-ps" animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, -8, 0], rotate: [0, 2, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}><b>Ps</b><span>PHOTOSHOP</span></motion.div>
            <motion.div className="software-badge software-ai" animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, 7, 0], rotate: [0, -2, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: .4 }}><b>Ai</b><span>ILLUSTRATOR</span></motion.div>
            <motion.div className="software-badge software-pr" animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, -6, 0], rotate: [0, 2, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 5.6, repeat: Infinity, ease: 'easeInOut', delay: .8 }}><b>Pr</b><span>PREMIERE PRO</span></motion.div>
            <motion.div className="shape-cube" style={{ x: orbX, y: orbY }} animate={reduceMotion ? { rotate: 33, scale: 1 } : { rotate: [0, 45, 90], scale: [1, 1.08, 1] }} transition={reduceMotion ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="shape-sphere" animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, 9, 0], rotate: [0, 18, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
          <div className="visual-caption"><span>MADE OF IDEAS & A LITTLE TOO MUCH COFFEE</span><span>INDIA · EVERYWHERE</span></div>
        </motion.div>

        <div className="hero-copy hero-copy-redesign">
          <motion.div className="availability availability-redesign" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger, duration: .5 }}>
            <span className="availability-pulse" /> FREELANCE GRAPHIC DESIGNER <i /> AVAILABLE FOR PROJECTS
          </motion.div>
          <h1 className="hero-title">
            <motion.span initial={{ opacity: 0, y: '110%' }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger * 1.5, duration: .75, ease: [.22, 1, .36, 1] }}>Ideas made</motion.span>
            <motion.span className="hero-title-accent" initial={{ opacity: 0, y: '110%' }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger * 2.5, duration: .75, ease: [.22, 1, .36, 1] }}>impossible</motion.span>
            <motion.span initial={{ opacity: 0, y: '110%' }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger * 3.5, duration: .75, ease: [.22, 1, .36, 1] }}>to ignore<span className="title-period">.</span></motion.span>
          </h1>
          <motion.p className="hero-description" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger * 4.5, duration: .65 }}>
            Transforming ideas into stunning visuals. I design bold, creative and memorable graphics that leave an impact.
          </motion.p>
          <motion.div className="hero-actions hero-actions-redesign" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger * 5, duration: .65 }}>
            <Link className="button button-glow" to="/work">Explore My Work <ArrowUpRight size={17} /></Link>
            <button className="button button-video" type="button" onClick={() => setDemoOpen(true)}><span><Play size={13} fill="currentColor" /></span> Watch Demo</button>
          </motion.div>
          <motion.div className="hero-signoff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: stagger * 6, duration: .7 }}>
            <span className="signoff-rule" />
            <span>Thoughtful design, with a little more feeling.</span>
          </motion.div>
        </div>
        <a className="hero-scroll" href="#about"><span>SCROLL TO EXPLORE</span><motion.i animate={reduceMotion ? { y: 0 } : { y: [0, 7, 0] }} transition={reduceMotion ? { duration: 0 } : { duration: 1.5, repeat: Infinity }}><ArrowDown size={15} /></motion.i></a>
      </section>

      <AnimatePresence>
        {demoOpen && <motion.div className="modal-backdrop hero-demo-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDemoOpen(false)} role="presentation">
          <motion.section className="video-modal hero-demo-modal" role="dialog" aria-modal="true" aria-label="Watch Karan's design demo" initial={{ opacity: 0, y: 22, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setDemoOpen(false)} aria-label="Close demo"><X /></button>
            <iframe src={imageConfig.demoVideoUrl} title="Design With Karan demo video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </>
  )
}

export function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="Studio statistics placeholder">
      {placeholderStats.map((stat, index) => <div className="stat-item" key={stat.label}><span className="stat-index">0{index + 1}</span><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      <p className="stats-disclaimer">Sample figures · replace with confirmed studio numbers before publishing</p>
    </section>
  )
}

export function AboutPreview() {
  return (
    <section className="home-about section-pad" id="about">
      <div className="about-preview-image">
        <img src={imageConfig.profilePortrait} alt="Karan Maddeshiya - Graphic Designer" loading="eager" />
        <div className="about-image-note"><span>INDEPENDENT DESIGNER</span><b>KARAN<br />MADDESHIYA</b><ArrowUpRight size={18} /></div>
        <div className="about-image-index">DESIGN WITH INTENTION · EST. INDIA</div>
      </div>
      <motion.div className="about-preview-copy" {...reveal}>
        <span className="eyebrow eyebrow-line">A LITTLE ABOUT ME</span>
        <h2>Design that feels<br />like <span>you.</span></h2>
        <p>I’m Karan Maddeshiya, an independent graphic designer partnering with people who care about what they put into the world. I bring ideas to life with thoughtful identity, expressive visuals and craft in every detail.</p>
        <p>Good work starts with a good conversation—and gets better when we make it together.</p>
        <Link className="underlined-link" to="/about">Get to know me <ArrowRight size={16} /></Link>
      </motion.div>
    </section>
  )
}

export function CategoryShowcase() {
  return (
    <section className="category-section section-pad" id="categories">
      <motion.div {...reveal} className="section-heading redesign-heading">
        <div><span className="eyebrow eyebrow-line">A FEW WAYS TO MAKE AN IMPACT</span><h2>Different canvas.<br /><span>Same intention.</span></h2></div>
        <p>From the first sketch to the final frame, every piece has a point of view.</p>
      </motion.div>
      <div className="category-grid">
        {designCategories.map((item, index) => <motion.div key={item.category} className={`category-card ${item.className}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08, duration: .6 }}>
          <Link to={`/work?category=${encodeURIComponent(item.category)}`}>
            <img src={item.image} alt={`${item.title} design work`} loading="lazy" />
            <div className="category-shade" />
            <span className="category-index">{item.index} / 04</span>
            <span className="category-icon"><item.icon size={17} /></span>
            <div className="category-card-title"><small>GRAPHIC DESIGN</small><h3>{item.title}</h3></div>
            <span className="category-arrow"><ArrowUpRight size={18} /></span>
          </Link>
        </motion.div>)}
      </div>
    </section>
  )
}

export function ProcessShowcase() {
  const steps = [
    ['01', 'Listen closely', 'First, I get to know you, your audience and what success actually looks like.'],
    ['02', 'Find the idea', 'Research, references and concepts help us find a direction worth pursuing.'],
    ['03', 'Make it matter', 'We shape the chosen idea into clear, confident and considered creative.'],
    ['04', 'Ready for real life', 'The final details, formats and files—prepared for wherever the work goes next.'],
  ]
  return (
    <section className="process-showcase section-pad" id="process">
      <motion.div className="process-intro" {...reveal}><span className="eyebrow eyebrow-line">GOOD WORK, GOOD PROCESS</span><h2>Less guesswork.<br /><span>More good work.</span></h2><p>A collaborative process, with clear steps and room for the best ideas to show up.</p></motion.div>
      <div className="process-showcase-grid">{steps.map(([number, title, copy], index) => <motion.article key={number} {...reveal} transition={{ delay: index * .08, duration: .6 }}><span>{number}</span><div className="process-step-line" /><h3>{title}</h3><p>{copy}</p></motion.article>)}</div>
    </section>
  )
}

export function TestimonialShowcase({ items = [] }) {
  return (
    <section className="testimonial-showcase section-pad" id="testimonials">
      <motion.div className="section-heading redesign-heading" {...reveal}>
        <div><span className="eyebrow eyebrow-line">GOOD PEOPLE, GOOD WORK</span><h2>Kind words<br />from <span>good people.</span></h2></div>
        <p>Thoughtful collaboration is always a two-way street.</p>
      </motion.div>
      {items.length > 0
        ? <div className="testimonial-grid">{items.slice(0, 3).map((item) => <motion.article key={item._id} {...reveal}><span className="testimonial-mark">“</span><p>{item.quote}</p><div><b>{item.name}</b><small>{item.role}</small></div></motion.article>)}</div>
        : <div className="testimonial-empty"><span className="testimonial-mark">✳</span><div><b>The best work is made together.</b><p>Client stories will appear here as they’re shared.</p></div><Link to="/contact">Start a conversation <ArrowUpRight size={15} /></Link></div>}
    </section>
  )
}

export function ContactShowcase() {
  return (
    <section className="contact-banner contact-banner-redesign" id="contact">
      <div className="contact-banner-orb" />
      <div className="contact-banner-content"><span className="eyebrow eyebrow-line">GOT A GOOD ONE?</span><h2>Let’s make<br />some <span>noise.</span></h2><p>Tell me what you’re dreaming up. We’ll take it from there.</p><Link className="button button-glow" to="/contact">Let’s talk about it <ArrowUpRight size={17} /></Link></div>
      <div className="contact-banner-stamp"><CirclePlay size={25} /><span>OPEN FOR<br />SELECT PROJECTS</span></div>
    </section>
  )
}
