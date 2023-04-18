import { useState, useEffect } from 'react';
import { message } from 'antd';
import { useCookies } from 'react-cookie';

export interface FetchApiOptions extends Omit<RequestInit, 'body' | 'method'> {
  method?: 'POST' | 'GET'
  body?: BodyInit | object
  needAuth?: boolean
}

// const TEST_TOKEN = 'eyKyqrGwp2R8ZHN3dHZ5dXh5eHR7ZG5kpbGmp2R8ZGRuZLKjtbVkfGSovHRyc3t4e3d0eHtkvw'

export const useApi = <T>(url: string, { method = 'POST', body }: FetchApiOptions, needAuth?: boolean, reload?: boolean) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['TOKEN'])

  useEffect(() => {
    const fetchData = async () => {
    //   const authorizaion = await needAuth && { Auth: getSessionItem("TOKEN") }
    const authorizaion = needAuth && { Auth: cookies.TOKEN }
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
  }, [url, body, needAuth, cookies, method, reload]);

  return { data, loading };
};