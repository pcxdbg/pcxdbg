import {HttpHeaderMap} from './http-header-map';

/**
 * HTTP response
 * @param <RS> Response type
 */
interface HttpResponse<RS> {
    statusCode: number;
    headers?: HttpHeaderMap;
    data?: RS;
}

export {
    HttpResponse
};
