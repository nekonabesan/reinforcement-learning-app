import React, { JSX } from 'react';
import { APIRequestContext } from '@playwright/test'
import ReactDOMServer from 'react-dom/server';
import Environment from '@/util/environment'
import checkLine from '@/util/check-line';
import createTable from '@/util/create-table';
import '@/styles/chapter-4/index.css'

var lose_num: number = 0
var win_num: number = 0
var wake_num: number = 0

var game_num: number = 0
var te_num: number = 0
var finishFlag: boolean = false
var record: Array<Array<number>> = []

var environment: Environment
var progress: HTMLProgressElement
var pp: HTMLElement

var senteColor: string
var goteColor: string

// Custom HTMLElement type
interface CustomHTMLElement extends HTMLElement {
    yoko?: number;
    tate?: number;
    selectFlag?: boolean;
}

interface HTMLProgressElement extends HTMLElement {
    value?: number;
    max?: number;
}

interface nextMoveElement {
    i: number;
    j: number;
}

/**
 * 三目並べゲーム
 * 
 * @param request APIRequestContext
 */
export default function Chapter4({ request }: { request: APIRequestContext }): JSX.Element
{
    const element: JSX.Element = (
        <>
            <h1>三目並べゲーム</h1>
            <div id="controller">
                <p>
                    先手○：<span id="sente">あなた</span><br />
                    後手×：<span id="gote">コンピュータ</span>
                </p>
                <table id="progressTable">
                    <tbody>
                        <tr><td colSpan={2}>※バックグラウンドで学習中</td></tr>
                        <tr>
                            <td colSpan={2}><progress id="progress" value="0" max="100">
                                </progress>&nbsp;<span id="pp"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table id="epsilonTable">
                    <tbody>
                        <tr><td colSpan={2}>コンピュータの強さ（貪欲性）</td></tr>
                        <tr>
                            <td>
                                <input type="range" min="0" max="1.0" step="0.01" id="epsilonRange" />
                                <span id="epsilon">1.0</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="game">
                <table>
                    <tbody>
                        <tr><td id="g00"></td><td id="g01"></td><td id="g02"></td></tr>
                        <tr><td id="g10"></td><td id="g11"></td><td id="g12"></td></tr>
                        <tr><td id="g20"></td><td id="g21"></td><td id="g22"></td></tr>
                    </tbody>
                </table>
            </div>
            <div id="comment">
                <p id="comment_win">あなたの<span className='red'>勝ち</span>です</p>
                <p id="comment_lose">あなたの<span className="blue">負け</span>です</p>
                <p id="comment_wake">引き分けです</p>
                <button id="nextGameButton">対戦を続ける</button>
            </div>
            <br />
            <h2>対戦結果：<span id="win_num">0</span>勝:<span id="lose_num">0</span>敗:<span id="wake_num">0</span>分</h2>
            <div id="record">
            </div>
        </>
    )
    
    // DOMレンダリング後の処理
    React.useEffect(() => {
        // テーブルの非表示
        var epsilonTable = document.getElementById("epsilonTable")!
        if (epsilonTable) {
            epsilonTable.style.display = "none";
        }
        // 環境インスタンスの生成
        environment = new Environment()
        environment.sente.epsilon = 1.0
        environment.gote.epsilon = 1.0
        // プログレスバーの設定
        progress = document.getElementById("progress") as HTMLProgressElement
        pp = document.getElementById("pp")!
        // ゲームの初期化
        game_num = 0
        te_num = 0
        finishFlag = false
        record = []
        // 色の設定
        senteColor = "khaki"
        goteColor = "paleturquoise"
        // 次ゲームの設定
        nextGame()
        // マスの設定
        for(let i: number = 0; i < 3; i++) {
            for(let j: number = 0; j < 3; j++) {
                let waku = document.getElementById("g" + i + j) as CustomHTMLElement
                if (waku) {
                    waku.selectFlag = false
                    waku.yoko = i
                    waku.tate = j
                    waku.addEventListener("mouseover", function(){
                        if(!waku.selectFlag && !finishFlag) {
                            if(te_num % 2 == 0) this.style.backgroundColor = senteColor
                            if(te_num % 2 == 1) this.style.backgroundColor = goteColor
                        }
                    });
                    waku.addEventListener("mouseout", function(){
                        if(!finishFlag) this.style.backgroundColor = "white"
                    });
                    waku.addEventListener("click", function () {
                        clickEvent(waku)
                    })
                }
            }
        }
        //貪欲性の設定
        var epsilonRange = document.getElementById("epsilonRange") as HTMLInputElement
        if (epsilonRange) {
            epsilonRange.value = "1.0"
        }
        epsilonRange.addEventListener("input", function(){
            environment.sente.epsilon = parseInt(epsilonRange.value)
            environment.gote.epsilon = parseInt(epsilonRange.value)
            let epsilon = document.getElementById("epsilon")!
            epsilon.innerHTML = epsilonRange.value
        })
        //学習開始
        startLearning(progress, pp, environment)
        //手の選択イベントの登録
        var nextGameButton = document.getElementById("nextGameButton")!
        if (nextGameButton) {
            nextGameButton.addEventListener("click", nextGame)
        }
    })

    return element
}

/**
 * 非同期初期
 * 
 * @param progress HTMLProgressElement | null
 * @param pp HTMLElement | null
 * @param environment Environment
 */
async function startLearning(progress: HTMLProgressElement | null, pp: HTMLElement | null, environment: Environment): Promise<void>
{
    // 学習回数
    let N: number = 10000
    // 学習
    for(let n: number = 1; n <= 100; n++) {
        if (progress) {
            progress.value = await (function(){
                return new Promise(resolve=>{
                    setTimeout(()=>resolve(n), 5)
                })
            })()
        }
        if (pp) {
            pp.innerHTML = await (function(){
                return new Promise(resolve=>{
                    setTimeout(()=>resolve(n+ "%") , 5)
                })
            })()
        }
        //先手エージェントのパラメータ設定
        environment.sente.selectMethod = 2
        environment.sente.beta = n/20
        environment.sente.losePenalty = -5
        environment.sente.gamma = 0.7
        //後手エージェントのパラメータ設定
        environment.gote.selectMethod = 2
        environment.gote.beta = n/20
        environment.gote.losePenalty = -5
        environment.gote.gamma = 0.7
        environment.learn(N/100, '')
    }
    environment.sente.selectMethod = 1
    environment.gote.selectMethod = 1
    // プログレスバーの非表示
    let progressTable = document.getElementById("progressTable")
    if (progressTable) progressTable.style.display = "none"
    let epsilonTable = document.getElementById("epsilonTable")
    if (epsilonTable) epsilonTable.style.display = "block"
}

/**
 * コンピュータの手の選択
 * 
 * @param void
 */
function computerMove(): void
{
    // 手数をインクリメント
    te_num++
    // 次の手を選択
    let nextMove: nextMoveElement = {i: 0, j: 0}
    if(te_num % 2 == 1) nextMove = environment.sente.selectNextMove(te_num, record)!
    if(te_num % 2 == 0) nextMove = environment.gote.selectNextMove(te_num, record)!
    // 選択した手を表示
    let waku: CustomHTMLElement = document.getElementById("g" + nextMove.i + nextMove.j)!
    waku.selectFlag = true
    if (waku.yoko !== undefined && waku.tate !== undefined) {
        if( te_num % 2 == 1 )    {
            waku.innerHTML = "○"
            record[waku.yoko][waku.tate] = 1
        }
        if( te_num % 2 == 0 )    {
            waku.innerHTML = "×"
            record[waku.yoko][waku.tate] = 2
        }
    }
    // 結果の判定
    checkResult()
}

/**
 * 手を選択
 * 
 * @param waku CustomHTMLElement
 */
function clickEvent(waku: CustomHTMLElement): void
{
    let winNumElement: HTMLElement = document.getElementById("win_num")!
    let loseNumElement: HTMLElement = document.getElementById("lose_num")!
    let wakeNumElement: HTMLElement = document.getElementById("wake_num")!
    // クリックイベントの処理
    if(!waku.selectFlag && !finishFlag) {
        te_num++
        if (waku.yoko !== undefined && waku.tate !== undefined) {
            if (te_num % 2 == 1 ) {
                waku.innerHTML = "○";
                record[waku.yoko][waku.tate] = 1
            }
            if ( te_num%2 == 0 )    {
                waku.innerHTML = "×";
                record[waku.yoko][waku.tate] = 2
            }
        }
        waku.selectFlag = true;
        // 結果の判定
        checkResult()
        // コンピュータの手を選択
        if(te_num % 2 == (game_num % 2) && te_num < 9 && !finishFlag) computerMove()
    }
    // 対戦結果の表示
    if(finishFlag == true) {
        winNumElement.innerHTML = win_num.toString()
        loseNumElement.innerHTML = lose_num.toString()
        wakeNumElement.innerHTML = wake_num.toString()
    }
}

/**
 * 勝敗結果の表示
 * 
 * @param result boolean | null
 */
function insertResult(result: boolean | null): void
{
    let span: HTMLElement = document.createElement("span")
    // 勝敗結果の表示
    if(result == true) {
        span.innerHTML ="勝ち"
        span.style.color = "red"
    }else if(result == false){
        span.innerHTML ="負け"
        span.style.color = "blue"
    }else{
        span.innerHTML ="引き分け"
    }
    let rElement: HTMLElement = document.getElementById("r" + game_num)!
    rElement.appendChild(span)
}

/**
 * 次ゲーム実行
 * 
 * @returns void
 */
function nextGame(): void
{
    finishFlag = false
    te_num = 0
    // DOM要素の取得
    let sente: HTMLElement = document.getElementById("sente")!
    let gote: HTMLElement = document.getElementById("gote")!
    let recordElement = document.getElementById("record")!
    let recordSelector = document.querySelector("#record")!
    let nextGameButtonElement = document.getElementById("nextGameButton")!
    let commentWinElement = document.getElementById("comment_win")!
    let commentLoseElement = document.getElementById("comment_lose")!
    let commentWakeElement = document.getElementById("comment_wake")!
    // ゲームの進行
    game_num++
    if(game_num % 2 == 1){
        sente.innerHTML = "あなた"
        sente.style.color = "red"
        gote.innerHTML = "コンピュータ"
        gote.style.color = "blue"
    }else{
        sente.innerHTML = "コンピュータ"
        sente.style.color = "blue"
        gote.innerHTML = "あなた"
        gote.style.color = "red"
    }
    // レコードの初期化
    let div: HTMLElement = document.createElement("div")
    div.id = "r" + game_num
    div.style.clear = "both"
    recordSelector.insertBefore(div, recordSelector.firstChild)
    // ボタンの非表示
    nextGameButtonElement.style.display = "none"
    commentWinElement.style.display = "none"
    commentLoseElement.style.display = "none"
    commentWakeElement.style.display = "none"
    // レコードの初期化
    for(let i: number = 0; i < 3; i++) {
        record[i] = [];
        for(let j: number = 0; j < 3; j++) {
            record[i][j] = 0
            let waku = document.getElementById("g" + i + j) as CustomHTMLElement
            waku.style.backgroundColor = "white"
            waku.innerHTML = ""
            waku.selectFlag = false
        }
    }

    if(game_num % 2 == 0) computerMove()
}

/**
 * 勝敗結果の判定
 * 
 * @param void
 */
function checkResult(): void
{
    let results: Array<Array<number>> = checkLine(record, 1, 2)
    let senteWinFlag: boolean = false
    let goteWinFlag: boolean = false
    let nextGameButtonElement = document.getElementById("nextGameButton")!
    let commentWinElement = document.getElementById("comment_win")!
    let commentLoseElement = document.getElementById("comment_lose")!
    let commnWakuElement =  document.getElementById("comment_wake")!
    // 勝敗結果の判定
    for(let i: number = 0; i < 3; i++){
        for(let j: number = 0; j < 3; j++){
            let waku: HTMLElement = document.getElementById("g" + i + j)!
            if(results[i][j] == 1) {
                waku.style.backgroundColor = senteColor
                senteWinFlag = true
                finishFlag = true
            }
            if(results[i][j] == 2) {
                waku.style.backgroundColor = goteColor
                goteWinFlag = true
                finishFlag = true
            }
        }
    }
    // 勝敗結果の表示
    if((senteWinFlag && game_num % 2 == 1) || (goteWinFlag && game_num % 2 == 0)) {
        win_num++
        commentWinElement.style.display = "block"
        insertResult(true)
    }
    if((senteWinFlag && game_num % 2 == 0) || (goteWinFlag && game_num % 2 == 1)) {
        lose_num++
        commentLoseElement.style.display = "block"
        insertResult(false)
    }
    //譜面の追加
    let obj: HTMLElement = document.getElementById("r" + game_num)!
    obj.innerHTML += ReactDOMServer.renderToString(createTable(record, '', "r" + game_num, '', true, true))
    // 引き分けの場合
    if( te_num == 9 || finishFlag) {
        finishFlag = true;
        nextGameButtonElement.style.display = "block"
        // 引き分けの場合
        if(!senteWinFlag && !goteWinFlag) {
            wake_num++;
            commnWakuElement.style.display = "block"
            insertResult(null)
        }
    }
}