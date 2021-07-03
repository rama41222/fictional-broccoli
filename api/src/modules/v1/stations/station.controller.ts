import { Response, Request } from "express";

const fetchStations = async (request: Request, response: Response): Promise<Response<any, Record<string, any>>> => {
    return response.status(200).json({});
}

export {
    fetchStations
}
