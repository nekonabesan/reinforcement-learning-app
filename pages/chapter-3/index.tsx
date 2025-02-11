import React, { JSX } from 'react';
import { APIRequestContext } from '@playwright/test'
import ReactDOMServer from 'react-dom/server';
import Environment from '@/util/environment'
import { checkResultValue, learnResultValue } from '@/util/environment'

/**
 * 三目並べの学習状況のチェック
 * 
 * @param request APIRequestContext
 * @returns JSX.Element
 */
export default function Chapter3({ request }: { request: APIRequestContext }): JSX.Element
{
    const element: JSX.Element = (
        <>
            <h1>三目並べの学習状況のチェック</h1>
            <div id="record"></div>
        </>
    )
    // DOMレンダリング後の処理
    React.useEffect(() => {
        //環境インスタンスの生成
        let environment = new Environment();
        //学習回数
        let N = 10000;
        //先手エージェントのパラメータ
        environment.sente.selectMethod = 0;
        environment.sente.gamma = 1.0;
        //後手エージェントのパラメータ
        environment.gote.selectMethod = 0;
        environment.gote.gamma = 1.0;
        //N回学習
        let result1: learnResultValue = environment.learn(N, '');
        console.log("ランダム学習", result1.win, result1.lose, result1.draw, result1.win+result1.lose+result1.draw);
        //状況を確認
        let result: checkResultValue = environment.checkResult( 10, "record" );
        // recordにテーブルを追加
        let record: HTMLElement | null = document.getElementById("record");
        // recordが存在する場合テーブルを追加
        if (record) {
            for (const key1 in result.table) {
                const table1: { [key: string]: { [key: string]: JSX.Element } } = result.table[key1];
                for (const key2 in table1) {
                    const table2: { [key: string]: JSX.Element } = table1[key2];
                    for (const key3 in table2) {
                        record.innerHTML += ReactDOMServer.renderToString(result.table[key1][key2][key3]);
                    }
                }
            }
        }
    })

    return element;
}