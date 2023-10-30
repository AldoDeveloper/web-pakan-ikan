import { configData } from '../../config';

const url_backend = configData.API_BACKEND;

export interface optionSwr{
    url?: string,
    option?: RequestInit
}

export const swrFetch = (option: optionSwr) => fetch(`${url_backend}/${option?.url}`, option?.option).then(res => res.json())