import { theme } from '$lib/styles/themes/index.css';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  margin: '0 auto',
  maxWidth: theme.breakpoints['2xl'],
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});
