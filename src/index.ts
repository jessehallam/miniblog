import express from 'express'
import { create } from './router'

export interface Options {
    log: (msg: any) => void
    path: string
    refresh?: number
}

export function initialize(options: Options): express.RequestHandler {
    options.log = options.log || console.debug
    const router = create(options)
    return router
}