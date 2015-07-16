# CodeMirror Spell Checker
Spell checking so simple, you can set up in 60 seconds. It will highlight any misspelled words in light red. Works great in conjunction with other CodeMirror modes, like GitHub Flavored Markdown.

[Demo](http://nextstepwebs.github.io/codemirror-spell-checker/)

![Screenshot](http://i.imgur.com/7yb5Nne.png)

## Quick start
CodeMirror spell checker is available on [jsDelivr](http://www.jsdelivr.com/#!codemirror.spell-checker). *Please note, jsDelivr may take a few days to update to the latest release.*

```HTML
<link rel="stylesheet" href="//cdn.jsdelivr.net/codemirror.spell-checker/latest/spell-checker.min.css">
<script src="//cdn.jsdelivr.net/codemirror.spell-checker/latest/spell-checker.min.js"></script>
```

Now load CodeMirror like normal. Set the mode to `"spell-checker"` and the backdrop mode to the appropriate mode. Be sure to load `overlay.min.js` if you don't already use it.

```HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/mode/markdown/markdown.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/addon/mode/overlay.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/mode/gfm/gfm.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.4.0/codemirror.min.css">

<script>
CodeMirror.fromTextArea(document.getElementById("textarea"), {
	mode: "spell-checker",
	backdrop: "gfm",
	lineNumbers: true,
});
</script>
```

That's it!

## Customizing
You can customize the misspelled word appearance by updating the CSS. All misspelled words will have the `.cm-spell-error` class.

```CSS
.CodeMirror .cm-spell-error{
	/* Your styling here */
}
```
