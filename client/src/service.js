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

export const getAttributesTrends = (companyId, params) =>
    callService(`api/profile/${companyId}/getTrends?${parseGetParams(params)}`, { method: 'GET' })


export const getAttributes = (companyId, params) =>
    callService(`api/attribute/${companyId}/getAll?${parseGetParams(params)}`, { method: 'GET' })
        .then((res) => res || [])

export const getAttributeById = (id) =>
    callService(`api/attribute/getOne/${id}`, { method: 'GET' })
        .then((res) => res || {})

export const getBorderAnalysisDates = (companyId) => {
    let firstDate = null;
    return callService(`/api/settings/${companyId}/analysis/getFirstDate`, { method: 'GET' })
        .then((date) => firstDate = date)
        .then(() => callService(`/api/settings/${companyId}/analysis/getLastDate`, { method: 'GET' }))
        .then((date) => ({
            first: firstDate,
            last: date
        }));
};

export const getTimeline = (companyId, params) =>
    callService(`/api/settings/${companyId}/analysis/getTimeline?${parseGetParams(params)}`, { method: 'GET' })