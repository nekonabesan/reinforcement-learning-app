import React, { JSX } from 'react';
import { APIRequestContext } from '@playwright/test'
import ReactDOMServer from 'react-dom/server';
import Rotation from '@/util/rotation'
import Mirror from '@/util/mirror'
import createTable from '@/util/create-table'
import pointSymmetry from '@/util/point-symmetry'
import getMinValue from '@/util/get-min-value'

/**
 * 三目並べの全状態の列挙
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
    ];

    var baseValue: Array<Array<number>> = [
        [Math.pow(3,8), Math.pow(3,7), Math.pow(3,6)],
        [Math.pow(3,5), Math.pow(3,4), Math.pow(3,3)],
        [Math.pow(3,2), Math.pow(3,1), Math.pow(3,0)]
    ];

    const ref = createTable(start, "table_ref", "ref", "", false, false);
    const tableRm: { [key: string]: JSX.Element } = {}
    const tableMr: { [key: string]: JSX.Element } = {}
    const tableMove: { [key: string]: { [key: string]: JSX.Element } } = {}

    //「回転→反転」操作
    for(let r = 0; r <= 3; r++){
        for(let m = 0; m <= 4; m++){
            // 回転
            let _start = Rotation(r, start,)
            // 反転
            let __start = Mirror(m, _start)
            // 連想配列へPUSH
            tableRm[`r${r}m${m}`] = createTable(__start, "table_rm" + r + m, "r" + r + "m" + m, "", false, false)
        }
    }

    //「反転→回転」操作
    for(let r = 0; r <= 3; r++){
        for(let m = 0; m <= 4; m++){
            // 反転
            let _start = Mirror(m, start)
            // 回転
            let __start = Rotation(r, _start)
            // 連想配列へPUSH
            tableMr[`m${m}r${r}`] = createTable(__start, "table_mr" + m + r, "m" + m + "r" + r, "", false, false)
        }
    }
    // 点対称反転用のテーブルを生成
    var p: Array<Array<number>> = pointSymmetry(start);
    const tableP: { [key: string]: JSX.Element } = {};
    tableP['pointSymmetry'] = createTable(p, "table_p", "pointSymmetry", "", false, false);
    // 手数
    var T: number = 9;
    // 全状態数
    var all_move: number = 1;

    // 全マス目を格納する配列（0:空欄、1:○、2:×）
    var records: Array<Array<Array<Array<number>>>> = [];
    // ０手目
    records[ 0 ] = [];
    records[ 0 ][ 0 ] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    //全状態値を格納する配列
    var values: Array<Array<number>> = [];
    values[0] = [0];

    const element: JSX.Element = (
        <>
            <h1>三目並べの全状態の列挙</h1>
            <p>
                ３×３のマス目に○（先手）と×（後手）のマークを交互に埋めていき、縦・横・斜めのいずれかで同じマークが３つ並ぶと勝ちという２人対決ゲームがあります。
                ３×３＝９つのマス目に「○」「×」「未配置」の３つのどれかが入ると考えると、位置まで区別すると全部で$3^9=19683$パターンの状態が存在しますが、対称性を考慮すると自明ではありません。対称性まで考慮してそもそも<span className='underline'>何パターンの状態</span>が存在するのかを調べました。
            </p>

            <h2>準備：対称性の確認</h2>
            <p>
                ３×３のマス目は正方形なので、４回（９０°回転）の回転対称性と４本の軸対称性（横軸、縦軸、右上斜軸、右下斜軸）があります。
                三目並べの場合、譜面を回転・反転しても本質的には同じとなるため、同一の譜面とみなします。さらに、回転した後に反転した譜面も同様に同一の譜面とみなせます。
                次の結果は３×３のマス目に左上から順番に１から９の数字を記入した譜面を、「回転→反転」、「反転→回転」させた際の全譜面です。
            </p>
            <h3>元の並び</h3>
            <div id="ref">
                { ref }
            </div>
            <br />

            <h3>回転 → 反転</h3>
            <table>
                <thead>
                    <tr>
                        <th></th><th>0°回転</th><th>90°回転</th><th>180°回転</th><th>270°回転</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>反転なし</th>
                        <td id="r0m0" key="r0m0"></td>
                        <td id="r1m0" key="r1m0"></td>
                        <td id="r2m0" key="r2m0"></td>
                        <td id="r3m0" key="r3m0"></td>
                    </tr>
                    <tr>
                        <th>横軸対称反転</th>
                        <td id="r0m1" key="r0m1"></td>
                        <td id="r1m1" key="r1m1"></td>
                        <td id="r2m1" key="r2m1"></td>
                        <td id="r3m1" key="r3m1"></td>
                    </tr>
                    <tr>
                        <th>縦軸対称反転</th>
                        <td id="r0m2" key="r0m2"></td>
                        <td id="r1m2" key="r1m2"></td>
                        <td id="r2m2" key="r2m2"></td>
                        <td id="r3m2" key="r3m2"></td>
                    </tr>
                    <tr>
                        <th>右上斜軸対称反転</th>
                        <td id="r0m3" key="r0m3"></td>
                        <td id="r1m3" key="r1m3"></td>
                        <td id="r2m3" key="r2m3"></td>
                        <td id="r3m3" key="r3m3"></td>
                    </tr>
                    <tr>
                        <th>右下斜軸対称反転</th>
                        <td id="r0m4" key="r0m4"></td>
                        <td id="r1m4" key="r1m4"></td>
                        <td id="r2m4" key="r2m4"></td>
                        <td id="r3m4" key="r3m4"></td>
                    </tr>
                </tbody>
            </table>

            <h3>反転 → 回転</h3>
            <p>「回転 → 反転」のどれかと必ず一致するため考慮する必要はありません。</p>
            <table>
                <thead>
                    <tr>
                        <th></th><th>0°回転</th><th>90°回転</th><th>180°回転</th><th>270°回転</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>反転なし</th>
                        <td id="m0r0" key="m0r0"></td>
                        <td id="m0r1" key="m0r1"></td>
                        <td id="m0r2" key="m0r2"></td>
                        <td id="m0r3" key="m0r3"></td>
                    </tr>
                    <tr>
                        <th>横軸対称反転</th>
                        <td id="m1r0" key="m1r0"></td>
                        <td id="m1r1" key="m1r1"></td>
                        <td id="m1r2" key="m1r2"></td>
                        <td id="m1r3" key="m1r3"></td>
                    </tr>
                    <tr>
                        <th>縦軸対称反転</th>
                        <td id="m2r0" key="m2r0"></td>
                        <td id="m2r1" key="m2r1"></td>
                        <td id="m2r2" key="m2r2"></td>
                        <td id="m2r3" key="m2r3"></td>
                    </tr>
                    <tr>
                        <th>右上斜軸対称反転</th>
                        <td id="m3r0" key="m3r0"></td>
                        <td id="m3r1" key="m3r1"></td>
                        <td id="m3r2" key="m3r2"></td>
                        <td id="m3r3" key="m3r3"></td>
                    </tr>
                    <tr>
                        <th>右下斜軸対称反転</th>
                        <td id="m4r0" key="m4r0"></td>
                        <td id="m4r1" key="m4r1"></td>
                        <td id="m4r2" key="m4r2"></td>
                        <td id="m4r3" key="m4r3"></td>
                    </tr>
                </tbody>
            </table>
            <br />

            <h3>点対称反転</h3>
            <p>正方形には点対称も存在しますが、２次元の場合は１８０°回転と同じとなるため、考慮する必要はありません。</p>
            <div id="pointSymmetry"></div>
            <br />

            <h2>全譜面の列挙（対称性を考慮）</h2>
            <p>
            「○」→「×」→「○」→「×」→「○」→「×」→「○」→「×」→「○」 と順番に埋めていった場合の、０手目から９手目までの全パターンを列挙します。
            なお、途中で勝敗が決定した場合も９手目まですべて埋めるとします。
            </p>
            <h3>０手目：<span id="te0"></span></h3>
            <div id="move0_"></div>
            <br />
            <h3>１手目：<span id="te1"></span></h3>
            <div id="move1_"></div>
            <br />
            <h3>２手目：<span id="te2"></span></h3>
            <div id="move2_"></div>
            <br />
            <h3>３手目：<span id="te3"></span></h3>
            <div id="move3_"></div>
            <br />
            <h3>４手目：<span id="te4"></span></h3>
            <div id="move4_"></div>
            <br />
            <h3>５手目：<span id="te5"></span></h3>
            <div id="move5_"></div>
            <br />
            <h3>６手目：<span id="te6"></span></h3>
            <div id="move6_"></div>
            <br />
            <h3>７手目：<span id="te7"></span></h3>
            <div id="move7_"></div>
            <br />
            <h3>８手目：<span id="te8"></span></h3>
            <div id="move8_"></div>
            <br />
            <h3>９手目：<span id="te9"></span></h3>
            <div id="move9_"></div>
            <br />
            <h1>合計：<span id="te"></span></h1>
            <p>思ったよりも多いですね。次回は勝敗が決した時点で終了する場合の全譜面を調べます。</p>
        </>
    )

    // DOMレンダリング後の処理
    React.useEffect(() => {
        // tableRmのkeyをループして、id=r{i}m{j}のtdタグ配下にtableRm[key]を挿入
        for (let key in tableRm) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = ReactDOMServer.renderToString(tableRm[key]);
            }
        }
        // tableMrのkeyをループして、id=m{i}r{j}のtdタグ配下にtableMr[key]を挿入
        for (let key in tableMr) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = ReactDOMServer.renderToString(tableMr[key]);
            }
        }
        // tablePのid=pointSymmetryのdivタグ配下にtablePを挿入
        for (let key in tableP) {
            const element = document.getElementById(key);
            if (element) {
                element.innerHTML = ReactDOMServer.renderToString(tableP[key]);
            }
        }
        const te0Element = document.querySelector("#te" + 0);
        // 0手目のテーブルを生成
        const move0_ = document.getElementById(`move0_`);
        if (move0_ && move0_ instanceof HTMLElement) {
            move0_.innerHTML += ReactDOMServer.renderToString(createTable(records[0][0],"table_move" + 0 , "move0_", "0".padStart(9, '0'), true, true));
        }
        // 1手目からテーブルを生成
        for(let t = 1; t <= T; t++){
            let move = 0;
            // n手目のマス目を初期化
            records[t] = [];
            //n手目のマス目を初期化
            values[t] = [];
            // 1手前の状態から次の手を指す
            for(let te = 0; te < records[t - 1].length; te++){
                //打てるパターンはT-t個
                for(let k=0; k<= T-t; k++){
                    //新しいマス目の配置を格納する配列を準備
                    let record: number[][] = [];
                    //１手前の配置をコピー
                    for( let i = 0; i < records[t - 1][te].length; i++){
                        record[i] = [];
                        for( let j = 0; j < records[t - 1][te][0].length;j++ ){
                            record[i][j] = records[t - 1][te][i][j];
                        }
                    }
                    //未配置のマス目に手を指す
                    block: {
                        let kara = 0;
                        for(let i = 0; i < record.length; i++){
                            for(let j = 0; j < record[0].length; j++){
                                if(records[t - 1][te][i][j] == 0)  kara++;
                                if(kara == k + 1) {
                                    if(t % 2 == 1) record[i][j] = 1; //先手
                                    if(t % 2 == 0) record[i][j] = 2; //後手
                                    break block;
                                }
                            }
                        }
                    }
                    //状態値が最小値となる対称性と状態値を計算
                    let minValueResult = getMinValue(record, baseValue);
                    let min_v = minValueResult.value;
                    let min_r = minValueResult.rotationSymmetry;
                    let min_m = minValueResult.mirrorSymmetry;
                    //状態値の最小値の出現が初めての場合
                    if (values[t].indexOf(min_v) == -1 ){
                        // 状態値として追加
                        values[t].push(min_v);
                        // 配置として追加
                        let _record = Rotation(min_r, record);
                        let __record = Mirror(min_m, _record);
                        records[t].push( __record );
                        // 状態値の可視化
                        let ten=0;
                        for(let i = 8; i >= 0; i--){
                            let b = parseInt((min_v / Math.pow(3, i)).toString());
                            min_v -= b * Math.pow(3,i);
                            ten += b * Math.pow(10 ,i);
                        }
                        let str_min_w = "" + ten;
                        //move${t}_のidを持つdivタグ配下にtableを挿入
                        const element = document.getElementById(`move${t}_`);
                        if (element && element instanceof HTMLElement) {
                            element.innerHTML += ReactDOMServer.renderToString(createTable(__record, "table_move" + t +"_" + te + "_" +  k, "move" + t + "_", str_min_w.padStart(9, '0'), true, true));
                        }
                        move++
                        all_move++;
                    }
                }
            }
            const teElement = document.querySelector("#te" + t);
            if (teElement) {
                teElement.innerHTML = move + "パターン";
            }
        }
        // 全状態数の表示
        const teElement = document.querySelector("#te");
        if (teElement) {
            teElement.innerHTML = all_move + "パターン";
        }
        if (te0Element) {
            te0Element.innerHTML = 1 + "パターン";
        }
    }, [tableRm, tableMr, tableMove, tableP, T, records, values]);

    return element;
}