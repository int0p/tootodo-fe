import type { Load } from '@sveltejs/kit';
import { CalendarDate } from '@internationalized/date';

export const prerender = false;

export const load: Load = async ({ fetch, url }) => {
	let start_date: String | CalendarDate | null = url.searchParams.get('start_date');
	let end_date: String | CalendarDate | null  = url.searchParams.get('end_date');

	if (!start_date || !end_date) {
		start_date = "";
		end_date = "";
	}
	const path = import.meta.env.VITE_SERVER_ENDPOINT + '/api' +`/tasks?start_date=${start_date}&end_date=${end_date}`;

	try {
		const response = await fetch(path,{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					"Accept": "application/json",
				},
				credentials: 'include',
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
		}
		return await response.json();
	} catch (e) {
		console.error('이벤트를 불러오는 데 실패했습니다:', e);
	}
	return [];
};
