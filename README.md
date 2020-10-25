# Git Activity Sync

Keeps your GitHub contributions graph on your main account up to date by copying activity from another account.

## Usage

Set up a job to run this image once per day, making sure to pass in the following environment variables:

| Variable | Description | Example |
|---|---|---|
| SOURCE_USER | Username of the GitHub account you wish to clone activity from. You will need to [enable private contributions on your profile](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/publicizing-or-hiding-your-private-contributions-on-your-profile) if you want them to be cloned. | `YourWorkAccount` |
| DESTINATION_REMOTE | SSH remote URL for the repo you want to mirror commits to. This would ideally be a private repo. | `git@github.com:tim-ings/git-activity-sync-mirror.git` |
| GIT_AUTHOR_NAME | The same name you use when making commits with your main account | `Tim Ings` |
| GIT_AUTHOR_EMAIL | The same email you use when making commits with your main account | `tim@tim-ings.com` |
| DESTINATION_BRANCH | The branch of the mirror repo that the commits will be made to | `main` |
| DEPLOY_KEY | Base64 encoded private [deploy key](https://docs.github.com/en/free-pro-team@latest/developers/overview/managing-deploy-keys#deploy-keys) that has write access | `aHVudGVyMiAtbgo=` |
