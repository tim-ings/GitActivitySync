import simpleGit from 'simple-git';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { ContributionsMap } from './github';

const gitService = (baseDir: string, remote: string, branch: string) => {
  try { fs.mkdirSync(baseDir, { recursive: true }); } catch { }
  const git = simpleGit({ baseDir });
  const commitFile = `${baseDir}/README.md`;

  return {
    clone: () => git.clone(remote, baseDir),
    push: () => git.push(remote, branch),
    log: () => git.log(),
    commit: async (date: Date, name: string, email: string) => {
      const message = `GitActivitySync: ${date.toDateString()}`;
      fs.writeFileSync(commitFile, `# ${message}`);
      await git.addConfig('user.email', email);
      await git.addConfig('user.name', name);
      await git.commit(message, '.', { '--date': date.toISOString()});
    },
  }
}

export const syncContributions = async (remote: string, contributions: ContributionsMap, branch: string, name: string, email: string) => {
  const tmpDir = `/tmp/${uuid()}`;
  const { clone, push, commit, log } = gitService(tmpDir, remote, branch);

  await clone();
  console.log(`Cloned: ${remote}`);

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

  await push();
  console.log(`Pushed: ${remote}`);
};
