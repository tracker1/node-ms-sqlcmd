import path from 'path';
import sql from 'mssql';
import runSqlcmd from '../../../src/index';

describe('scripts/integration-tests/deploy', () => {
  it('will run a deployment', async () => {
    // arrange
    const conn = 'mssql+tcp://sa:Let_Me_In@localhost:51433/';
    const scripts = [path.join(__dirname, 'deploy.sql')];
    const vars = {
      DatabaseName: 'DeployOverride',
      DefaultFilePrefix: 'DeployOverride',
    };

    // act
    try {
      await runSqlcmd(conn, scripts, vars, { echo: true });
    } catch (error) {
      console.log('\n\n', error, '\n\n');
      throw error;
    }

    // assert
    const db = await sql.connect({
      server: 'localhost',
      port: 51433,
      user: 'sa',
      passwprd: 'Let_Me_In',
    }); // 'mssql://sa:Let_Me_In@localhost:51433/DeployOverride?enableArithAbort=true'

    const result = db.query`
      SELECT [Value]
      FROM [Configuration]
      WHERE [Key] = ${'DbVersion'}
    `;
    console.dir(result);
  });
});
