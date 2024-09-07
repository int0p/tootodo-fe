import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const fetch = event.fetch;

	// 로그인 페이지에서는 훅이 동작하지 않도록 예외 처리
	if (event.url.pathname === '/login') {
		return await resolve(event);
	}

	if (!cookies.get('refresh_token') || cookies.get('logged_in')!=='true') {
		// 로그인 페이지로 리디렉션
		// todo: url이동은 하는데, 그 상태에서 새로고침 눌러야 login page로 이동함..
		return new Response(null, {
			status: 302,
			headers: {
			  Location: '/login'
			},
		 });
	}
	
	// access_token 확인 및 갱신
	if (!cookies.get('access_token') && cookies.get('logged_in') ==='true') {
		const path = import.meta.env.VITE_SERVER_ENDPOINT + '/api/auth/refresh';
		let res = await fetch(path, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				"Accept": "application/json",
			},
			credentials: 'include',
		});
		// 응답 헤더에서 set-cookie 값을 추출하여 쿠키 설정
		const setCookieHeader = res.headers.get('set-cookie');
		if (setCookieHeader) {
			const cookieParts = setCookieHeader.split(';')[0].split('=');
			if (cookieParts.length === 2) {
				const [name, value] = cookieParts;
				cookies.set(name, value, { path: '/' });
			}
		}
	}

	// 요청을 처리하고 응답 반환
	const response = await resolve(event);
	return response;
}
