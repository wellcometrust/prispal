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


export function convertExhibition(result) {
  const [nid, path, title, body, image, promoText, date] = result
  const [startString, endString] = date.split(' to ');
  const start = startString && (new Date(startString)).toISOString()
  const end = endString && (new Date(endString)).toISOString()

  try {
    const doc = {
      type: 'info-pages',
      tags: ['from_drupal'],
      title: convertTitle(title),
      body: convertBody(body),
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
