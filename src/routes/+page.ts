export const prerender = true;
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getThisWeekRange } from '$lib/utils';

export const load: PageLoad = async ({ url ,cookies }) => {
  const date_range = getThisWeekRange();
	const start_date = date_range.start;
	const end_date = date_range.end;

  if(!url.pathname.startsWith('/login')) {
    throw redirect(302, `/do?start_date=${start_date}&end_date=${end_date}`);
  }
}