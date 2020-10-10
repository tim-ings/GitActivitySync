import simpleGit from 'simple-git';
import { v4 as uuid } from 'uuid';
import { promises as fs } from 'fs';
import { ContributionsMap } from './github';

const message = (msg?: string) => `GitActivitySync: ${msg}`;

const tmpDir = `/tmp/${uuid()}`;
process.on('exit', async () => await fs.rmdir(tmpDir));

const git = simpleGit({ baseDir: tmpDir });

const init = async (remote: string) => {
  await fs.mkdir(tmpDir);
  await git.init();
  await git.addRemote('origin', remote);
  await git.pull('origin', 'master');
}

const commit = async (date: Date) => {
  await git.commit(message(date.toISOString()));
}

export const syncContributions = async (contributions: ContributionsMap) => {
  // make all the commits
  for (const [date, count] of contributions.entries()) {
    for (let i = 0; i < count; i++) {
      await commit(date);
    }
  }
}