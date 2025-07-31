import { HttpStatus } from "@nestjs/common";

export interface IHttpResponse
{
    httpStatus: HttpStatus;
}