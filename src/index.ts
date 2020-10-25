import { syncContributions } from './git';
import { loadContributions } from './github';

const throwMessage = (msg?: string) => { throw msg };
const env = {
  sourceGithubUser: process.env.SOURCE_USER ?? throwMessage('Missing env: SOURCE_USER'),
  destinationGitRemote: process.env.DESTINATION_REMOTE ?? throwMessage('Missing env: DESTINATION_REMOTE'),
  authorName: process.env.GIT_AUTHOR_NAME ?? throwMessage('Missing env: GIT_AUTHOR_NAME'),
  authorEmail: process.env.GIT_AUTHOR_EMAIL ?? throwMessage('Missing env: GIT_AUTHOR_EMAIL'),
  branch: process.env.DESTINATION_BRANCH ?? throwMessage('Missing env: DESTINATION_BRANCH'),
  deployKey: process.env.DEPLOY_KEY ?? throwMessage('Missing env: DEPLOY_KEY'),
}

const main = async () => {
  const sourceContributions = await loadContributions(env.sourceGithubUser);
  console.log(`Found ${sourceContributions.size} contributions for ${env.sourceGithubUser}`);
  await syncContributions(env.destinationGitRemote, sourceContributions, env.branch, env.authorName, env.authorEmail);
}

main();
