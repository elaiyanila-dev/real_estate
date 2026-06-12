import express from 'express'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import { properties, inquiries, favorites } from '../data/db.js'

const router = express.Router()

router.use(authenticateToken, requireRole('user'))

router.get('/browse', (req, res) => res.json(properties))
router.get('/favorites', (req, res) => favorites.filter((item) => item.userId === req.user.id))
router.get('/inquiries', (req, res) => inquiries.filter((item) => item.userId === req.user.id))
router.get('/profile', (req, res) => res.json({ message: 'User profile settings available' }))

export default router
