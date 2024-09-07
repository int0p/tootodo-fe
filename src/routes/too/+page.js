import { getThis3WeeksRange } from '$lib/utils';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const date_range = getThis3WeeksRange();
	const start_date = date_range.start;
	const end_date = date_range.end;
	throw redirect(302, `/too/tasks?start_date=${start_date}&end_date=${end_date}`);
}
