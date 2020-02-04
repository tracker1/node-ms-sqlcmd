import path from 'path';
import sql from 'mssql';
import runSqlcmd from '../../../src/index';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('scripts/integration-tests/deploy', () => {
  it('will run a deployment', async () => {
    // only test this on windows with sql tools installed
    if (process.platform !== 'win32') return;

    // arrange
    const conn = 'mssql+tcp://sa:Let_Me_In@localhost:51433/';
    const scripts = [path.join(__dirname, 'deploy.sql')];
    const vars = {
      DatabaseName: 'DeployLocal',
    };

    // act
    try {
      await runSqlcmd(conn, scripts, vars, { echo: true });
    } catch (error) {
      // display error and rethrow - this shouldn't happen
      console.log('\n\n', error, '\n\n');
      throw error;
    }
    await delay(2000);

    // assert
    const db = await sql.connect(
      'mssql://sa:Let_Me_In@localhost:51433/DeployLocal?enableArithAbort=true'
    );
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