import fetch from 'node-fetch';
import { parse } from 'node-html-parser';
import { Octokit } from '@octokit/rest';

export type ContributionsMap = Map<Date, number>;

export const loadContributions = async (username: string): Promise<ContributionsMap> => {
  const response = await fetch(`https://github.com/users/${username}/contributions`);
  const data = await response.text();
  const contributions: Map<Date, number> = new Map();
  parse(data).querySelectorAll('rect.day')
    .map(e => ({
      date: new Date(e.attributes['data-date']),
      count: Number(e.attributes['data-count']),
    }))
    .filter(c => c.count > 0)
    .forEach(c => contributions.set(c.date, c.count));
  return contributions;
};
