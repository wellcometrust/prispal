import moment from 'moment'
import 'moment-timezone'
import {
  convertHtmlStringToPrismicStructure,
  convertImgHtmlToImage
} from './utils'

export function convertDate(d) {
  const l = moment.tz(d, 'Europe/London')
  return l.format()
}

function convertTitle(title) {
  return [{
    type: 'heading1',
    content: {
      text: title,
      spans: []
    }
  }]
}

function convertText(title) {
  return [{
    type: 'paragraph',
    content: {
      text: title,
      spans: []
    }
  }]
}


function convertBody(body) {
  return [{
    key: 'text',
    value: {
      'non-repeat': {
        text: convertHtmlStringToPrismicStructure(body)
      }
    }
  }]
}

function convertPromo(promoText) {
  return [{
    key: 'editorialImage',
    value: {
      'non-repeat': {
        caption: [{
          type: 'paragraph',
          content: {
            text: promoText,
            spans: []
          }
        }]
      }
    }
  }]
}

export function convertBasicPage(tag) {

  return (result) => {
    const [nid, path, title, body, image, promoText] = result
    console.info(path);
    try {
      const doc = {
        type: 'pages',
        tags: [tag, 'from_drupal'],
        title: convertTitle(title),
        body: convertBody(body),
        drupalPromoImage: {
          url: convertImgHtmlToImage(image).contentUrl
        },
        drupalNid: nid,
        drupalPath: path,
        promo: convertPromo(promoText)
      }
      return doc;
    } catch (err) {
      console.info('Could not convert: ' + path)
      throw err
    }
  }
}

export function convertPressRelease(result) {
  const [nid, path, title, body, image, promoText, date] = result
  console.info(path);
  try {
    const doc = {
      type: 'pages',
      tags: ['press', 'from_drupal'],
      title: convertTitle(title),
      body: convertBody(body),
      drupalNid: nid,
      drupalPath: path,
      promo: convertPromo(promoText),
      datePublished: date
    }
    return doc;
  } catch (err) {
    console.info('Could not convert: ' + path)
    throw err
  }
}

export function convertExhibition(result) {
  const [nid, path, title, body, image, promoText, date] = result
  const [startString, endString] = date.split(' to ');
  const start = startString && (new Date(startString)).toISOString()
  const end = endString && (new Date(endString)).toISOString()
  console.info(path);

  try {
    const doc = {
      type: 'exhibitions',
      tags: ['from_drupal'],
      title: convertTitle(title),
      description: convertHtmlStringToPrismicStructure(body),
      start: convertDate(start),
      end: convertDate(end),
      drupalPromoImage: {
        url: convertImgHtmlToImage(image).contentUrl
      },
      drupalNid: nid,
      drupalPath: path,
      promo: convertPromo(promoText)
    }
    return doc;
  } catch (err) {
    console.info('Could not convert: ' + path)
    throw err
  }
}

export function convertBooks(result) {
  const [nid, path, title, body, image, promoText,
         datePublished, subtitle, links, price, format, extent, isbn, edition,
         praises, authorName, authorImage, authorDescription] = result

  console.info(path);

  const structuredPraises = praises.split(/“/g).filter(praise => praise !== '').map(praise => {
    const [text, citation] = praise.split(/”/g);
    return {
      text, citation
    }
  })

  try {
    const doc = {
      type: 'books',
      tags: ['from_drupal'],
      title: convertTitle(title),
      subtitle: convertText(subtitle),
      body: convertBody(body),
      orderLink: {
        url: links.replace('Order online', '')
      },
      price,
      format,
      extent,
      isbn,
      reviews: structuredPraises.map(({text, citation}) => ({
        text: convertText(text),
        citation: convertText(citation)
      })),
      promo: convertPromo(promoText),
      datePublished: datePublished,
      authorName: convertText(authorName),
      authorImage: (authorImage && {
        url: convertImgHtmlToImage(authorImage).contentUrl
      }) || null,
      authorDescription: (authorDescription && convertHtmlStringToPrismicStructure(authorDescription)) || null,
      cover: {
        origin: {
          url: convertImgHtmlToImage(image).contentUrl
        },
        alt: `Book cover of ${title} by ${authorName}`
      },
      drupalPromoImage: {
        url: convertImgHtmlToImage(image).contentUrl
      },
      drupalNid: nid,
      drupalPath: path
    }
    return doc;
  } catch (err) {
    console.info('Could not convert: ' + path)
    console.info(err)
    throw err
  }
}
