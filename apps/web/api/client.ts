import { isServer } from '@tanstack/react-query';

import axios, { AxiosHeaders } from 'axios';

export const baseURL = `http://${process.env.NEXT_PUBLIC_REST_HOSTNAME}:${process.env.NEXT_PUBLIC_REST_PORT}`;

export const getApiClient = async () => {
  let headers: AxiosHeaders | undefined;
  if (isServer) {
    const { headers: getHeaders } = await import('next/headers');
    headers = getHeaders() as unknown as AxiosHeaders;
  }

  return axios.create({
    baseURL,
    withCredentials: true,
    headers
  });
};
