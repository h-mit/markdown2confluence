import marked from 'marked'
import querystring from './querystring'

let defaultLanguageMap = {
  '': 'none',
  actionscript3: 'actionscript3',
  bash: 'bash',
  csharp: 'csharp',
  coldfusion: 'coldfusion',
  cpp: 'cpp',
  css: 'css',
  delphi: 'delphi',
  diff: 'diff',
  erlang: 'erlang',
  groovy: 'groovy',
  html: 'html',
  java: 'java',
  javafx: 'javafx',
  javascript: 'javascript',
  js: 'javascript',
  perl: 'perl',
  php: 'php',
  powershell: 'powershell',
  python: 'python',
  ruby: 'ruby',
  scala: 'scala',
  shell: 'bash',
  sql: 'sql',
  vb: 'vb',
  xml: 'xml'
}

class ConfluenceRenderer {
  constructor (options) {
    this.renderOptions = options
  }
  blockquote (text) {
    return `{quote}\n${text.trim()}\n{quote}\n\n`
  }
  br () {
    return '\n'
  }
  code (text, lang) {
    let stylingOptions

    // Simple clone of the options.
    stylingOptions = JSON.parse(JSON.stringify(this.renderOptions.codeStyling))
    lang = lang || ''
    lang = lang.toLowerCase()
    lang =
      this.renderOptions.codeLanguageMap[lang] ||
      this.renderOptions.codeLanguageMap['']

    if (lang) {
      stylingOptions.language = lang
    }

    // If too big, collapse.
    if (text.split('\n').length > this.renderOptions.codeCollapseAt) {
      stylingOptions.collapse = true
    }

    // Convert to a string
    stylingOptions = querystring(stylingOptions, '|')

    if (stylingOptions) {
      stylingOptions = `:${stylingOptions}`
    }

    return `{code${stylingOptions}}\n${text}\n{code}\n\n`
  }
  codespan (text) {
    text = text.split(/(&[^;]*;)/).map((match, index) => {
      // These are the delimeters.
      if (index % 2) {
        return match
      }

      return match.replace(/[^a-zA-Z0-9 ]/g, badchar => {
        return `&#${badchar[0].charCodeAt(0)};`
      })
    })

    return `{color:#c2185b}{{${text.join('')}}}{color}`
  }
  del (text) {
    return `-${text}-`
  }
  em (text) {
    return `_${text}_`
  }
  heading (text, level) {
    return `h${level}. ${text}\n\n`
  }
  hr () {
    return '----\n\n'
  }
  html (text) {
    return text
  }
  image (href) {
    href = this.renderOptions.imageRewrite(href)

    return `!${href}!`
  }
  link (href, title, text) {
    // Sadly, one must choose if the link's title should be displayed
    // or the linked text should be displayed. We picked the linked text.
    text = text || title

    if (text) {
      text += '|'
    }

    href = this.renderOptions.linkRewrite(href)

    return `[${text}${href}]`
  }
  list (text, ordered) {
    text = text.trim()

    if (ordered) {
      text = text.replace(/^\*/gm, '#')
    }

    return `\r${text}\n\n`
  }
  listitem (text) {
    // If a list item has a nested list, it will have a "\r" in the
    // text. Turn that "\r" into "\n" but trim out other whitespace
    // from the list.
    text = text.replace(/\s*$/, '').replace(/\r/g, '\n')

    // Convert newlines followed by a # or a * into sub-list items
    text = text.replace(/\n([*#])/g, '\n*$1')

    return `* ${text}\n`
  }
  paragraph (text) {
    return `${text}\n\n`
  }
  strong (text) {
    return `*${text}*`
  }
  table (header, body) {
    return `${header}${body}\n`
  }
  tablecell (text, flags) {
    let boundary

    if (flags.header) {
      boundary = '||'
    } else {
      boundary = '|'
    }

    return `${boundary}${text}`
  }
  tablerow (text) {
    let boundary

    boundary = text.match(/^\|*/)

    if (boundary) {
      boundary = boundary[0]
    } else {
      boundary = '|'
    }

    return `${text}${boundary}\n`
  }
  text (text) {
    return text
  }
}

function defaultHrefRewrite (href) {
  return href
}

export default (markdown, options) => {
  let result

  // Set defaults.
  options = options || {}
  options.marked = options.marked || {}
  options.codeLanguageMap = options.codeLanguageMap || defaultLanguageMap
  options.codeStyling = options.codeStyling || {
    theme: 'RDark',
    linenumbers: true
  }
  options.codeCollapseAt = options.codeCollapseAt || 20
  options.linkRewrite = options.linkRewrite || defaultHrefRewrite
  options.imageRewrite = options.imageRewrite || defaultHrefRewrite

  // Always override this one property.
  options.marked.renderer = new ConfluenceRenderer(options)

  // Convert Buffers to strings.
  markdown = markdown.toString()

  // Replace "\r\n" and "\r" with "\n".
  markdown = markdown.replace(/\r\n?/g, '\n')

  // Convert.
  result = marked(markdown, options.marked).trim()

  // Fix the \r placeholder for list beginnings. See list() for more info.
  result = result.replace(/\r/g, '')

  // Remove trailing whitespace.
  result = result.trim()

  return result
}
