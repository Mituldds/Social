export const success = (result) => {
    return {
        status: 'ok',
        result,
    }
}

export const error = (message) => {
    return {
        status: 'error',
        message,
    }
}