export const prerender = false;

// import type { LayoutServerLoad } from './$types';
// import { redirect } from '@sveltejs/kit';

// export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
//     const ServerUrl = import.meta.env.VITE_SERVER_ENDPOINT;

//     let accessToken = cookies.get('access_token');
//     const refreshToken = cookies.get('refresh_token');

//     if(!accessToken && refreshToken) {
//         const refreshRes = await fetch(`${ServerUrl}/api/auth/refresh`, {
//             method: 'GET', 
//             credentials: 'include', 
//             headers : {
//                   "Content-Type": "application/json",
//                   "Accept": "application/json",
//             }
//         });

//         if (refreshRes.ok)  {
//             // 새 accessToken을 얻기 위해 페이지를 리로드합니다.
//             const { access_token: newAccessToken } = await refreshRes.json();
//             if (newAccessToken){                
//                 accessToken = newAccessToken;
//             }
//         } else {
//             // 리프레시 토큰도 유효하지 않은 경우 로그인 페이지로 리디렉션
//             throw redirect(307, '/login');
//         }
//     }

//     // 사용자 프로필 정보를 가져옵니다.
//     let profileRes = await fetch(`${ServerUrl}/api/users/me`, {
//         headers: {
//             Authorization: `Bearer ${accessToken}`
//         }
//     });

//     if (profileRes.ok) {
//         // 프로필 정보를 성공적으로 가져온 경우
//         const profile = await profileRes.json();
//         return {
//             user: { ...profile, verified: true }
//         };
//     } else {
//         // 기타 에러 처리
//         return {
//             user: null
//         };
//     }
// };
