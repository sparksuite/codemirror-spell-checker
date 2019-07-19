"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = SpellChecker;
exports.initTypo = initTypo;
exports.loadDictionary = loadDictionary;

var _fetch = _interopRequireDefault(require("fetch"));

var _typoJs = _interopRequireDefault(require("typo-js"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

const dataDir = _path["default"].join(__dirname, 'data');

const baseDicUrl = 'https://github.com/titoBouzout/Dictionaries/blob/master/';

function SpellChecker(CodeMirror) {
  // Verify
  if (typeof CodeMirror !== 'function' || typeof CodeMirror.defineMode !== 'function') {
    throw new Error('You must provide a class of CodeMirror');
  }

  CodeMirror.defineOption('spellCheckLang', 'en_US', async function (cm, newVal) {
    if (newVal) {
      try {
        SpellChecker.typo = await initTypo(newVal);
      } catch (e) {
        console.error('Failed to init Typo:', e);
        SpellChecker.typo = await initTypo('en_US');
        cm.setOption('spellCheckLang', 'en_US');
      }
    }
  });
  CodeMirror.defineMode('spell-checker', function (config) {
    // Define what separates a word
    const rx_word = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ '; // Create the overlay and such

    const overlay = {
      token: function (stream) {
        var ch = stream.peek();
        var word = '';
        var isCodeBlock = stream.lineOracle.state.base.overlay.codeBlock;

        if (options.ignoreCodeBlocks && isCodeBlock) {
          stream.next();
          return null;
        }

        if (rx_word.includes(ch)) {
          stream.next();
          return null;
        }

        while ((ch = stream.peek()) != null && !rx_word.includes(ch)) {
          word += ch;
          stream.next();
        }

        if (SpellChecker.typo && !SpellChecker.typo.check(word)) return 'spell-error'; // CSS class: cm-spell-error

        return null;
      }
    };
    const mode = CodeMirror.getMode(config, config.backdrop || 'text/plain');
    return CodeMirror.overlayMode(mode, overlay, true);
  });
}

initTypo('en_US').then(typo => {
  SpellChecker.typo = typo;
});

async function initTypo(lang) {
  const data = await loadDictionary(lang);
  return new _typoJs["default"](lang, data.aff, data.dic, {
    platform: 'any'
  });
}

async function loadDictionary(lang) {
  const affPath = _path["default"].join(dataDir, `${lang}.aff`);

  const dicPath = _path["default"].join(dataDir, `${lang}.dic`);

  const data = {};

  if (_fs["default"].existsSync(affPath)) {
    const url = `${baseDicUrl}/${lang}.aff`;
    const res = await (0, _fetch["default"])(url);
    data.aff = res.text();

    _fs["default"].writeFileSync(affPath, data.aff);
  } else {
    data.aff = _fs["default"].readFileSync(affPath, 'utf-8');
  }

  if (_fs["default"].existsSync(dicPath)) {
    const url = `${baseDicUrl}/${lang}.dic`;
    const res = await (0, _fetch["default"])(url);
    data.dic = res.text();

    _fs["default"].writeFileSync(dicPath, data.dic);
  } else {
    data.dic = _fs["default"].readFileSync(dicPath, 'utf-8');
  }
}