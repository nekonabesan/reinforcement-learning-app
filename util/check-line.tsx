export default function( data: Array<Array<number>> ): Array<Array<number>>
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
    data.forEach((line, i) => {
        data.forEach((line, i) => {
            if (data[i][0] * data[i][1] * data[i][2] == 1) {
                for( let j = 0; j < data[0].length; j++ ) results[i][j] = 1
            }
            if (data[i][0] * data[i][1] * data[i][2] == 8){
                for( let j = 0; j < data[0].length; j++ ) results[i][j] = -1
            }
        })
    })
    // 縦列
    data.forEach((line, i) => {
        data.forEach((value, j) => {
            if (data[0][j] * data[1][j] * data[2][j] == 1) {
                for( let i = 0; i < data.length; i++ ) results[i][j] = 1
            }
            if ( data[0][j] * data[1][j] * data[2][j] == 8) {
                for( let i = 0; i < data.length; i++ ) results[i][j] = -1
            }
        })
    })

    //右上斜め
    if (data[0][0] * data[1][1] * data[2][2] == 1) {
        for( let i = 0; i<data.length; i++ ) results[i][i] = 1;
    }
    if (data[0][0] * data[1][1] * data[2][2] == 8) {
        for( let i = 0; i<data.length; i++ ) results[i][i] = -1;
    }
    //右下斜め
    if (data[2][0] * data[1][1] * data[0][2] == 1) {
        for( let i = 0; i<data.length; i++ ) results[data.length-1-i][i] = 1;
    }
    if (data[2][0] * data[1][1] * data[0][2] == 8) {
        for( let i = 0; i<data.length; i++ ) results[data.length-1-i][i] = -1;
    }

    return results;
}