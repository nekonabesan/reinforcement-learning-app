import React, { JSX } from 'react';
import checkLine from '@/util/check-line'

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