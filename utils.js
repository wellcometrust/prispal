import htmlparser from 'htmlparser2'

const prismicBlocksMap = {
  h2: 'heading2',
  h3: 'heading2',
  h4: 'heading2',
  p: 'paragraph',
  blockquote: 'paragraph',
  ul: 'list-item',
  ol: 'o-list-item',
}

const prismicSpansMap = {
  a: 'hyperlink',
  i: 'em',
  em: 'em',
  b: 'strong',
  strong: 'strong'
}

const reduceNodeChildrenToText = (children) => {
  return children.reduce((text, child) => {
    if (child.type === 'text') {
      return `${text}${child.data}`;
    } else {
      return text + reduceNodeChildrenToText(child.children)
    }
  }, '')
}

const flattenBlock = (block, nodes) => {
  return nodes.reduce((block, node) => {
    if (node.type === 'text') {
      const newBlock = {
        type: block.type,
        text: `${block.text}${node.data}`,
        spans: block.spans
      }

      return newBlock
    } else {
      if (node.type === 'comment') return block

      // Create other converters
      const data = node.name === 'a' ? {
        link_type: 'Web',
        url: node.attribs.href
      } : {}

      const fullText = reduceNodeChildrenToText(node.children)
      const span = {
        start: block.text.length,
        // This feels like it could live in this reduce function,
        // just not sure how
        end: block.text.length + fullText.length,
        type: prismicSpansMap[node.name],
        data: data
      }

      const newBlock = {
        type: block.type,
        text: block.text,
        spans: block.spans.concat([span])
      }

      return flattenBlock(newBlock, node.children)
    }
  }, block)
}

function cleanCrappyDrupalHtml(string) {
  string = string.trim()
  string = string.replace(/<img class="file-icon"([^\/>].*)\/>/, '')
  string = string.replace(/\s\s+/g, ' ')
  string = string.replace(new RegExp('<br /><br />', 'g'), '</p><p>')
  string = string.replace(/<p><strong>([^<\/].*)<\/strong><\/p>/g, '<h2>$1</h2>')
  string = string.replace(/\n/g, '')
  string = string.replace(/\t/g, '')
  string = string.replace(/<(\/?|\!?)(span|div)([^>])*>/g, '')
  return string
}

export function convertHtmlStringToPrismicStructure(string) {
  // let's do some boring string manipultion first
  try {
    const cleanString = cleanCrappyDrupalHtml(string)
    const elements = htmlparser.parseDOM(cleanString)
    const prismicStructure = convertElements(elements)
    return prismicStructure
  } catch (err) {
    // console.info(cleanCrappyDrupalHtml(string))
    console.info(err)
    throw (err)
  }
}

function convertElements(elements) {
  const blockArrays = elements.map(node => {
    if (node.type === 'comment') console.info(node)

    if (prismicBlocksMap[node.name]) {
      const type = prismicBlocksMap[node.name];
      // List items need to be converted to parent elements
      // This is not nice.
      if (type === 'o-list-item' || type === 'list-item') {
        const flattenedBlocks = node.children.map(listItemNode => {
          // We should turn this into a parent recursor, but that's for later
          // This is just whitespace between list items
          if (listItemNode.type === 'text') return

          return flattenBlock({
            type,
            spans: [],
            text: ''
          }, listItemNode.children)
        }).filter(Boolean)

        return flattenedBlocks
      }

      const block = {
        type,
        spans: [],
        text: ''
      }
      const flattenedBlock = flattenBlock(block, node.children)
      return [flattenedBlock];
    } else {
      // if we have text, convert it to a p, unless it's an empty text
      if (
        node.name === 'iframe' ||
        node.name === 'table' ||
        node.data.trim() === ''
      ) {
        // console.info('Did not convert node of type: ' + node.name)
        return
      } else {
        const block = {
          type: 'paragraph',
          spans: [],
          text: node.data.trim()
        }
        return [block];
      }
    }
  }).filter(Boolean)

  // This should be a self-referencing function, but I have no time
  return [].concat(...blockArrays)
}

export function convertImgHtmlToImage(html) {
  const img = htmlparser.parseDOM(html)[0]

  return {
    contentUrl: img.attribs.src,
    width: img.attribs.width,
    height: img.attribs.height,
    alt: img.attribs.alt,
  }
}
