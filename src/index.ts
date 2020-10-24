import { syncContributions } from './git';
import { loadContributions } from './github';

const throwError = (msg?: string) => { throw Error(msg) };
const env = {
  sourceGithubUser: process.env.SOURCE_USER ?? throwError('source github user not provided'),
  destinationGitRemote: process.env.DESTINATION_REMOTE ?? throwError('destination remote not provided'),
  authorName: process.env.GIT_AUTHOR_NAME ?? throwError('git author name not provided'),
  authorEmail: process.env.GIT_AUTHOR_EMAIL ?? throwError('git author email not provided'),
  branch: process.env.DESTINATION_BRANCH ?? throwError('destination branch not provided'),
  deployKey: process.env.DEPLOY_KEY ?? throwError('deploy key not provided'),
}

const main = async () => {
  const sourceContributions = await loadContributions(env.sourceGithubUser);
  console.log(`Found ${sourceContributions.size} contributions for ${env.sourceGithubUser}`);
  await syncContributions(env.destinationGitRemote, sourceContributions, env.branch, env.authorName, env.authorEmail);
}

main();
