import Project from '../models/Project.js'
import Service from '../models/Service.js'
import Video from '../models/Video.js'
import Testimonial from '../models/Testimonial.js'
import { uploadBuffer } from '../config/cloudinary.js'

const asBoolean = (value) => value === true || value === 'true'
const allowedProjectCategories = ['Logo Design', 'Branding', 'Poster Design', 'Social Media', 'Thumbnail', 'Banner', 'Advertisement']
const allowedVideoCategories = ['Instagram Reels', 'Video Editing', 'Motion Graphics', 'Promotional Videos', 'YouTube Videos']
const safeMediaUrl = (value) => typeof value === 'string' && /^https:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com)\//i.test(value)
const createMedia = async (file, folder, fallbackUrl) => {
  if (file) return uploadBuffer(file.buffer, { folder })
  if (typeof fallbackUrl === 'string' && /^https:\/\/.+/.test(fallbackUrl)) return { url: fallbackUrl, publicId: '' }
  throw Object.assign(new Error('A valid image upload is required.'), { statusCode: 400 })
}

export async function listProjects(request, response) {
  response.json(await Project.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function listAllProjects(request, response) {
  response.json(await Project.find().sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function createProject(request, response) {
  const image = await createMedia(request.file, 'projects', request.body.imageUrl)
  const project = await Project.create({
    title: request.body.title,
    category: request.body.category,
    description: request.body.description,
    type: request.body.type,
    image,
    published: request.body.published === undefined ? true : asBoolean(request.body.published),
    sortOrder: Number(request.body.sortOrder || 0),
  })
  response.status(201).json(project)
}

export async function updateProject(request, response) {
  const project = await Project.findById(request.params.id)
  if (!project) return response.status(404).json({ message: 'Project not found.' })
  const fields = ['title', 'category', 'description', 'type']
  for (const field of fields) if (request.body[field] !== undefined) project[field] = request.body[field]
  if (request.body.published !== undefined) project.published = asBoolean(request.body.published)
  if (request.body.sortOrder !== undefined) project.sortOrder = Number(request.body.sortOrder)
  if (request.file || request.body.imageUrl) project.image = await createMedia(request.file, 'projects', request.body.imageUrl)
  await project.save()
  response.json(project)
}

export async function deleteProject(request, response) {
  const result = await Project.findByIdAndDelete(request.params.id)
  if (!result) return response.status(404).json({ message: 'Project not found.' })
  response.status(204).end()
}

export async function listServices(request, response) {
  response.json(await Service.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function listAllServices(request, response) {
  response.json(await Service.find().sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function createService(request, response) {
  const price = Number(request.body.price)
  if (!Number.isSafeInteger(price) || price < 1) return response.status(400).json({ message: 'Price must be a positive whole number of rupees.' })
  const slug = String(request.body.slug || request.body.title || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const image = await createMedia(request.file, 'services', request.body.imageUrl)
  const service = await Service.create({ ...request.body, slug, price, image, active: request.body.active === undefined ? true : asBoolean(request.body.active), sortOrder: Number(request.body.sortOrder || 0) })
  response.status(201).json(service)
}

export async function updateService(request, response) {
  const service = await Service.findById(request.params.id)
  if (!service) return response.status(404).json({ message: 'Service not found.' })
  if (request.body.price !== undefined) {
    const price = Number(request.body.price)
    if (!Number.isSafeInteger(price) || price < 1) return response.status(400).json({ message: 'Price must be a positive whole number of rupees.' })
    service.price = price
  }
  for (const field of ['title', 'slug', 'description', 'deliveryTime']) if (request.body[field] !== undefined) service[field] = request.body[field]
  if (request.body.active !== undefined) service.active = asBoolean(request.body.active)
  if (request.body.sortOrder !== undefined) service.sortOrder = Number(request.body.sortOrder)
  if (request.file || request.body.imageUrl) service.image = await createMedia(request.file, 'services', request.body.imageUrl)
  await service.save()
  response.json(service)
}

export async function deleteService(request, response) {
  const result = await Service.findByIdAndDelete(request.params.id)
  if (!result) return response.status(404).json({ message: 'Service not found.' })
  response.status(204).end()
}

export async function listVideos(request, response) {
  response.json(await Video.find({ published: true }).sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function listAllVideos(request, response) {
  response.json(await Video.find().sort({ sortOrder: 1, createdAt: -1 }).lean())
}

export async function createVideo(request, response) {
  const videoUrls = [request.body.youtubeUrl, request.body.instagramUrl].filter(Boolean)
  if (videoUrls.some((url) => !safeMediaUrl(url))) return response.status(400).json({ message: 'Video links must use YouTube or Instagram.' })
  const thumbnail = await createMedia(request.file, 'video-thumbnails', request.body.thumbnailUrl)
  const video = await Video.create({
    title: request.body.title,
    category: request.body.category,
    description: request.body.description,
    thumbnail,
    youtubeUrl: request.body.youtubeUrl || '',
    instagramUrl: request.body.instagramUrl || '',
    published: request.body.published === undefined ? true : asBoolean(request.body.published),
    sortOrder: Number(request.body.sortOrder || 0),
  })
  response.status(201).json(video)
}

export async function updateVideo(request, response) {
  const video = await Video.findById(request.params.id)
  if (!video) return response.status(404).json({ message: 'Video not found.' })
  for (const field of ['title', 'category', 'description']) if (request.body[field] !== undefined) video[field] = request.body[field]
  for (const field of ['youtubeUrl', 'instagramUrl']) {
    if (request.body[field] !== undefined) {
      if (request.body[field] && !safeMediaUrl(request.body[field])) return response.status(400).json({ message: 'Video links must use YouTube or Instagram.' })
      video[field] = request.body[field]
    }
  }
  if (request.body.published !== undefined) video.published = asBoolean(request.body.published)
  if (request.body.sortOrder !== undefined) video.sortOrder = Number(request.body.sortOrder)
  if (request.file || request.body.thumbnailUrl) video.thumbnail = await createMedia(request.file, 'video-thumbnails', request.body.thumbnailUrl)
  await video.save()
  response.json(video)
}

export async function deleteVideo(request, response) {
  const result = await Video.findByIdAndDelete(request.params.id)
  if (!result) return response.status(404).json({ message: 'Video not found.' })
  response.status(204).end()
}

export async function listTestimonials(request, response) {
  response.json(await Testimonial.find({ published: true }).sort({ createdAt: -1 }).lean())
}

export async function listAllTestimonials(request, response) {
  response.json(await Testimonial.find().sort({ createdAt: -1 }).lean())
}

export async function createTestimonial(request, response) {
  response.status(201).json(await Testimonial.create({ name: request.body.name, role: request.body.role, quote: request.body.quote, published: asBoolean(request.body.published) }))
}

export async function updateTestimonial(request, response) {
  const testimonial = await Testimonial.findByIdAndUpdate(request.params.id, {
    $set: {
      ...(request.body.name !== undefined && { name: request.body.name }),
      ...(request.body.role !== undefined && { role: request.body.role }),
      ...(request.body.quote !== undefined && { quote: request.body.quote }),
      ...(request.body.published !== undefined && { published: asBoolean(request.body.published) }),
    },
  }, { new: true, runValidators: true })
  if (!testimonial) return response.status(404).json({ message: 'Testimonial not found.' })
  response.json(testimonial)
}

export async function deleteTestimonial(request, response) {
  const result = await Testimonial.findByIdAndDelete(request.params.id)
  if (!result) return response.status(404).json({ message: 'Testimonial not found.' })
  response.status(204).end()
}

export const validProjectCategory = (category) => allowedProjectCategories.includes(category)
export const validVideoCategory = (category) => allowedVideoCategories.includes(category)
