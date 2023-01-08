# CodeMirror Spell Checker

Spell checking so simple, you can set up in 60 seconds. It will highlight any misspelled words in light red. Works great in conjunction with other CodeMirror modes, like GitHub Flavored Markdown.

Inspired by fantastic work done by [Wes Cossick](https://github.com/sparksuite/codemirror-spell-checker).

[Demo](http://nextstepwebs.github.io/codemirror-spell-checker/)

![Screenshot](http://i.imgur.com/7yb5Nne.png)

It works only on Electron apps since it depends on NodeJS.

## Install

Via [npm](https://www.npmjs.com/package/@inkdropapp/codemirror-spell-checker).

```
npm install @inkdropapp/codemirror-spell-checker --save
```

## Quick start

Once CodeMirror is installed and loaded, first provide CodeMirror Spell Checker with the correct CodeMirror function. Then, just set the primary mode to `"spell-checker"` and the backdrop mode to your desired mode. Be sure to load/require `overlay.min.js` if you haven't already.

```JS
import SpellChecker from '@inkdropapp/codemirror-spell-checker'

SpellChecker(CodeMirror)

CodeMirror.fromTextArea(document.getElementById("textarea"), {
  mode: "spell-checker",
  backdrop: "gfm",        // Your desired mode
  spellCheckLang: "en_US"
});
```

That's it!

## Other languages

Some languages are tested and bundled in [the data directory](/inkdropapp/codemirror-spell-checker/tree/master/data).
It supports other languages by downloading the dictionary files from [titoBouzout/Dictionaries](https://github.com/titoBouzout/Dictionaries).
In order to use another language instead of `en_US` you just have to provide a language name listed in the above repository like so:

```JS
CodeMirror.fromTextArea(document.getElementById("textarea"), {
  mode: "spell-checker",
  backdrop: "gfm",
  spellCheckLang: "en_AU"
});
```

## Customizing
You can customize the misspelled word appearance by updating the CSS. All misspelled words will have the `.cm-spell-error` class.

```CSS
.CodeMirror .cm-spell-error{
	/* Your styling here */
}
```
