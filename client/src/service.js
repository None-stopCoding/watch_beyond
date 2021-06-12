const callService = (url, options) =>
    fetch(`http://localhost:5000/${url}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(options.method === 'POST' ? {'Content-Type': 'application/json'} : {})
        }
    })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            return data;
        })
        .catch(error => {
            console.error(`There was an error! (${url}): `, error);
        });

const parseGetParams = (params) => Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

export const getAttributesTrends = (params) =>
    callService('api/attributes/trends', {
        method: 'POST',
        body: JSON.stringify({ params })
    })


export const getAttributes = (params) =>
    callService(`api/attributes/getAll?${parseGetParams(params)}`, { method: 'GET' })
        .then((res) => res || [])

export const getAttributeById = (params) =>
    callService(`api/attribute/get?${parseGetParams(params)}`, { method: 'GET' })
        .then((res) => res || {})