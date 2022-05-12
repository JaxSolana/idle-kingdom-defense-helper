import { theme } from '$lib/styles/themes/index.css';
import { style } from '@vanilla-extract/css';

export const fortressContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[3],
  paddingTop: theme.space[4],
});

export const buttonIcon = style({
  width: theme.sizes[6],
  height: theme.sizes[6],
});

export const bulkEditContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[4],
  marginBottom: theme.space[6],
});

export const bulkEditForm = style({
  display: 'flex',
  gap: theme.space[4],
  justifyContent: 'center',
  alignItems: 'flex-end',
  marginBottom: theme.space[8],
});

export const flex = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.space[4],
});

export const icon = style({
  width: theme.sizes[6],
  height: 'auto',
});
