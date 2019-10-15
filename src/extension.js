'use strict';

const vscode = require('vscode');
const sqlFormatter = require('sql-formatter');
const eol = require('eol');

const getSetting = (group, key, def) => {
	const settings = vscode.workspace.getConfiguration(group, null);
	const editor = vscode.window.activeTextEditor;
	const language = editor && editor.document && editor.document.languageId;
	const languageSettings = language && vscode.workspace.getConfiguration().get(`[${language}]`);
	let value = languageSettings && languageSettings[`${group}.${key}`];
	if (value == null) value = settings.get(key, def);
	return value == null ? def : value;
};

const getRange = document =>
	new vscode.Range(
		0,
		0,
		document.lineCount - 1,
		document.lineAt(document.lineCount - 1).range.end.character
	);

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

const getConfig = ({ insertSpaces, tabSize }) => {
	const language = getSetting('sql-formatter', 'dialect', 'sql');
	const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';
	return { indent, language };
};

const format = (text, config) =>
	getBlocks(eol.lf(text))
		.map(b => sqlFormatter.format(b, config))
		.join('\n\n')
		.trim();

module.exports.activate = () => {
	const provider = (document, range, options) => [
		vscode.TextEdit.replace(range, format(document.getText(range), getConfig(options)))
	];
	vscode.languages.registerDocumentFormattingEditProvider('sql', {
		provideDocumentFormattingEdits: (document, options) =>
			provider(document, getRange(document), options)
	});
	vscode.languages.registerDocumentRangeFormattingEditProvider('sql', {
		provideDocumentRangeFormattingEdits: provider
	});
};
