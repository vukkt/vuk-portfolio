import type { Project } from '../data/portfolio';

export const STATUS_LABELS: Record<Project['status'], string> = {
  'open-source': 'Open source',
  'eu-project': 'EU project',
  wip: 'In progress',
};
