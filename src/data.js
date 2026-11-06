import { imageConfig } from './imageConfig'

export const instagramUrl = 'https://www.instagram.com/designwith.karan/'

export const categories = ['All', 'Logo Design', 'Branding', 'Poster Design', 'Social Media', 'Thumbnail', 'Banner', 'Advertisement']

export const projects = [
  { title: 'After Hours', category: 'Poster Design', type: 'Campaign artwork', image: imageConfig.categories.posters, color: 'violet' },
  { title: 'NŌVA Studio', category: 'Branding', type: 'Visual identity', image: imageConfig.categories.branding, color: 'blue' },
  { title: 'A little louder', category: 'Social Media', type: 'Social campaign', image: imageConfig.categories.social, color: 'pink' },
  { title: 'Midnight motion', category: 'Thumbnail', type: 'YouTube thumbnail', image: imageConfig.categories.thumbnails, color: 'orange' },
  { title: 'Common ground', category: 'Logo Design', type: 'Logo & identity', image: imageConfig.aboutWorkspace, color: 'green' },
  { title: 'New frequencies', category: 'Banner', type: 'Digital campaign', image: imageConfig.video.brandMotion, color: 'violet' },
]

export const videos = [
  { title: 'A brand in motion · Demo', category: 'Motion Graphics', image: imageConfig.video.brandMotion, link: imageConfig.demoVideoUrl },
  { title: 'Behind the visual · Demo', category: 'Instagram Reels', image: imageConfig.video.behindScenes, link: imageConfig.demoVideoUrl },
  { title: 'Made to move · Demo', category: 'Promotional Videos', image: imageConfig.categories.social, link: imageConfig.demoVideoUrl },
  { title: 'The edit session · Demo', category: 'Video Editing', image: imageConfig.video.editSession, link: imageConfig.demoVideoUrl },
]

export const services = [
  { _id: 'logo-design', title: 'Logo design', description: 'A distinct mark and thoughtful logo suite that gives your brand a confident start.', price: 2499, deliveryTime: '3–5 days', image: imageConfig.categories.branding },
  { _id: 'social-media-kit', title: 'Social media kit', description: 'Scroll-stopping creative, designed as a consistent system for your social channels.', price: 1799, deliveryTime: '2–4 days', image: imageConfig.categories.social },
  { _id: 'poster-design', title: 'Poster design', description: 'Campaign-ready poster artwork with a strong idea and a polished finish.', price: 1499, deliveryTime: '2–3 days', image: imageConfig.categories.posters },
  { _id: 'youtube-thumbnail', title: 'YouTube thumbnail', description: 'One custom thumbnail built to stand out in a crowded feed.', price: 799, deliveryTime: '1–2 days', image: imageConfig.categories.thumbnails },
]

export const imageUrl = (id, width = 900) => id?.startsWith?.('http') ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
export const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0)

export const placeholderStats = [
  { value: '50+', label: 'Projects created' },
  { value: '30+', label: 'Happy clients' },
  { value: '100%', label: 'Client satisfaction' },
]
