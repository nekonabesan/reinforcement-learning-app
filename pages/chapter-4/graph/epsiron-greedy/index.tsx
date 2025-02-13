import React, { JSX, useEffect } from 'react';
import { APIRequestContext } from '@playwright/test'
import Environment from '@/util/environment'
import SimpleLineChart, { drowDatas } from '@/util/graph/simple-line-chart'
import '@/styles/chapter-4/index.css'

/**
 * Epsiron-Greedy法を用いた学習
 * (参考) https://recharts.org/en-US/examples
 * 
 * @param request APIRequestContext
 */
export default function Chapter4({ request }: { request: APIRequestContext }): JSX.Element
{
    //学習回数
    let N: number = 10000

    //グラフデータ用データ配列
    var data1s: Array<Array<number>> = []
    var data2s: Array<Array<number>> = []
    var data3s: Array<Array<number>> = []
    var data: Array<drowDatas> = []

    let M: number = 10;

    for(let m: number = 0; m < M; m++) {
        data1s[m] = []
        data2s[m] = []
        data3s[m] = []
        //環境インスタンスの生成
        let environment: Environment = new Environment();
        //先手エージェントのパラメータ
        environment.sente.selectMethod = 0;
        environment.sente.epsilon = 1.0;
        environment.sente.gamma = 0.8;
        environment.sente.losePenalty = -3.0;
        //後手エージェントのパラメータ
        environment.gote.selectMethod = 0;
        environment.gote.epsilon = 1.0;
        environment.gote.gamma = 0.8;
        environment.gote.losePenalty = -3.0;
        //初期状況を確認
        let result0 = environment.checkResult(100, '');
        // 
        data1s[m].push(result0.win);
        data2s[m].push(result0.lose);
        data3s[m].push(result0.draw);
        // N回学習
        for(let n: number = 1; n <= (N / 100); n++){
            // 学習
            environment.sente.selectMethod = 1;
            environment.sente.epsilon = 0.5;
            environment.gote.selectMethod = 1;
            environment.gote.epsilon = 0.5;
            environment.learn(N/100, '');
            // 結果の確認
            environment.sente.selectMethod = 1;
            environment.sente.epsilon = 0.0;
            environment.gote.selectMethod = 1;
            environment.gote.epsilon = 1.0;
            let result = environment.checkResult(100, '');
            // 結果を格納
            data1s[m].push(result.win);
            data2s[m].push(result.lose);
            data3s[m].push(result.draw);
        }
    }
    // 
    var data1: Array<Array<number>> = []
    var data2: Array<Array<number>> = []
    var data3: Array<Array<number>> = []
    // 
    for(let n: number = 0; n <= (N / 100); n++){
        data1[n] = [N / 100 * n , data1s[0][n] / M]
        data2[n] = [N / 100 * n , data2s[0][n] / M]
        data3[n] = [N / 100 * n , data3s[0][n] / M]
        // 
        for(let m: number = 1; m < M; m++){
            data1[n][1] += (data1s[m][n] / M)
            data2[n][1] += (data2s[m][n] / M)
            data3[n][1] += (data3s[m][n] / M)
        }
    }

    for (let i = 0; i < data1.length; i++) {
        data.push({
            '学習回数': i * 100,
            '先手勝利': data1[i][1],
            '後手勝利': data2[i][1],
            '引き分け': data3[i][1],
        })
    }
    
    const element: JSX.Element = (
        <>
            <h1>学習回数に対する勝敗数のグラフ</h1>
            <div id="canvas-frame_graph">
                <SimpleLineChart data={data} />
            </div>
            <h1>三目並べの学習状況のチェック</h1>
            <div id="record"></div>
        </>
    )

    useEffect(() => {
    }, [])

    return element
}