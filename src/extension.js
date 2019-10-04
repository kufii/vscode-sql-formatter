'use strict';

const vscode = require('vscode');
const sqlFormatter = require('sql-formatter');

const getRange = document =>
	new vscode.Range(
		0,
		0,
		document.lineCount - 1,
		document.lineAt(document.lineCount - 1).range.end.character
	);

const getSetting = (group, key, def) => {
	const settings = vscode.workspace.getConfiguration(group, null);
	const editor = vscode.window.activeTextEditor;
	const language = editor && editor.document && editor.document.languageId;
	const languageSettings = language && vscode.workspace.getConfiguration().get(`[${language}]`);
	let value = languageSettings && languageSettings[`${group}.${key}`];
	if (value == null) value = settings.get(key, def);
	return value == null ? def : value;
};

const getConfig = () => {
	const language = getSetting('sql-formatter', 'dialect', 'sql');
	const { insertSpaces, tabSize } = vscode.window.activeTextEditor.options;
	const indent = insertSpaces ? ' '.repeat(tabSize) : '\t';
	return { indent, language };
};

const format = text => sqlFormatter.format(text, getConfig());

module.exports.activate = () => {
	vscode.languages.registerDocumentFormattingEditProvider('sql', {
		provideDocumentFormattingEdits: document => [
			vscode.TextEdit.replace(getRange(document), format(document.getText()))
		]
	});
};
