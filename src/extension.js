'use strict';

const vscode = require('vscode');
const sqlFormatter = require('sql-formatter-plus');
const eol = require('eol');

const getSetting = (group, key, def) => {
	const settings = vscode.workspace.getConfiguration(group, null);
	const editor = vscode.window.activeTextEditor;
	const language = editor && editor.document && editor.document.languageId;
	const languageSettings =
		language && vscode.workspace.getConfiguration(null, null).get(`[${language}]`);
	let value = languageSettings && languageSettings[`${group}.${key}`];
	if (value == null) value = settings.get(key, def);
	return value == null ? def : value;
};

const getBlocks = text => {
	let inSingleQuote = false;
	let inDoubleQuote = false;
	let hyphenCount = 0;
	const inComment = () => hyphenCount === 2;

	const blocks = [];
	let block = '';

	for (const char of text) {
		block += char;

		if (inSingleQuote) {
			if (char === "'") inSingleQuote = false;
			hyphenCount = 0;
			continue;
		} else if (inDoubleQuote) {
			if (char === '"') inDoubleQuote = false;
			hyphenCount = 0;
			continue;
		} else if (inComment()) {
			if (char === '\n') hyphenCount = 0;
			continue;
		}

		if (char === "'") inSingleQuote = true;
		else if (char === '"') inDoubleQuote = true;
		else if (char === '-') hyphenCount++;
		else {
			hyphenCount = 0;
			if (char === ';') {
				blocks.push(block);
				block = '';
			}
		}
	}
	if (block) blocks.push(block);

	return blocks;
};

const getConfig = ({ insertSpaces, tabSize }) => ({
	indent: insertSpaces ? ' '.repeat(tabSize) : '\t',
	language: getSetting('sql-formatter', 'dialect', 'sql')
});

const format = (text, config) =>
	getBlocks(eol.lf(text))
		.map(b => sqlFormatter.format(b, config))
		.join('\n\n')
		.trim();

module.exports.activate = () =>
	vscode.languages.registerDocumentRangeFormattingEditProvider('sql', {
		provideDocumentRangeFormattingEdits: (document, range, options) => [
			vscode.TextEdit.replace(range, format(document.getText(range), getConfig(options)))
		]
	});
