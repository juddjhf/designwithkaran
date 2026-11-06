import { X, ArrowUpRight } from 'lucide-react'
import { resolveImage } from '../imageConfig'

export function ProjectModal({ item, onClose }) {
  if (!item) return null
  const image = resolveImage(item.image)
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-label={item.title} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X /></button>
        <img src={image} alt={item.title} />
        <div className="modal-info"><span className="eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.description || 'A considered visual concept, developed with clarity, character and purpose.'}</p><a href="https://www.instagram.com/designwith.karan/" target="_blank" rel="noreferrer">See more work <ArrowUpRight size={16} /></a></div>
      </section>
    </div>
  )
}
