import axios from 'axios';
import { retrieveToken } from 'utils/handleToken';
import { circleAPI } from 'utils/Connection';
import qs from 'qs';

export async function getCircle() {
  const { token } = await retrieveToken();
  const { userId } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const options = {
    method: 'GET',
    url: `${circleAPI.getCircle}${userId}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
  };

  const response = await axios(options).catch((error) => console.log(error));

  return response;
}

export async function create(ownerId, friendId) {
  const { token } = await retrieveToken();
  let trimpedToken = '';
  if (token) trimpedToken = token.replace(/['"]+/g, '');

  const url = circleAPI.addToCircle;
  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${trimpedToken}`,
    },
    data: qs.stringify({ ownerId: ownerId, friendId: friendId }),
  };

  const response = await axios(options);
  return response;
}
