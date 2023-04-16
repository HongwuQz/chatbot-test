import { useState, useEffect } from 'react';
import { message } from 'antd';
import useSessionStorage from './useSessionStorage';

export interface FetchApiOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: 'POST' | 'GET'
  body?: BodyInit | object
  needAuth?: boolean
}

const TEST_TOKEN = 'eyKyqrGwp2R8ZHN3dHZ5dXh5eHR7ZG5kpbGmp2R8ZGRuZLKjtbVkfGSovHRyc3t4e3d0eHtkvw'

export const useApi = <T>(url: string, { method, body, needAuth }: FetchApiOptions) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const { getSessionItem } = useSessionStorage()

  useEffect(() => {
    const fetchData = async () => {
    //   const authorizaion = await needAuth && { Auth: getSessionItem("TOKEN") }
    const authorizaion = needAuth && { Auth: TEST_TOKEN }
      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            ...authorizaion
          } as HeadersInit,
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.Code === 200) {
          setData(json.Data);
        } else {
          message.error(json.Msg);
        }
      } catch (error) {
        message.error('Network Error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, body, needAuth, getSessionItem, method]);

  return { data, loading };
};