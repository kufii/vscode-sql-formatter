'use strict';

const vscode = require('vscode');
const sqlFormatter = require('sql-formatter-plus');

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

const getConfig = ({ insertSpaces, tabSize }) => ({
	indent: insertSpaces ? ' '.repeat(tabSize) : '\t',
	language: getSetting('sql-formatter', 'dialect', 'sql'),
	uppercase: getSetting('sql-formatter', 'uppercase', false),
	linesBetweenQueries: getSetting('sql-formatter', 'linesBetweenQueries', 2)
});

const formatSelection = () => {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);
		const options = {
			insertSpaces: editor.insertSpaces,
			tabSize: editor.tabSize,
		};

		if(text) {
			const formatted = format(text, getConfig(options));
			editor.edit(editBuilder => {
				editBuilder.replace(selection, formatted);
			});
		}
	}
};

const format = (text, config) => sqlFormatter.format(text, config);

module.exports.activate = (context) => {
	const formatSelectionCommand = vscode.commands.registerCommand('vscode-sql-formatter.format-selection', formatSelection);
	
	vscode.languages.registerDocumentRangeFormattingEditProvider('sql', {
		provideDocumentRangeFormattingEdits: (document, range, options) => [
			vscode.TextEdit.replace(range, format(document.getText(range), getConfig(options)))
		]
	});

	context.subscriptions.push(formatSelectionCommand);
}
