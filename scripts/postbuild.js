import fs, { promises as fsp } from 'fs';
import originalGlob from 'glob';

const glob = pattern =>
  new Promise((resolve, reject) =>
    originalGlob(pattern, (err, results) => (err ? reject(err) : resolve(results)))
  );

export async function main() {
  // create release package.json for dist/
  const pkg = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'));
  delete pkg.devDependencies;
  delete pkg.prettier;
  delete pkg.eslintConfig;
  delete pkg.eslintIgnore;
  delete pkg.jest;
  delete pkg.babel;
  delete pkg.scripts;
  fs.writeFileSync(`${__dirname}/../dist/package.json`, JSON.stringify(pkg, null, 2), 'utf8');

  // copy necessary files to dist/
  fs.copyFileSync(`${__dirname}/../.npmignore`, `${__dirname}/../dist/.npmignore`);
  fs.copyFileSync(`${__dirname}/../LICENSE`, `${__dirname}/../dist/LICENSE`);
  fs.copyFileSync(`${__dirname}/../README.md`, `${__dirname}/../dist/README.md`);

  var paths = await glob(`${__dirname}/../dist/**/*.test.*`);
  await Promise.all(paths.map(p => fsp.unlink(p).catch(() => null)));
}

main().catch(error => {
  console.error(error);
  process.exit(1); // non-zero exit on error
});
