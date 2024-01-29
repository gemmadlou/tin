export const useHttp = () => {
    const fetch = $fetch.create({
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        onResponseError({ request, error, response}) {
            console.error('onResponseError', { error })
            if (response.status === 401) {
                console.log('Redirecting to /')
                window.location.pathname = "/"
            }
        }
    })

    return fetch
}