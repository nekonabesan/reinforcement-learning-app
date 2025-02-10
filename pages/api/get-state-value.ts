import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    v: number;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const params = req.body
    var baseValue: number[][] = []
    var record: number[][] = []
    var v = 0
    if (params.record) {
        record = JSON.parse(params.record) ?? []
    } else {
        record = []
    }
    if (params.baseValue) {
        record = JSON.parse(params.baseValue) ?? []
    } else {
        record = []
    }

    for (let i = 0; i < record.length; i++) {
        for (let j = 0; i < record[0].length; j++) {
            v += record[i][j] + baseValue[i][j]
        }
    }

    res.status(200).json({ v: v });
}