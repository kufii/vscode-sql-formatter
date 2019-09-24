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

const getConfig = () => {
	const editorSettings = vscode.workspace.getConfiguration('editor', null);
	const extensionSettings = vscode.workspace.getConfiguration('sql-formatter', null);
	const indent = editorSettings.get('insertSpaces')
		? ' '.repeat(editorSettings.get('tabSize'))
		: '\t';
	const language = extensionSettings.get('dialect', 'sql');
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
