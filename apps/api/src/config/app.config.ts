import { TeamsPlugin } from '@gitlumen/plugin-teams';
import { GitLumenPlugin } from '@gitlumen/core';
import { Type } from '@nestjs/common';

export interface GitLumenConfig {
  plugins: Type<GitLumenPlugin>[];
}

export const gitlumenConfig: GitLumenConfig = {
  plugins: [
    TeamsPlugin,
  ],
};
