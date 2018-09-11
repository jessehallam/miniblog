import path from 'path'

import { Options } from '.'
import * as io from './io'
import Post from './post'

const DEFAULT_REFRESH_INTERVAL = 1000 * 60 * 5

interface PostQuery {
    per_page?: number
}

class BlogEngine {
    private cache: PostCache
    private options: Options

    constructor(options: Options) {
        this.cache = new PostCache(options)
        this.cache.getPosts()
        this.options = options
    }

    async getPosts(query?: PostQuery) {
        const posts = await this.cache.getPosts()
        return posts
    }
}

class PostCache {
    private options: Options
    private posts?: Post[]
    private updated?: Date
    private updatePromise?: Promise<Post[]> | null

    constructor(options: Options) {
        this.options = options
    }

    getPosts(): Promise<Post[]> {
        if (this.updatePromise) return this.updatePromise
        if (this.posts && arePostsFresh(this.updated, this.options.refresh || DEFAULT_REFRESH_INTERVAL)) return Promise.resolve(this.posts)
        this.options.log('Refreshing post cache.')
        this.updatePromise = new Promise<Post[]>(resolve => {
            const aggregator = new PostAggregator(this.options.path)
            aggregator.posts().then(posts => resolve(posts))
        }).then(posts => {
            this.updated = new Date()
            this.posts = posts
            this.updatePromise = undefined
            return posts
        })
        return this.updatePromise
    }
}

class PostAggregator {
    private root: string

    constructor(root: string) {
        this.root = root
    }

    async posts() {
        const files = io.listFilesRecursive(this.root)
        const posts: Post[] = []

        for (const file of files) {
            if (!/\.md$/.test(file)) continue
            posts.push(await Post.loadFromFile(file))
        }

        return posts
    }
}

function arePostsFresh(updated: Date | undefined, timeout: number) {
    if (!updated) return false
    const diff = new Date().getTime() - updated.getTime()
    return diff < timeout
}

export default BlogEngine