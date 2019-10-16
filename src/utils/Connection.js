const url = 'http://172.16.1.20:3000/api/v1';
const apiUrl = {
    baseUrl: `${url}/`,
    getRequests: `${url}/sittingRequests/listParent`,
    getInvitations: `${url}/invitations/`,
    login: `${url}/auth/login`,
    getRecommend: `${url}/sittingRequests/recommend/`,
}

export default apiUrl;

