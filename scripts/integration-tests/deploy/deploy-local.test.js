import path from 'path';
import sql from 'mssql';
import findSqlcmd from '../../../src/find-sqlcmd';
import runSqlcmd from '../../../src/index';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('scripts/integration-tests/deploy/deploy-local', () => {
  it('will run a local deployment', async () => {
    // only run if sqlcmd present locally
    const sqlcmd = await findSqlcmd();
    if (!sqlcmd) {
      console.log('\n\n\nWARNING: No local sqlcmd found, skipping integration test.\n\n\n');
      return;
    }

    // arrange
    const conn = 'mssql+tcp://sa:Let_Me_In@localhost:51433/';
    const scripts = [path.join(__dirname, 'deploy.sql')];
    const vars = {
      DatabaseName: 'DeployLocal',
    };

    // act
    try {
      await runSqlcmd(conn, scripts, vars, { echo: false });
    } catch (error) {
      // display error and rethrow - this shouldn't happen
      console.log('\n\n', error, '\n\n');
      throw error;
    }
    await delay(2000);

    // assert
    const db = await sql.connect({
      user: 'sa',
      password: 'Let_Me_In',
      server: 'localhost',
      port: 51433,
      database: 'DeployLocal',
      options: {
        enableArithAbort: true,
        trustServerCertificate: true,
      },
    });
    try {
      const result = await db.query`
        SELECT [Value]
        FROM [Configuration]
        WHERE [Key] = ${'DbVersion'}
      `;
      expect(result.recordset[0]['Value']).toEqual('1');
      await db.close(); // close connection
    } catch (error) {
      try {
        await db.close();
      } catch (_) {}
      console.log('\n\n', error, '\n\n');
      throw error;
    }
  }, 15000);
});
