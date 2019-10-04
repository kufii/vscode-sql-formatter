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
	const extensionSettings = vscode.workspace.getConfiguration('sql-formatter', null);
	const language = extensionSettings.get('dialect', 'sql');
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
