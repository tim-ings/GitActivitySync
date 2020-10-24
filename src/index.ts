import { syncContributions } from './git';
import { loadContributions } from './github';

const throwError = (msg?: string) => { throw Error(msg) };
const env = {
  sourceGithubUser: process.argv[2] ?? process.env.SOURCE_GITHUB_USER ?? throwError('source github user not provided'),
  destinationGitRemote: process.argv[4] ?? process.env.DESTINATION_GIT_REMOTE ?? throwError('destination remote not provided'),
}

const main = async () => {
  const sourceContributions = await loadContributions(env.sourceGithubUser);
  console.log(`Found ${sourceContributions.size} contributions for ${env.sourceGithubUser}`);
  await syncContributions(env.destinationGitRemote, sourceContributions);
}

main();
