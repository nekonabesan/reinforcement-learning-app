export default function (
    r: number,
    source: Array<Array<number>>
): Array<Array<number>> {
    if (!source) {
        source = []
    }
    // 戻り値配列初期化
    var Nm = source.length - 1
    var results: Array<Array<number>> = []
    for (let i = 0; i <= Nm; i++) {
        let row: number[] = [0, 0, 0]
        results.push(row)
    }
    // 反転無し
    if (r == 0) {
        for (let i = 0; i <= Nm; i++) {
            for (let j = 0; j <= Nm; j++) {
                results[i][j] = source[i][j]
            }
        }
    }
    // 横軸対象反転
    if (r == 1) {
        results[0][0] = source[2][0]
        results[0][1] = source[2][1]
        results[0][2] = source[2][2]
        results[1][0] = source[1][0]
        results[1][1] = source[1][1]
        results[1][2] = source[1][2]
        results[2][0] = source[0][0]
        results[2][1] = source[0][1]
        results[2][2] = source[0][2]
    }
    // 縦軸対象反転
    if (r == 2) {
        results[0][0] = source[0][2]
        results[1][0] = source[1][2]
        results[2][0] = source[2][2]
        results[0][1] = source[0][1]
        results[1][1] = source[1][1]
        results[2][1] = source[2][1]
        results[0][2] = source[0][0]
        results[1][2] = source[1][0]
        results[2][2] = source[2][0]
    }
    // 右上斜軸対象反転
    if (r == 3) {
        results[0][0] = source[2][2]
        results[0][1] = source[1][2]
        results[0][2] = source[0][2]
        results[1][0] = source[2][1]
        results[1][1] = source[1][1]
        results[1][2] = source[0][1]
        results[2][0] = source[2][0]
        results[2][1] = source[1][0]
        results[2][2] = source[0][0]
    }
    // 右下斜軸対象反転
    if (r == 4) {
        results[0][0] = source[0][0]
        results[0][1] = source[1][0]
        results[0][2] = source[2][0]
        results[1][0] = source[0][1]
        results[1][1] = source[1][1]
        results[1][2] = source[2][1]
        results[2][0] = source[0][2]
        results[2][1] = source[1][2]
        results[2][2] = source[2][2]
    }

    return results;
}