import { ArrowUpRight } from 'lucide-react'
import { resolveImage } from '../imageConfig'

export function ProjectCard({ project, onClick }) {
  const image = resolveImage(project.image)
  return (
    <button className={`project-card ${project.color || ''}`} onClick={onClick} type="button">
      <div className="project-image"><img src={image} alt={project.title} loading="lazy" /><span className="project-open"><ArrowUpRight size={20} /></span></div>
      <div className="project-meta"><div><span className="eyebrow">{project.category}</span><h3>{project.title}</h3></div><span className="project-type">{project.type || 'Creative direction'}</span></div>
    </button>
  )
}
