import {
  convertHtmlStringToPrismicStructure,
  convertImgHtmlToImage
} from './utils'

export function convertToPrismicDoc(result, tag) {
  const [nid, path, title, body, image, promoText] = result

  try {
    const doc = {
      type: 'info-pages',
      tags: [tag],
      title: [{
        type: 'heading1',
        content: {
          text: title,
          spans: []
        }
      }],
      body: [{
        key: 'text',
        value: {
          'non-repeat': {
            text: convertHtmlStringToPrismicStructure(body)
          }
        }
      }],
      drupalPromoImage: {
        url: convertImgHtmlToImage(image).contentUrl
      },
      drupalNid: nid,
      drupalPath: path,
      promo: [{
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
    return doc;
  } catch (err) {
    console.info('Could not convert: ' + path)
    throw err
  }
}
