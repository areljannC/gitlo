import { defineEventHandler } from 'h3';
import { getTimestamp } from '~/utils';

export default defineEventHandler(() => ({ message: 'pong', timestamp: getTimestamp() }));
