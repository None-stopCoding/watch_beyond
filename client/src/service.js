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
    callService(`api/profile/getTrends?${parseGetParams(params)}`, { method: 'GET' })


export const getAttributes = (companyId, params) =>
    callService(`api/attribute/${companyId}/getAll?${parseGetParams(params)}`, { method: 'GET' })
        .then((res) => res || [])

export const getAttributeById = (id) =>
    callService(`api/attribute/getOne/${id}`, { method: 'GET' })
        .then((res) => res || {})