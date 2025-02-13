/**
 * 
 * 
 * @param {Array<Array<number>>} data
 * @param {number} [resultValue_01=1]
 * @param {number} [resultValue_02=-1]
 */
export default function(data: Array<Array<number>>, resultValue_01: number = 1, resultValue_02: number = -1): Array<Array<number>>
{
    
    var results: Array<Array<number>> = [];
    // 戻り値配列を初期化
    data.forEach((line, i) => {
        results[i] = [];
        data[i].forEach((value, j) => {
            results[i][j] = 0
        })
    })
    // 横列
    data.forEach((line, i: number) => {
        if( data[i][0] * data[i][1] * data[i][2] == 1 ) {
            // for( let j = 0; j < data[0].length; j++ ) results[i][j] = resultValue_01;
            data[0].forEach((value, j) => {
                results[i][j] = resultValue_01
            })
        }
        if( data[i][0] * data[i][1] * data[i][2] == 8 ){
            // for( let j = 0; j < data[0].length; j++ ) results[i][j] = resultValue_02;
            data[0].forEach((value, j) => {
                results[i][j] = resultValue_02
            })
        }
    })
    // 縦列
    data.forEach((value, j) => {
        if (data[0][j] * data[1][j] * data[2][j] == 1) {
            //for(let i: number = 0; i < data.length; i++ ) results[i][j] = resultValue_01
            data.forEach((value: Array<number>, i: number) => {
                results[i][j] = resultValue_01
            })
        }
        if (data[0][j] * data[1][j] * data[2][j] == 8) {
            //for( let i: number = 0; i < data.length; i++ ) results[i][j] = resultValue_02
            data.forEach((value: Array<number>, i: number) => {
                results[i][j] = resultValue_02
            })
        }
    })

    //右上斜め
    if (data[0][0] * data[1][1] * data[2][2] == 1) {
        //for( let i = 0; i<data.length; i++ ) results[i][i] = resultValue_01;
        data.forEach((value: Array<number>, i: number) => {
            results[i][i] = resultValue_01
        })
    }
    if (data[0][0] * data[1][1] * data[2][2] == 8) {
        //for( let i = 0; i<data.length; i++ ) results[i][i] = resultValue_02;
        data.forEach((value: Array<number>, i: number) => {
            results[i][i] = resultValue_02
        })
    }
    //右下斜め
    if (data[2][0] * data[1][1] * data[0][2] == 1) {
        //for( let i = 0; i<data.length; i++ ) results[data.length-1-i][i] = resultValue_01;
        data.forEach((value: Array<number>, i: number) => {
            results[data.length - 1 - i][i] = resultValue_01
        })
    }
    if (data[2][0] * data[1][1] * data[0][2] == 8) {
        //for( let i = 0; i<data.length; i++ ) results[data.length-1-i][i] = resultValue_02;
        data.forEach((value: Array<number>, i: number) => {
            results[data.length - 1 - i][i] = resultValue_02
        })
    }

    return results;
}