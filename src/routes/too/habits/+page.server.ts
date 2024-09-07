import type { Load } from '@sveltejs/kit';
import { type DateValue } from "@internationalized/date";
import { v4 as uuidv4 } from 'uuid';
import type { Habit } from '$lib/schema';

export const prerender = false;

export const load: Load = async ({ fetch, url }) => {
	let start_month: String | DateValue | null = url.searchParams.get('start_month');
	let end_month: String | DateValue | null  = url.searchParams.get('end_month');

	if (!start_month || !end_month) {
		start_month =  "";
		end_month =  "";
	}
	const path = import.meta.env.VITE_SERVER_ENDPOINT + '/api' +`/habits?start_month=${start_month}&end_month=${end_month}`;

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
		const res_json = await response.json();
		if (res_json.habits.length === 0) {
			res_json.habits = dummyHabits;
		}
		return await res_json;
	} catch (e) {
		console.error('습관을 불러오는 데 실패했습니다:', e);
	}
	return [];
};

const dummyHabits: Habit[] = [
	{
	id: uuidv4(),
	user: uuidv4(),
	name: 'Morning Exercise',
	icon: 'Hexagon',
	color: 'blue',
	records: [
		{
			start_at: '2024-06-01T06:00:00Z',
			end_at: '2024-06-01T06:30:00Z',
			msg: '30 minutes of running',
			photo: 'exercise1.jpg'
		},
		{
			start_at: '2024-06-02T06:00:00Z',
			end_at: '2024-06-02T06:30:00Z',
			msg: 'Morning yoga',
			photo: 'yoga1.jpg'
		}
	],
	status: 'InProgress',
	createdAt: '2024-05-01T08:00:00Z',
	updatedAt: '2024-06-01T08:00:00Z'
	},
	{
	id: uuidv4(),
	user: uuidv4(),
	name: 'Reading Books',
	icon: 'Hexagon',
	color: 'green',
	records: [
		{
			start_at: '2024-06-01T19:00:00Z',
			end_at: '2024-06-01T20:00:00Z',
			msg: 'Read 50 pages of a novel',
			photo: 'reading1.jpg'
		},
		{
			start_at: '2024-06-02T19:00:00Z',
			end_at: '2024-06-02T20:00:00Z',
			msg: 'Finished a chapter of a business book',
			photo: 'reading2.jpg'
		}
	],
	status: 'InProgress',
	createdAt: '2024-05-15T08:00:00Z',
	updatedAt: '2024-06-01T08:00:00Z'
	},
	{
	id: uuidv4(),
	user: uuidv4(),
	name: 'Meditation',
	icon: 'Hexagon',
	color: 'purple',
	records: [
		{
			start_at: '2024-06-01T07:00:00Z',
			end_at: '2024-06-01T07:15:00Z',
			msg: '15 minutes of meditation',
			photo: 'meditation1.jpg'
		},
		{
			start_at: '2024-06-02T07:00:00Z',
			end_at: '2024-06-02T07:15:00Z',
			msg: 'Morning mindfulness session',
			photo: 'meditation2.jpg'
		}
	],
	status: 'Archived',
	createdAt: '2024-05-20T08:00:00Z',
	updatedAt: '2024-06-01T08:00:00Z'
	}
];
