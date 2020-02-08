# ms-sqlcmd

[![npm version](https://img.shields.io/github/package-json/v/tracker1/node-ms-sqlcmd)](https://www.npmjs.com/package/ms-sqlcmd)
[![Actions Status](https://github.com/tracker1/node-ms-sqlcmd/workflows/Tests/badge.svg)](https://github.com/tracker1/node-ms-sqlcmd/actions)
[![Code Coverage](https://img.shields.io/coveralls/github/tracker1/node-ms-sqlcmd)](https://github.com/tracker1/node-ms-sqlcmd)
[![Dependency Status](https://img.shields.io/librariesio/release/npm/ms-sqlcmd)](https://libraries.io/npm/ms-sqlcmd)
![Github Issues](https://img.shields.io/github/issues/tracker1/node-ms-sqlcmd?style=plastic) 
[![MIT License](https://img.shields.io/github/license/tracker1/node-ms-sqlcmd)](./LICENSE)

This package makes it easier to execute `sqlcmd` scripts from node.js.  It will use an mssql url string as a connection string. The path should be `/INSTANCENAME/DATABASENAME` or simply `/DATABASENAME`.  The fields should be encoded via `encodeURIComponent` in order to facilitate special characters, especially in passphrases that might otherwise interfere or have special characters.

As the [mssql](https://github.com/tediousjs/node-mssql) and underlying [tedious](https://github.com/tediousjs/tedious) packages favor TCP connections, this library will default to matching constraints.  You should of course make certain that your SQL Server installation is setup to listen to TCP connection requests.

Script file(s) should be encoded in UTF-8, they will be written in a temporary location for execution, and cleaned up (via UTF-16LE / Unicode in sqlcmd).


## Usage

```js
const { sqlcmd } = require('ms-sqlcmd');
...
// mssql url formatted connection string - for now, no querystring options will be parsed
// for connection/execution options, see Query String section below.
const connectionString = 'mssql://sa:password@server:port/database';

// path to the script to run, should prefer absolute paths, or relative to the current working directory.
// see Connection String below
const scripts = [
  path.join(__dirname, '../sql-scripts/somescript.sql'),
];

// Optional, script variables, for scripts using `:setvar` and `$(VarName)`
const scriptVars = {
  "DatabaseName": "foo"
};

// Optional, additional options, defaults below
const options = {
  echo: true, // echo sqlcmd output to stdout/stderr while running
};

// call sqlcmd with the parameters, if you want to pass options, without scriptVars, use null for scriptVars.
// returns a promise, you can await on it directly, or listen for specific events.
try {
  // if sqlcmd returns with a non-zero exit code, an error will be thrown
  const output = await sqlcmd(connectionString, scripts, scriptVars, options);
} catch(error) {
  // standard properties set on error object other error properties may also be set
  //   if a code of "INVALID_CONNECTION_STRING" is used, there will be an innerError property
  const { message, code, output, stdout, stderr } = error;
}
```

### Notice

Although there are very thorough unit and integration tests, not all code paths may be well covered, in particular, I'm unable to test the mssql-tools path in an automated fashion, and it may need tweaking.  If you hae sqlcmd installed locally or are using a local, linux docker container for your mssql server instance, it should run fairly reliably.  Feel free to post issues and pull requests are welcome.

### Errors

The error should have a `code` property.  This will be a string you can match on, or the exit code from `sqlcmd` directly.

* `###` - the exit code from `sqlcmd` executable.
* `SQLCMD_NOT_FOUND` - the `sqlcmd` executable could not be found, either in the `PATH` environment, or in known install locations.
  * The `PATH` will be searched first, then a few known Windows and Linux installation locations will be checked.
  * If you have the SQL tools installed and receive this error, please create an issue stating your OS and the full path to `sqlcmd`
* `INVALID_CONNECTION_STRING` - the connectionString argument is not a valid URL, or does not contain all the necessary parameters.
* `UNEXPECTED_ERROR` - Any other errors will be wrapped in this, with an `innerError` property containing the original error.

### Connection String

The main portions of the connectionString are as follows: (See Query String section below)

`Protocol://Username:Passphrase@ServerName:Port/InstanceName/DatabaseName?Query`

Each section should be URI Component Path encoded (encodeURIComponent).

* Protocol: The connection protocol to use
  * `mssql:` - preferred, will attempt to autodiscover the best path
    * sqlcmd found - will use the locally installed copy
    * no sqlcmd - `localhost` - will try to find a matching mssql instance and run inside the container
    * no sqlcmd - not `localhost` - will attempt to use mssql-tools via docker
  * `mssql+tcp` - TCP, default when not `localhost`
  * `msssql+lpc:` - shared memory
  * `mssql+np:` - named pipes
  * `mssql+docker` - will attempt to run inside a container
* Username: Required for TCP connections, if unspecified will use a Trusted Connection option.
* Passphrase: Required if Username is specified.
* ServerName: The name of the server to connect to.
  * `localhost` for local connections (lpc, np, tcp)
    * For docker users, always use `localhost`
  * The dns or ip address for the server for remote connections (tcp)
  * `docker` for execution inside a docker sql server instance.
* Port: (optional) the port to connect to the server on, TCP Only
  * Docker users, use the listen port, this will allow the command to attempt match a running container.
* InstanceName: (optional)
  * Named Instance (tcp, lcp, np)
  * Container ID or Name (docker)
  * If unspecifed, will use the default instance
* DatabaseName: The name of the database to connect to.
* Query: See below

#### Docker

If the Protocol is `"mssql+docker"`, then a locally installed Docker server is expected with the `INSTANCE` specified to either the Container ID or Name. The script will be copied into the container as `/tmp/sqlscript.sql`. Inside the container, `/opt/mssql-tools/bin/sqlcmd` will be executed against the script.

For Docker runs, the ServerName and Port will be ignored as the default instance inside the container will be used.  In practice, you should use either `localhost` or `docker`.  The Username and Passphrase fields are also optional for Docker runs.

#### Query String

The following query string parameters may also be specified as additional parameters passed to `sqlcmd`.
Boolean values may be a literal `true`, `t`, `y` or `1` as a boolean or string for a true value, `false`, `f`, `n`, or `1` for a false value, all other 
values will use the default/unset value.

* dedicatedAdminConnection Boolean (-A) - Logs in to SQL Server with a Dedicated Administrator Connection (DAC). This kind of connection is used to troubleshoot a server. This will only work with server computers that support DAC. If DAC is not available, sqlcmd generates an error and then exits. (-A)
* trustServerCert Boolean (-C) - This switch is used by the client to configure it to implicitly trust the server certificate without validation. This option is equivalent to the ADO.NET option
* loginTimeout Integer (-l) - Specifies the number of seconds before a sqlcmd login to the ODBC driver times out when you try to connect to a server. This option sets the sqlcmd scripting variable SQLCMDLOGINTIMEOUT. The default time-out for login to sqlcmd is eight seconds. The login time-out must be a number between 0 and 65534. A value of 0 specifies time-out to be infinite.
* readOnly Boolean - Declares the application workload type (-K) as `ReadOnly` when connecting to a server. If specified, the sqlcmd utility will not support connectivity to a secondary replica in an AlwaysOn availability group.
* multisubnetFailover Boolean (-M) - Always specify this option when connecting to the availability group listener of a SQL Server availability group or a SQL Server Failover Cluster Instance. This option provides for faster detection of and connection to the (currently) active server. If this option is not specified, it is off. (-M)
* encryptedConnection Boolean (-N) - This switch is used by the client to request an encrypted connection.


## Other Details

### Install SQL Server command line tools on Linux

While the [Microsoft instructions](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup-tools?view=sql-server-ver15) should work,
I noticed on at least Pop!_OS/Ubuntu/Debian in 19.10+ that the instructions fail in practice.  For ubuntu, you should first isntall `unixodbc` first, then install `mssql-tools`.

Setup:
```bash
sudo apt update
sudo apt install unixodbc
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
sudo apt update
sudo apt install mssql-tools
echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
```

## Related Projects

Some knowledge for this project was learned from reading the source for [@quorum/sqlcmd-runner](https://www.npmjs.com/package/@quorum/sqlcmd-runner).

## License

MIT License
