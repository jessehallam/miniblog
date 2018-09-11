import express from 'express'

import { Options } from '.'
import BlogEngine from './engine'

export function create(options: Options) {
    const router = express.Router()
    const engine = new BlogEngine(options)

    router.get('/api/blog/posts', async (req, res) => {
        res.json(await engine.getPosts())
    })

    router.get('/api/blog/post/:id', async (req, res) => {
        res.json({ })
    })

    return router
}