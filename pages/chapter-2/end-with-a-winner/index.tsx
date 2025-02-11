import React, { JSX } from 'react';
import { APIRequestContext } from '@playwright/test'
import ReactDOMServer from 'react-dom/server';
import Rotation from '@/util/rotation'
import Mirror from '@/util/mirror'
import createTable from '@/util/create-table'
import { MinValue } from '@/util/get-min-value'
import getMinValue from '@/util/get-min-value'
import checkLine from '@/util/check-line'

/**
 * 三目並べの全状態の列挙（勝敗決定で終了）
 * 
 * @param request APIRequestContext
 * @returns JSX.Element
 */
export default function Chapter2({ request }: { request: APIRequestContext }): JSX.Element
{
    // 元の並び
    var start: Array<Array<number>> = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
    // 基準値を初期化
    var baseValue: Array<Array<number>> = [
        [Math.pow(3,8), Math.pow(3,7), Math.pow(3,6)],
        [Math.pow(3,5), Math.pow(3,4), Math.pow(3,3)],
        [Math.pow(3,2), Math.pow(3,1), Math.pow(3,0)]
    ]
    //手数
    var T: number = 9
    //全状態数
    var all_move: number = 1
    var all_move_finish: number = 0
    var maru_win: number = 0
    var batu_win: number = 0
    var douten: number = 0
    var double: number = 0
    //全マス目を格納する配列（0:空欄、1:○、2:×）
    var records: Array<Array<Array<Array<number>>>> = [];
    //０手目
    records[ 0 ] = [];
    records[ 0 ][ 0 ] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
    // 全状態を格納する配列
    var values: Array<Array<number>> = []
    values[0] = [0]

    var teTable: JSX.Element = createTable(records[0][0],"table_move" + 0 , "move0_", "0".padStart(9, '0'), true, true)

    const element: JSX.Element = (
        <>
            <h1>三目並べの決勝パターン分析</h1>
            <p>
                ３×３のマス目に○（先手）と×（後手）のマークを交互に埋めていき、縦・横・斜めのいずれかで同じマークが３つ並ぶと勝ちという２人対決ゲームがあります。
                ３×３＝９つのマス目に「○」「×」「未配置」の３つのどれかが入ると考えると、位置まで区別すると全部で$3^9=19683$パターンの状態が存在しますが、対称性を考慮すると自明ではありません。
                <a href="/chapter-2/enumeration-of-all-states">前回の記事</a>では勝負が決した後も９手目まで埋めましたが、今回は勝負が決した時点で終了として、<span className='underline'>何パターンの状態</span>が存在するのかを調べました。
            </p>
            <h2>全譜面の列挙（対称性を考慮）</h2>
            <p>
                「○」→「×」→「○」→「×」→「○」→「×」→「○」→「×」→「○」 と順番に埋めていき、勝敗が決定した時点で終了とします。
            </p>
            <h3>０手目で決勝：<span id="te0"></span>（<span id="all_te0"></span>）</h3>
            <div id="move0_"></div>
            <br />
            <h3>１手目で決勝：<span id="te1"></span>（<span id="all_te1"></span>）</h3>
            <div id="move1_"></div>
            <br />
            <h3>２手目で決勝：<span id="te2"></span>（<span id="all_te2"></span>）</h3>
            <div id="move2_"></div>
            <br />
            <h3>３手目で決勝：<span id="te3"></span>（<span id="all_te3"></span>）</h3>
            <div id="move3_"></div>
            <br />
            <h3>４手目で決勝：<span id="te4"></span>（<span id="all_te4"></span>）</h3>
            <div id="move4_"></div>
            <br />
            <h3>５手目で決勝：<span id="te5"></span>（<span id="all_te5"></span>）</h3>
            <div id="move5_"></div>
            <br />
            <h3>６手目で決勝：<span id="te6"></span>（<span id="all_te6"></span>）</h3>
            <div id="move6_"></div>
            <br />
            <h3>７手目で決勝：<span id="te7"></span>（<span id="all_te7"></span>）</h3>
            <div id="move7_"></div>
            <br />
            <h3>８手目で決勝：<span id="te8"></span>（<span id="all_te8"></span>）</h3>
            <div id="move8_"></div>
            <br />
            <h3>９手目で決勝：<span id="te9"></span>（<span id="all_te9"></span>）</h3>
            <div id="move9_"></div>
            <br />
            <h1>
                決勝パターン合計：<span id="te"></span>（○：× = <span id="maru_win"></span>：<span id="batu_win"></span>）<br />
                勝負なし：<span id="douten"></span>、２ライン勝ち：<span id="double"></span><br />
                （全パターン：<span id="all_te"></span>）
            </h1>
        </>
    )

    // DOMレンダリング後の処理
    React.useEffect(() => {
        // ラインのチェック
        const teElement = document.querySelector("#te" + 0);
        if (teElement) {
            teElement.innerHTML = 1 + "パターン";
        }
        //１手目からスタート
        for(let t: number = 1; t <= T; t++) {
            let move: number = 0;
            let move_finish: number = 0;
            //n手目のマス目を初期化
            records[t] = [];
            //n手目のマス目を初期化
            values[t] = [];
            //１手前の状態から次の手を指す
            for(let te: number = 0; te < records[t - 1].length; te++){
                //打てるパターンはT-t個
                for(let k: number = 0; k <= T - t; k++){
                    //新しいマス目の配置を格納する配列を準備
                    let record: number[][] = [];
                    //１手前の配置をコピー
                    for( let i = 0; i < records[ t-1 ][ te ].length; i++){
                        record[i] = [];
                        for( let j = 0; j < records[t - 1][te][0].length;j++ ){
                            record[i][j] = records[t - 1][te][i][j];
                        }
                    }

                    //ラインのチェック
                    let lineResults = checkLine(record);

                    //ライン数
                    let lineNum = 0;
                    for(let i = 0; i < lineResults.length; i++){
                        for(let j = 0; j < lineResults[i].length; j++){
                            if(lineResults[i][j] !=0 ) lineNum++;	
                        }
                    }

                    if( lineNum > 0 ) continue;

                    //未配置のマス目に手を指す
                    block: {
                        let kara = 0;
                        for(let i = 0; i < record.length; i++){
                            for(let j = 0; j < record[0].length; j++){
                                if(records[t - 1][te][i][j] == 0) kara++;
                                if(kara == k + 1) {
                                    if(t % 2 == 1) record[i][j] = 1; //先手
                                    if(t % 2 == 0) record[i][j] = 2; //後手
                                    break block;
                                }
                            }
                        }
                    }
                    //状態値が最小値となる対称性と状態値を計算
                    let minValueResult: MinValue = getMinValue(record, baseValue);
                    let min_v: number = minValueResult.value;
                    let min_r: number = minValueResult.rotationSymmetry;
                    let min_m: number = minValueResult.mirrorSymmetry;
                    //状態値の最小値の出現が初めての場合
                    if (values[t].indexOf(min_v) == -1){
                        //状態値として追加
                        values[t].push(min_v);
                        //配置として追加
                        let _record = Rotation(min_r, record);
                        let __record = Mirror(min_m, _record);
                        records[ t ].push( __record );
                        //ラインのチェック
                        let lineResults = checkLine(__record);
                        //ライン数
                        let lineNum: number = 0;
                        for(let i = 0; i < lineResults.length; i++){
                            for(let j = 0; j < lineResults[i].length; j++){
                                if(lineResults[i][j] !=0 ) lineNum++;	
                            }
                        }
                        if(lineNum == 0) {
                            if(t == 9) douten++;
                        }else{
                            all_move_finish++;
                            move_finish++
                            if(t % 2 == 1) maru_win++;
                            if(t % 2 == 0) batu_win++;
                            if(t == 9 && lineNum == 5) double++;
                        }

                        //状態値の可視化
                        let ten=0;
                        for(let i: number = 8; i >= 0; i--){
                            let b: number = parseInt((min_v / Math.pow(3, i)).toString());
                            min_v -= b * Math.pow(3,i);
                            ten += b * Math.pow(10 ,i);
                        }
                        let str_min_w: string = "" + ten;
                        // テーブルの作成
                        const element = document.getElementById(`move${t}_`)
                        if (element && element instanceof HTMLElement) {
                            element.innerHTML += ReactDOMServer.renderToString(createTable(__record,"table_move" + t +"_"+ te + "_"+ k, "move" + t + "_", str_min_w.padStart(9, '0'), true, true));
                        }
                        move++
                        all_move++;
                    }
                }
            }
            const teElement = document.querySelector("#te" + t);
            if (teElement) {
                teElement.innerHTML = move_finish + "パターン";
            }
            const allTeElement = document.querySelector("#all_te" + t);
            if (allTeElement) {
                allTeElement.innerHTML = move + "パターン";
            }
        }
        const teElementFinal = document.querySelector("#te");
        if (teElementFinal) {
            teElementFinal.innerHTML = all_move_finish + "パターン";
        }
        const maruWinElement = document.querySelector("#maru_win");
        if (maruWinElement) {
            maruWinElement.innerHTML = maru_win.toString();
        }
        const batuWinElement = document.querySelector("#batu_win");
        if (batuWinElement) {
            batuWinElement.innerHTML = batu_win.toString();
        }
        const doutenElement = document.querySelector("#douten");
        if (doutenElement) {
            doutenElement.innerHTML = douten.toString();
        }
        const doubleElement = document.querySelector("#double");
        if (doubleElement) {
            doubleElement.innerHTML = double.toString();
        }
        const allTeElementFinal = document.querySelector("#all_te");
        if (allTeElementFinal) {
            allTeElementFinal.innerHTML = all_move.toString();
        }
    }, [T, records, values])

    return element;
}