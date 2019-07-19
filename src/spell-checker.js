import fetch from 'fetch'
import Typo from 'typo-js'
import fs from 'fs'
import path from 'path'

const dataDir = path.join(__dirname, 'data')
const baseDicUrl = 'https://github.com/titoBouzout/Dictionaries/blob/master/'

export default function SpellChecker(CodeMirror) {
  // Verify
  if (
    typeof CodeMirror !== 'function' ||
    typeof CodeMirror.defineMode !== 'function'
  ) {
    throw new Error('You must provide a class of CodeMirror')
  }

  CodeMirror.defineOption('spellCheckLang', 'en_US', async function(
    cm,
    newVal
  ) {
    if (newVal) {
      try {
        SpellChecker.typo = await initTypo(newVal)
      } catch (e) {
        console.error('Failed to init Typo:', e)
        SpellChecker.typo = await initTypo('en_US')
        cm.setOption('spellCheckLang', 'en_US')
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

        var isCodeBlock = stream.lineOracle.state.base.overlay.codeBlock
        if (options.ignoreCodeBlocks && isCodeBlock) {
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

initTypo('en_US').then(typo => {
  SpellChecker.typo = typo
})

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

  if (fs.existsSync(affPath)) {
    const url = `${baseDicUrl}/${lang}.aff`
    const res = await fetch(url)
    data.aff = res.text()
    fs.writeFileSync(affPath, data.aff)
  } else {
    data.aff = fs.readFileSync(affPath, 'utf-8')
  }

  if (fs.existsSync(dicPath)) {
    const url = `${baseDicUrl}/${lang}.dic`
    const res = await fetch(url)
    data.dic = res.text()
    fs.writeFileSync(dicPath, data.dic)
  } else {
    data.dic = fs.readFileSync(dicPath, 'utf-8')
  }
}
