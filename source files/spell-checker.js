CodeMirror.defineMode("spell-checker", function(config, parserConfig) {
	function _readFile(path, charset) {
		if(!charset) charset = "ISO8859-1";
	
		var req = new XMLHttpRequest();
		req.open("GET", path, false);
	
		if(req.overrideMimeType)
			req.overrideMimeType("text/plain; charset=" + charset);
	
		req.send(null);
	
		return req.responseText;
	}
	
	var typo = new Typo("en_US", _readFile("en_US.aff"), _readFile("en_US.dic"), {
		platform: 'any'
	});

	var rx_word = "!\"#$%&()*+,-./:;<=>?@[\\\\\\]^_`{|}~ ";
	
	var overlay = {
		token: function(stream, state) {
			var ch = stream.peek();
			var word = "";

			if(rx_word.includes(ch)) {
				stream.next();
				return null;
			}

			while((ch = stream.peek()) != null && !rx_word.includes(ch)) {
				word += ch;
				stream.next();
			}

			if(typo && !typo.check(word))
				return "spell-error"; //CSS class: cm-spell-error

			return null;
		}
	};

	var mode = CodeMirror.getMode(
		config, config.backdrop || "text/plain"
	);

	return CodeMirror.overlayMode(mode, overlay, true);
});