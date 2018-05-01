import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export async function write(name, converter) {
  const csv = await readCsv(name)
  const prismicDocs = csv.slice(1, csv.length).map(result => {
    return converter(result)
  });

  await new Promise((resolve, reject) => {
    mkdirp(`./prismic_docs/${name}`, (err) => {
      if (err) reject(err)
      else resolve('pow!')
    })
  })

  prismicDocs.forEach(doc => {
    const filename = doc.drupalPath.replace(/\//g, '_');
    fs.writeFile(`./prismic_docs/${name}/${filename}.json`, JSON.stringify(doc, null, 2), (err) => {
      if (err) console.error(err)
      else {} //console.info(`"${doc.drupalPath}", "${doc.title[0].content.text}", "${doc.tags[0]}"`)
    })
  })
}

async function readCsv(name, ignoreIncludes = false) {
  const file = fs.createReadStream(csvFile(name))
  const includesStream = fs.createReadStream(csvFile('includes'))
  const fileContent = await new Promise((resolve, reject) => {
    Papa.parse(file, {
      error: function(err) {
        reject(err);
      },
      complete: function(results) {
        resolve(results.data);
      }
    })
  })
  const includesArr = await new Promise((resolve, reject) => {
    Papa.parse(includesStream, {
      error: function(err) {
        reject(err);
      },
      complete: function(results) {
        resolve(results.data);
      }
    })
  })
  const includes = [].concat(...includesArr)
  const onlyIncludes = fileContent.map(result => {
    const [_, path] = result
    if (includes.includes(`wellcomecollection.org${path}`)) {
      return result
    }
  }).filter(Boolean)

  fileContent.shift() // remove the titles
  return ignoreIncludes ? fileContent : onlyIncludes
}

function csvFile(filename) {
  return `${__dirname}/csv/${filename}.csv`
}

