import {
 convertBasicPage,
 convertExhibition,
 convertPressRelease,
 convertBooks
} from './converters'
import {write} from './write'

const run = process.env[2]

async function whatWeDo() {
  console.info(`> Running: whatwedo`)
  write('what-we-do', convertBasicPage('what-we-do'))
}
async function visitUs() {
  console.info(`> Running: visitus`)
  write('visit-us', convertBasicPage('visit-us'))
}
async function exhibitions() {
  console.info(`> Running: exhibitions`)
  write('exhibitions', convertExhibition)
}
async function pressReleases() {
  console.info(`> Running: press-releases`)
  write('press-releases', convertPressRelease)
}
async function books() {
  console.info(`> Running: books`)
  write('books', convertBooks)
}

const funcs = [
  whatWeDo, visitUs, exhibitions, pressReleases, books
]

if (run) {
  funcs[run]()
} else {
  funcs.forEach(func => func())
}
