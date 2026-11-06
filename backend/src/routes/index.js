import { Router } from 'express'
import { login } from '../controllers/authController.js'
import {
  createProject, createService, createTestimonial, createVideo, deleteProject, deleteService,
  deleteTestimonial, deleteVideo, listAllProjects, listAllServices, listAllTestimonials,
  listAllVideos, listProjects, listServices, listTestimonials, listVideos, updateProject,
  updateService, updateTestimonial, updateVideo,
} from '../controllers/contentController.js'
import { createOrder, getCustomerOrder, listOrders, orderDetailsAdmin, updateOrderStatus } from '../controllers/orderController.js'
import { createContact, getSettings, listContacts, overview, updateContact, updateSettings } from '../controllers/siteController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import { imageUpload, upload, verifyUploadContent } from '../middleware/uploadMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import rateLimit from 'express-rate-limit'

const router = Router()
const publicWriteLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many requests. Please wait a little and try again.' } })
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many login attempts. Please try again later.' } })

router.post('/auth/login', loginLimit, asyncHandler(login))

router.get('/projects', asyncHandler(listProjects))
router.get('/projects/admin/all', requireAdmin, asyncHandler(listAllProjects))
router.post('/projects', requireAdmin, imageUpload.single('image'), verifyUploadContent, asyncHandler(createProject))
router.patch('/projects/:id', requireAdmin, imageUpload.single('image'), verifyUploadContent, asyncHandler(updateProject))
router.delete('/projects/:id', requireAdmin, asyncHandler(deleteProject))

router.get('/services', asyncHandler(listServices))
router.get('/services/admin/all', requireAdmin, asyncHandler(listAllServices))
router.post('/services', requireAdmin, imageUpload.single('image'), verifyUploadContent, asyncHandler(createService))
router.patch('/services/:id', requireAdmin, imageUpload.single('image'), verifyUploadContent, asyncHandler(updateService))
router.delete('/services/:id', requireAdmin, asyncHandler(deleteService))

router.get('/videos', asyncHandler(listVideos))
router.get('/videos/admin/all', requireAdmin, asyncHandler(listAllVideos))
router.post('/videos', requireAdmin, imageUpload.single('thumbnail'), verifyUploadContent, asyncHandler(createVideo))
router.patch('/videos/:id', requireAdmin, imageUpload.single('thumbnail'), verifyUploadContent, asyncHandler(updateVideo))
router.delete('/videos/:id', requireAdmin, asyncHandler(deleteVideo))

router.get('/testimonials', asyncHandler(listTestimonials))
router.get('/testimonials/admin/all', requireAdmin, asyncHandler(listAllTestimonials))
router.post('/testimonials', requireAdmin, asyncHandler(createTestimonial))
router.patch('/testimonials/:id', requireAdmin, asyncHandler(updateTestimonial))
router.delete('/testimonials/:id', requireAdmin, asyncHandler(deleteTestimonial))

router.post('/orders', publicWriteLimit, upload.array('references', 5), verifyUploadContent, asyncHandler(createOrder))
router.get('/orders/admin/all', requireAdmin, asyncHandler(listOrders))
router.get('/orders/admin/:orderId', requireAdmin, asyncHandler(orderDetailsAdmin))
router.get('/orders/:orderId', asyncHandler(getCustomerOrder))
router.patch('/orders/:orderId/status', requireAdmin, asyncHandler(updateOrderStatus))

router.get('/settings', asyncHandler(getSettings))
router.put('/settings', requireAdmin, asyncHandler(updateSettings))
router.post('/contact', publicWriteLimit, asyncHandler(createContact))
router.get('/contact/admin/all', requireAdmin, asyncHandler(listContacts))
router.patch('/contact/:id', requireAdmin, asyncHandler(updateContact))
router.get('/admin/overview', requireAdmin, asyncHandler(overview))

export default router
