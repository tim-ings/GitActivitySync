import simpleGit from 'simple-git';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import rimraf from 'rimraf';
import { ContributionsMap } from './github';

const gitService = (baseDir: string, remote: string, branch: string) => {
  try { fs.mkdirSync(baseDir, { recursive: true }); } catch { }
  const git = simpleGit({ baseDir,  });
  process.on('exit', () => rimraf.sync(baseDir));
  const commitFile = `${baseDir}/README.md`;

  return {
    pull: async (keyPath: string) => {
      await git.init();
      await git.addConfig('core.sshCommand', `ssh -i ${keyPath}`);
      await git.addRemote('origin', remote);
      await git.pull('origin', branch);
    },
    push: async (keyPath: string) => {
      await git.addConfig('core.sshCommand', `ssh -i ${keyPath}`);
      await git.push(remote, branch, {  });
    },
    commit: async (date: Date, name: string, email: string) => {
      const message = `GitActivitySync: ${date.toDateString()}`;
      const author = `${name} <${email}>`;
      fs.writeFileSync(commitFile, `# ${message}`);
      await git.commit(message, '.', { '--date': date.toISOString(), '--author': author });
    },
    log: async () =>  git.log(),
  }
}

export const syncContributions = async (remote: string, contributions: ContributionsMap, branch: string, name: string, email: string, keyPath: string) => {
  const tmpDir = `./tmp/${uuid()}`;
  const { pull, push, commit, log } = gitService(tmpDir, remote, branch);

  console.log(`Pulling remote: ${remote}`);
  await pull(keyPath);

  const { all } = await log();
  const existingDates = new Set(all.map(entry => new Date(entry.date).toDateString()));
  console.log(`Found ${existingDates.size} existing dates`);

  for (const [date, count] of contributions.entries()) {
    if (existingDates.has(date.toDateString())) continue;
    for (let i = 0; i < count; i++) {
      await commit(date, name, email);
      console.log(`Committed ${date}`);
    }
  }

  await push(keyPath);
  console.log(`Pushed remote: ${remote}`);
};
