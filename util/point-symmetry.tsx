/**
 * 点対称
 * 
 * @param source 入力配列
 * @returns 点対称の結果
 */
export default function ( source: Array<Array<number>>): Array<Array<number>> 
{
    var results: Array<Array<number>> = []
    for(let i: number = 0; i < source.length; i++){
        results[i] = [];
    }

    results[0][0] = source[2][2]; //8
    results[0][1] = source[2][1]; //7
    results[0][2] = source[2][0]; //6

    results[1][0] = source[1][2]; //5
    results[1][1] = source[1][1]; //4
    results[1][2] = source[1][0]; //3

    results[2][0] = source[0][2]; //2
    results[2][1] = source[0][1]; //1
    results[2][2] = source[0][0]; //0

    return results;
}