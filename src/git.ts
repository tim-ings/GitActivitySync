import simpleGit from 'simple-git';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { ContributionsMap } from './github';

const gitService = (baseDir: string, remote: string) => {
  try { fs.mkdirSync(baseDir, { recursive: true }); } catch { }
  const git = simpleGit({ baseDir });
  process.on('exit', () => rimraf.sync(baseDir));
  const commitFile = `${baseDir}/README.md`;

  return {
    pull: async () => {
      await git.init();
      await git.addRemote('origin', remote);
      await git.pull('origin', 'master');
    },
    push: async () => {
      await git.push(remote, 'master');
    },
    commit: async (date: Date) => {
      const message = `GitActivitySync: ${date.toDateString()}`;
      fs.writeFileSync(commitFile, `# ${message}`);
      await git.commit(message, '.', { '--date': date.toISOString() });
    },
    log: async () =>  git.log(),
  }
}

export const syncContributions = async (remote: string, contributions: ContributionsMap) => {
  const tmpDir = `./tmp/${uuid()}`;
  const { pull, push, commit, log } = gitService(tmpDir, remote);

  console.log(`Pulling remote: ${remote}`);
  await pull();

  const { all } = await log();
  const existingDates = new Set(all.map(entry => new Date(entry.date).toDateString()));
  console.log(`Found ${existingDates.size} existing dates`);

  for (const [date, count] of contributions.entries()) {
    if (existingDates.has(date.toDateString())) continue;
    for (let i = 0; i < count; i++) {
      await commit(date);
      console.log(`Committed ${date}`);
    }
  }

  await push();
  console.log(`Pushed remote: ${remote}`);
};
