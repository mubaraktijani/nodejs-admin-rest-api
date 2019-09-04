'use strict';

function formatJSend(req, res, body) {
    function formatError(res, body) {        
        if (body.name === 'AuthorizationError') {
            body.status = 401;

            body.name = 'UnauthorizedError';
            body.code = body.name;
            body.stack = body.AuthorizationError;
            res.statusCode = (typeof body.status === 'number') ? body.status : res.statusCode;
        }

        body = (body.body !== undefined) ? body.body : body;
        const isClientError = res.statusCode >= 400 && res.statusCode <= 500;

        if (isClientError) {
            return {
                status: 'error',
                message: body.message,
                code: body.code
            };
        } else {
            const inDebugMode = process.env.ENV === 'development';

            return {
                status: 'error',
                message: inDebugMode ? body.message : 'Internal Server Error',
                code: inDebugMode ? body.code : 'INTERNAL_SERVER_ERROR',
                data: inDebugMode ? body.stack : undefined
            };
        }
    }

    function formatSuccess(res, body) {
        let successRes = {};

        successRes.status = 'success';

        if (typeof body === 'string') {
            successRes.message = body;
            return successRes;
        }

        successRes.user = (body.user) ? body.user : undefined;
        successRes.data = (body.data) ? body.data : body;
        successRes.token = (body.token) ? body.token : undefined;
        successRes.pagination = (body.pagination) ? body.pagination : undefined;

        return successRes;
    }

    let response;

    if (body instanceof Error) {
        response = formatError(res, body);
    } else {
        response = formatSuccess(res, body);
    }

    response = JSON.stringify(response);
    res.header('Content-Length', Buffer.byteLength(response));
    res.header('Content-Type', 'application/json');

    return response;
}

module.exports = formatJSend;