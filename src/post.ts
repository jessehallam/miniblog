import * as io from './io'
import path from 'path'

import { computeHash } from './crypto'

class Post {
    private filename?: string
    private meta: any

    get date(): Date { return this.meta.date }
    get id(): string { return this.meta.id }
    get title(): string { return this.meta.title }

    constructor(fileName: string, meta: any) {
        Object.defineProperty(this, 'filename', { value: fileName })
        this.meta = meta
    }

    static async loadFromFile(name: string): Promise<Post> {
        const text = await io.readFile(name)
        const meta = getMetaData(text)
        meta.date = meta.date || getDateFromName(name)
        meta.id = computeHash(name)
        return new Post(name, meta)
    }
}

function getDateFromName(fileName: string): Date | null {
    const r = /^(\d{4}-\d{2}-\d{2})\b/.exec(path.basename(fileName))
    return r && new Date(r[1])
}

function getMetaData(text: string): any {
    const lines = text.split('\n')
    const meta: any = {}

    for (const line of lines) {
        const r = /^#!\s*(\w*?):\s*(.+)/.exec(line)
        if (!r) break

        meta[r[1].trim().toLowerCase()] = r[2].trim()
    }

    return meta
}

export default Post