import { syncContributions } from './git';
import { loadContributions } from './github';
import { decode } from 'js-base64';
import * as fs from 'fs';

const keyPath = './id_rsa.temp';

const throwError = (msg?: string) => { throw Error(msg) };
const env = {
  sourceGithubUser: process.env.SOURCE_USER ?? throwError('source github user not provided'),
  destinationGitRemote: process.env.DESTINATION_REMOTE ?? throwError('destination remote not provided'),
  authorName: process.env.GIT_AUTHOR_NAME ?? throwError('git author name not provided'),
  authorEmail: process.env.GIT_AUTHOR_EMAIL ?? throwError('git author email not provided'),
  branch: process.env.DESTINATION_BRANCH ?? throwError('destination branch not provided'),
  deployKey: process.env.DEPLOY_KEY ?? throwError('deploy key not provided'),
}

const saveKey = (key: string) => fs.writeFileSync(keyPath, key);
const removeKey = () => fs.unlinkSync(keyPath);

const main = async () => {
  process.on('exit', removeKey);
  saveKey(decode(env.deployKey));
  const sourceContributions = await loadContributions(env.sourceGithubUser);
  console.log(`Found ${sourceContributions.size} contributions for ${env.sourceGithubUser}`);
  await syncContributions(env.destinationGitRemote, sourceContributions, env.branch, env.authorName, env.authorEmail, keyPath);
}

main();
