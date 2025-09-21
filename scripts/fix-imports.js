import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Fix relative imports that don't have .js extension
  content = content.replace(
    /from ['"](\.\.?\/[^'"]*?)(?<!\.js)['"]/g,
    (match, importPath) => {
      return match.replace(importPath, importPath + '.js')
    }
  )

  // Fix relative imports in import statements
  content = content.replace(
    /import ['"](\.\.?\/[^'"]*?)(?<!\.js)['"]/g,
    (match, importPath) => {
      return match.replace(importPath, importPath + '.js')
    }
  )

  // Fix imports that point to directories (add /index.js)
  content = content.replace(
    /from ['"](\.\.?\/[^'"]*?)['"]/g,
    (match, importPath) => {
      const fullPath = path.resolve(path.dirname(filePath), importPath)
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        return match.replace(importPath, importPath + '/index.js')
      }
      return match
    }
  )

  // Fix imports that end with .js but should point to /index.js
  content = content.replace(
    /from ['"](\.\.?\/[^'"]*?)\.js['"]/g,
    (match, importPath) => {
      const fullPath = path.resolve(path.dirname(filePath), importPath)
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        return match.replace(importPath + '.js', importPath + '/index.js')
      }
      return match
    }
  )

  fs.writeFileSync(filePath, content)
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath)
    }
  }
}

const distDir = path.join(__dirname, '..', 'dist')
walkDir(distDir)

console.log('Fixed all import extensions in dist/')
