import { loadContributions } from './github';

const throwError = (msg?: string) => { throw Error(msg) };
const env = {
  sourceUser: process.argv[2] ?? process.env.SOURCE_USER ?? throwError('source user not provided'),
  destinationUser: process.argv[3] ?? process.env.DESTINATION_USER ?? throwError('destination user not provided'),
  destinationRepo: process.argv[3] ?? process.env.DESTINATION_REPO ?? throwError('destination repo not provided'),
}

const main = async () => {
  const sourceContributions = await loadContributions(env.sourceUser);
  const destinationContributions = await loadContributions(env.destinationUser);
  console.log(sourceContributions);
  console.log(destinationContributions);
}

main();
