import { format } from 'date-fns';

export const parseTimestamp = (timestamp: string): string | void => {
	try {
		return format(new Date(timestamp), 'yyyy/MM/dd hh:mm a');
	} catch {
		console.error('Error parsing timestamp.');
	}
};
