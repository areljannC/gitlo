import { getTimestamp } from '~/shared/utils';

export default defineEventHandler(async event => {
	return { message: 'PUT', timestamp: getTimestamp() };
});
