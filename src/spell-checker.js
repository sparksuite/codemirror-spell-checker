import fetch from 'node-fetch'
import Typo from 'typo-js'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(__dirname, 'data')
const baseDicUrl = 'https://github.com/titoBouzout/Dictionaries/raw/master/'

export default function SpellChecker(CodeMirror) {
  // Verify
  if (
    typeof CodeMirror !== 'function' ||
    typeof CodeMirror.defineMode !== 'function'
  ) {
    throw new Error('You must provide a class of CodeMirror')
  }

  CodeMirror.defineOption('spellCheckLang', undefined, async function(
    cm,
    newVal
  ) {
    if (newVal) {
      try {
        CodeMirror.signal(cm, 'spell-checker:dictionary-loading', newVal)
        SpellChecker.typo = await initTypo(newVal)
        CodeMirror.signal(cm, 'spell-checker:dictionary-loaded', newVal)
      } catch (e) {
        console.error('Failed to init Typo:', e)
        CodeMirror.signal(cm, 'spell-checker:error', e)
      }
    }
  })

  CodeMirror.defineMode('spell-checker', function(config) {
    // Define what separates a word
    const rx_word = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ '

    // Create the overlay and such
    const overlay = {
      token: function(stream) {
        var ch = stream.peek()
        var word = ''

        const { base } = stream.lineOracle.state
        const ignore = base.codeblock || base.indentedCode || base.code === 1
        if (ignore) {
          stream.next()
          return null
        }

        if (rx_word.includes(ch)) {
          stream.next()
          return null
        }

        while ((ch = stream.peek()) != null && !rx_word.includes(ch)) {
          word += ch
          stream.next()
        }

        if (SpellChecker.typo && !SpellChecker.typo.check(word))
          return 'spell-error' // CSS class: cm-spell-error

        return null
      }
    }

    const mode = CodeMirror.getMode(config, config.backdrop || 'text/plain')

    return CodeMirror.overlayMode(mode, overlay, true)
  })
}

export async function initTypo(lang) {
  const data = await loadDictionary(lang)

  return new Typo(lang, data.aff, data.dic, {
    platform: 'any'
  })
}

export async function loadDictionary(lang) {
  const affPath = path.join(dataDir, `${lang}.aff`)
  const dicPath = path.join(dataDir, `${lang}.dic`)
  const data = {}

  if (!fs.existsSync(affPath)) {
    const url = `${baseDicUrl}/${lang}.aff`
    const res = await fetch(url)
    data.aff = await res.text()
    fs.writeFileSync(affPath, data.aff)
  } else {
    data.aff = fs.readFileSync(affPath, 'utf-8')
  }

  if (!fs.existsSync(dicPath)) {
    const url = `${baseDicUrl}/${lang}.dic`
    const res = await fetch(url)
    data.dic = await res.text()
    fs.writeFileSync(dicPath, data.dic)
  } else {
    data.dic = fs.readFileSync(dicPath, 'utf-8')
  }

  return data
}
