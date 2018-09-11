import fs from 'fs'
import path from 'path'

function isDirectory(path: string) {
    return fs.lstatSync(path).isDirectory()
}

export function *listFilesRecursive(dir: string): Iterable<string> {
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const pathToFile = path.join(dir, file)
        if (isDirectory(pathToFile)) yield *listFilesRecursive(pathToFile)
        else yield pathToFile
    }
}

export function readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, buffer) => {
            if (err) return reject(err)
            else resolve(buffer.toString('utf8'))
        })
    })
}