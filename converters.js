import {
  convertHtmlStringToPrismicStructure,
  convertImgHtmlToImage
} from './utils'

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
    type: 'p',
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

export function convertBasicPage(result, tag) {
  return (result) => {
    const [nid, path, title, body, image, promoText] = result
    try {
      const doc = {
        type: 'info-pages',
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
  try {
    const doc = {
      type: 'info-pages',
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

  try {
    const doc = {
      type: 'exhibitions',
      tags: ['from_drupal'],
      title: convertTitle(title),
      description: convertHtmlStringToPrismicStructure(body),
      start: start,
      end: end,
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
var t = 0
export function convertBooks(result) {
  const [nid, path, title, body, image, promoText,
         publishedDate, subtitle, links, price, format, extent, isbn, edition,
         praises, author, authorImage, authorAbout] = result


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
        text: convertText(citation),
        citation: convertText(citation)
      })),
      drupalPromoImage: {
        url: convertImgHtmlToImage(image).contentUrl
      },
      drupalNid: nid,
      drupalPath: path,
      promo: convertPromo(promoText),
      publishedDate,
      authorName: author,
      authorImage: authorImage && convertImgHtmlToImage(authorImage),
      authorAbout: authorAbout && convertHtmlStringToPrismicStructure(authorAbout)
    }
    return doc;
  } catch (err) {
    console.info('Could not convert: ' + path)
    console.info(err)
    throw err
  }
}
