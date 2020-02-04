import path from 'path';
import sql from 'mssql';
import runSqlcmd from '../../../src/index';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('scripts/integration-tests/deploy', () => {
  it('will run a deployment', async () => {
    // arrange
    const conn = 'mssql+docker://sa:Let_Me_In@localhost:51433/';
    const scripts = [path.join(__dirname, 'deploy.sql')];
    const vars = {
      DatabaseName: 'DeployDocker',
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
      'mssql://sa:Let_Me_In@localhost:51433/DeployDocker?enableArithAbort=true'
    );
    const result = await db.query`
      SELECT [Value]
      FROM [Configuration]
      WHERE [Key] = ${'DbVersion'}
    `;
    expect(result.recordset[0]['Value']).toEqual('1');
    await db.close(); // close connection
  }, 15000);
});
