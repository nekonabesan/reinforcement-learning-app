import { JSX } from 'react';
import Rotation from '@/util/rotation'
import Mirror from '@/util/mirror'
import createTable from '@/util/create-table'
import { MinValue } from '@/util/get-min-value'
import checkLine from '@/util/check-line'
import Agent from '@/util/agent'

export interface checkResultValue {
    win:number,
    lose:number,
    draw:number,
    table: { [key: string]: { [key: string]: { [key: string]: JSX.Element } } }
}

export interface learnResultValue {
    win:number,
    lose:number,
    draw:number,
    table: { [key: string]: { [key: string]: { [key: string]: JSX.Element } } }
}

/**
 * 環境クラス
 */
export default class Environment
{
    records: Array<Array<Array<Array<number>>>>
    values: Array<Array<number>>
    baseValue: Array<Array<number>>
    sente: Agent
    gote: Agent
    T: number

    /**
     * コンストラクタ
     * 
     * @param void
     */
    constructor(){
        // プレイヤーを表すプロパティ
        this.sente = new Agent(this); //先手
        this.gote = new Agent(this); //後手
        // 全状態の配置を格納する配列（0:空欄、1:○、2:×）
        this.records = [];
        // 0手目を設定
        this.records[ 0 ] = [];
        this.records[ 0 ][ 0 ] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        // 全状態値を格納する配列
        this.values = [];
        this.values[0] = [0];
        // 桁表を初期化
        this.baseValue = [
            [Math.pow(3,8), Math.pow(3,7), Math.pow(3,6)],
            [Math.pow(3,5), Math.pow(3,4), Math.pow(3,3)],
            [Math.pow(3,2), Math.pow(3,1), Math.pow(3,0)]
        ];
        // 投了までの手数を設定
        this.T = 9;
        // 初期化関数の実行
        this.init();
    }

    /**
     * 初期化関数
     * 
     * @param void
     */
    init (): void
    {
        var records: Array<Array<Array<Array<number>>>> = this.records;
        var values: Array<Array<number>> = this.values;
        //１手目からスタート
        for(let t: number = 1; t <= this.T; t++){
            //let move = 0
            //let move_finish = 0
            //n手目のマス目を初期化
            records[t] = []
            //n手目のマス目を初期化
            values[t] = []
            this.sente.Qfunction[t] = []
            this.gote.Qfunction[t] = []
            //１手前の状態から次の手を指す
            for(let te: number = 0; te < records[t - 1].length; te++){
                //打てるパターンはT-t個
                for(let k: number = 0; k <= this.T - t; k++){
                    //新しいマス目の配置を格納する配列を準備
                    let record: Array<Array<number>> = []
                    //１手前の配置をコピー
                    for(let i: number = 0; i < records[t - 1][te].length; i++){
                        record[i] = []
                        for( let j = 0; j < records[t - 1][te][0].length;j++ ){
                            record[i][j] = records[t - 1][te][i][j]
                        }
                    }
                    //ラインのチェック
                    let lineResults = checkLine(record);
                    //ライン数
                    let lineNum = 0;
                    for(let i: number = 0; i < lineResults.length; i++){
                        for(let j: number = 0; j < lineResults[i].length; j++){
                            if(lineResults[i][j] !=0 ) lineNum++
                        }
                    }
                    if(lineNum > 0) continue;
                    //未配置のマス目に手を指す
                    block: {
                        let kara: number = 0;
                        for(let i: number = 0; i < record.length; i++){
                            for( let j: number = 0; j < record[0].length; j++ ){
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
                    let minValueResult = this.getMinValue( record );
                    let min_v = minValueResult.value;
                    let min_r = minValueResult.rotationSymmetry;
                    let min_m = minValueResult.mirrorSymmetry;
                    //状態値の最小値の出現が初めての場合
                    if (values[t].indexOf(min_v) == -1) {
                        //Q値の初期値を与える
                        if(t % 2 == 1) this.sente.Qfunction[t].push(0)
                        if(t % 2 == 0) this.gote.Qfunction[t].push(0)
                        //状態値として追加
                        values[t].push(min_v)
                        //配置として追加
                        let _record: Array<Array<number>> = Rotation(min_r, record)
                        let __record: Array<Array<number>> = Mirror(min_m, _record)
                        records[t].push(__record);
                    }
                }
            }
        }
        console.log("全状態配置（this.records）")
        console.log(this.records);
        console.log("全状態値（this.values）")
        console.log(this.values);
        console.log("先手行動評価関数（this.sente.Qfunction）")
        console.log(this.sente.Qfunction);
        console.log("後手行動評価関数（this.gote.Qfunction）")
        console.log(this.gote.Qfunction);
    }

    /**
     * 状態値が最小値となる対称性と状態値を計算
     * 
     * @param record: Array<Array<number>> 履歴
     */
    getMinValue (record: Array<Array<number>>): MinValue
    {
        var min_v: number = Math.pow(3,10)
        var min_r: number = 0
        var min_m: number = 0
        for(let r: number = 0; r <=3; r++){
            for(let m: number = 0; m <=4; m++){
                let _record: Array<Array<number>> = Rotation(r, record)
                let __record: Array<Array<number>> = Mirror(m, _record)
                let v = this.getStateValue(__record)
                //より小さい状態値であれば更新
                if (v < min_v) {
                    min_v = v
                    min_r = r
                    min_m = m
                }
            }
        }
        return {value :min_v, rotationSymmetry : min_r, mirrorSymmetry : min_m};
    }

    /**
     * 状態値を計算する関数 
     * 
     * @param record: Array<Array<number>> 履歴
     */
    getStateValue (record: Array<Array<number>>): number
    {
        var v: number = 0;
        for(let i: number = 0; i < record.length; i++){
            for(let j: number = 0; j < record[ 0 ].length; j++){
                v += record[i][j] * this.baseValue[i][j];
            }
        }
        return v;
    }

    /**
     * 強化学習を実行
     * 
     * @param N: number 学習回数
     * @param parentID: string 親ID
     */
    learn (N: number, parentID: string): learnResultValue
    {
        var win: number = 0;
        var lose: number = 0;
        var draw: number = 0;
        var table: { [key: string]: { [key: string]: { [key: string]: JSX.Element } } } = {};
        table[parentID] = {};
        //各学習ごとに実行
        for(let n: number = 1; n <= N; n++){
            table[parentID][n] = {};
            //初期配置
            let record: Array<Array<number>> = [
                [ 0, 0, 0 ],
                [ 0, 0, 0 ],
                [ 0, 0, 0 ]
            ];
            //表の生成
            if(parentID) table[parentID][n][-1] = createTable(record, '', parentID, '', true, true)
            //過去の手番号配列
            let te_nums: Array<number> = [0];
            for(let t: number = 1; t <= this.T; t++){
                //次の手を選択
                let nextMove;
                if(t % 2 == 1) nextMove = this.sente.selectNextMove(t, record)
                else nextMove = this.gote.selectNextMove(t, record)
                //マス目の配置を更新
                if(t % 2 == 1) record[nextMove.i][nextMove.j] = 1;
                if(t % 2 == 0) record[nextMove.i][nextMove.j] = 2;
                //状態値が最小値となる対称性と状態値を計算
                let minValueResult = this.getMinValue(record)
                let min_v = minValueResult.value;
                //手番号
                let te_num = this.values[t].indexOf(min_v)
                if(te_num == -1) console.log("エラー1", t, min_v)
                //過去の手番号配列に格納
                te_nums.push(te_num)
                //表の生成
                if(parentID) table[parentID][n][t] = createTable(record, '', parentID, '', true, true)
                //ラインのチェック
                let lineResults = checkLine(record)
                //ライン数
                let lineNum = 0
                for(let i: number = 0; i < lineResults.length; i++){
                    for(let j: number = 0; j < lineResults[i].length; j++) {
                        if(lineResults[i][j] !=0 ) lineNum++
                    }
                }
                //報酬の設定
                let r: number = (lineNum>0) ? 1 : 0
                //行動評価関数の更新
                if(t % 2 == 1) this.sente.updateQfunction(t, te_num, r)
                else this.gote.updateQfunction(t, te_num, r)
                //勝敗が決定した場合の処理
                if(lineNum > 0) {
                    if(t%2==1) {
                        win++;
                        this.gote.givePenalty(t, te_nums)
                    } else {
                        lose++;
                        this.sente.givePenalty(t, te_nums)
                    }
                    break;
                }
                //最後まで勝敗が決まらなければ
                if(t == 9) draw++
            }
        }
        return {win:win, lose:lose, draw:draw, table: table}
    }

    /**
     * 結果を確認
     * 
     * @param N: number 学習回数
     * @param parentID: string 親ID
     */
    checkResult (N: number, parentID: string): checkResultValue
    {
        var sente_eta: number = this.sente.eta
        var gote_eta: number = this.gote.eta
        this.sente.eta = 0
        this.gote.eta = 0

        var results = this.learn(N, parentID)

        this.sente.eta = sente_eta
        this.gote.eta = gote_eta

        return results;
    }
}