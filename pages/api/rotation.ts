import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    result: Array<Array<number>>;
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    // Request BodyにJSON形式のデータ
    const params = req.body
    var r: number = params.r
    var source: number[][] = []
    console.log(params.source)
    if (params.source) {
        source = JSON.parse(params.source) ?? []
    }
    // 戻り値配列初期化
    var Nm = source.length - 1
    var results: number[][] = []
    for (let i = 0; i <= Nm; i++) {
        let row: number[] = []
        results.push(row)
    }
    // 回転無し
    if (r == 0) {
        for (let i = 0; i <= Nm; i++) {
            for (let j = 0; j <= Nm; j++) {
                results[i][j] = source[i][j]
            }
        }
    }
    // 90度回転
    if (r == 1) {
        results[0][0] = source[0][2]
        results[0][1] = source[1][2]
        results[0][2] = source[2][2]
        results[1][0] = source[0][1]
        results[1][1] = source[1][1]
        results[1][2] = source[2][1]
        results[2][0] = source[0][0]
        results[2][1] = source[1][0]
        results[2][2] = source[2][0]
    }
    // 180度回転
    if (r == 2) {
        results[0][0] = source[2][2]
        results[0][1] = source[2][1]
        results[0][2] = source[2][0]
        results[1][0] = source[1][2]
        results[1][1] = source[1][1]
        results[1][2] = source[1][0]
        results[2][0] = source[0][2]
        results[2][1] = source[0][1]
        results[2][2] = source[0][0]
    }
    // 270度回転
    if (r == 3) {
        results[0][0] = source[2][0]
        results[0][1] = source[1][0]
        results[0][2] = source[0][0]
        results[1][0] = source[2][1]
        results[1][1] = source[1][1]
        results[1][2] = source[0][1]
        results[2][0] = source[2][2]
        results[2][1] = source[1][2]
        results[2][2] = source[0][2]
    }

    res.status(200).json({ result: results });
}