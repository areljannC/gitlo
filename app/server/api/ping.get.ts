import { defineEventHandler } from 'h3';
import { getTimestamp } from '~/shared/utils';

export default defineEventHandler(event => {
	setResponseStatus(event, 200);
	return { message: 'pong', timestamp: getTimestamp() };
});
