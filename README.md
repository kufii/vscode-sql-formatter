# Sql Formatter

Format SQL files using the [sql-formatter](https://www.npmjs.com/package/sql-formatter) npm package.

## Configuration

**`sql-formatter.dialect`**: Choose which dialect to format with:

- **sql** - [Standard SQL][sql], _default_
- **mariadb** - [MariaDB][mariadb]
- **mysql** - [MySQL][mysql]
- **postgresql** - [PostgreSQL][postgresql]
- **db2** - [IBM DB2][db2]
- **plsql** - [Oracle PL/SQL][plsql]
- **n1ql** - [Couchbase N1QL][n1ql]
- **redshift** - [Amazon Redshift][redshift]
- **spark** - [Spark][spark]
- **tsql** - [SQL Server Transact-SQL][tsql]

**`sql-formatter.uppercase`**: Convert keywords to uppercase. Defaults to false.

**`sql-formatter.linesBetweenQueries`**: Number of linebreaks between queries. Defaults to 2.

[sql]: https://en.wikipedia.org/wiki/SQL:2011
[mariadb]: https://mariadb.com/
[mysql]: https://www.mysql.com/
[postgresql]: https://www.postgresql.org/
[db2]: https://www.ibm.com/analytics/us/en/technology/db2/
[plsql]: http://www.oracle.com/technetwork/database/features/plsql/index.html
[n1ql]: http://www.couchbase.com/n1ql
[redshift]: https://docs.aws.amazon.com/redshift/latest/dg/cm_chap_SQLCommandRef.html
[spark]: https://spark.apache.org/docs/latest/api/sql/index.html
[tsql]: https://docs.microsoft.com/en-us/sql/sql-server/
