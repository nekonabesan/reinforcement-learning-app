import React, { JSX } from 'react';

export default function (
    data: Array<Array<number>>,
    id: string,
    domID: string,
    title: string,
    marubatuflag: boolean,
    checkLineflag: boolean
): JSX.Element {
    var results = checkLine( data );
    // テーブルのDOMを生成
    return (
        <table id={id} className="record">
            {
                // titleに有効な値が入っている場合はcaptionタグを追加
                title ? <caption>{ title }</caption> : null
            }
            <tbody>
                {
                    data.map((line, i) => (
                        // trタグをデータの数だけ追加
                        <tr key={`tr_${i}`}>
                        {
                            line.map((cell, j) => {
                                let text: string = "";
                                // マルバツフラグがtrueの場合は○×を表示
                                if(marubatuflag){
                                    if( cell == 1) text = "○";
                                    else if(cell == 2) text = "×";
                                }else{
                                    text = cell.toString();
                                }
                                // class属性を出し分けてtdタグを追加
                                return (
                                    <td id={`${id}_${i}${j}`}  key={`${id}_${i}${j}`} className={results[i][j] == 1 && checkLineflag ? "winMaru" : results[i][j] == -1 && checkLineflag ? "winBatu" : ""}>
                                        {text}
                                    </td>
                               )
                            })
                        }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

function checkLine( data: Array<Array<number>> ): Array<Array<number>>
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