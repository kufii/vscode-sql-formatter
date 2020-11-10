# Sql Formatter

Format SQL files using the [sql-formatter-plus](https://github.com/kufii/sql-formatter-plus) npm package.

## Configuration

**`sql-formatter.dialect`**: Changes which dialect to format with (`sql`: Standard SQL, `n1ql`: Couchbase N1QL, `db2`: IBM DB2, `pl/sql`: Oracle PL/SQL). Defaults to `sql`.

**`sql-formatter.uppercase`**: Convert keywords to uppercase. Defaults to false.

**`sql-formatter.linesBetweenQueries`**: Number of linebreaks between queries. Defaults to 2.

## Commands
The following command is also added to VS Code:

`vscode-sql-formatter.format-selection (Format the selected SQL using the configured settings)`
- Formats the selected text based on the current settings, regardless of the editor's Language Mode.
