/**
 * @param export: Array<Array<number>> - The export value of the state
 * @param baseValue: Array<Array<number>> - The base value of the state
 */
export default function (record: Array<Array<number>>, baseValue: Array<Array<number>>): number
{
    var v: number = 0
    for(let i: number = 0; i < record.length; i++ ) {
        for( let j: number = 0; j < record[ 0 ].length; j++) {
            v += record[i][j] * baseValue[i][j]
        }
    }
    return v
}