import { Response } from "express";
import { IHttpResponse } from "../common/interface/http.response.interface";

export class ResponseHelper {
    static send(res: Response, output: IHttpResponse & 
        { 
            isSuccess: boolean; 
            messageDto: any; 
            data: any 
        }) {
        const content = {
            success: output.isSuccess,
            message: output.messageDto,
            data: output.data
        };

        return res.status(output.httpStatus).json(content);
    }
}