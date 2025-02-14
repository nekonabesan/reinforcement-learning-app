import React, { JSX, useState, useEffect } from 'react'
import NProgress from 'nprogress'
import Environment from '@/util/environment'
import SimpleLineChart, { drowDatas } from '@/util/graph/simple-line-chart'
import '@/styles/chapter-4/index.css'
import 'nprogress/nprogress.css'

/**
 * 三目並べの強化学習_グラフ描画_Epsilon-Greedy法（学習回数ごとにパラメータを変化）
 * (参考) https://recharts.org/en-US/examples
 * 
 * @param request Request
 */
export default function Chapter4({ request }: { request: Request }): JSX.Element
{
    const [data, setData] = useState<Array<drowDatas>>([]);
    const progress = NProgress.configure({}).start()

    useEffect(() => {
        async function fetchData(): Promise<void>
        {
            const result = await getData()
            setData(result)
        }

        fetchData().then(() => {
        }).finally(() => {
        })

        return () => {
        }
    }, [])
    
    const element: JSX.Element = (
        <>
            <h1>学習回数に対する勝敗数のグラフ</h1>
            <div id="canvas-frame_graph">
                {
                    data.length > 0 && <SimpleLineChart data={data} progress={progress} />
                }
            </div>
            <h1>三目並べの学習状況のチェック</h1>
            <div id="record"></div>
        </>
    )
    return element
}

/**
 * 学習データを取得
 * 
 * @param void
 */
async function getData(): Promise<Array<drowDatas>>
{
    //学習回数
    let N: number = 10000
    //グラフデータ用データ配列
    var data1s: Array<Array<number>> = []
    var data2s: Array<Array<number>> = []
    var data3s: Array<Array<number>> = []
    var data: Array<drowDatas> = []

    let M: number = 10

    for(let m: number =0 ; m < M; m++){
        data1s[m] = []
        data2s[m] = []
        data3s[m] = []
        //環境インスタンスの生成
        let environment = new Environment()
        //先手エージェントのパラメータ
        environment.sente.selectMethod = 0
        environment.sente.epsilon = 1.0
        environment.sente.gamma = 0.9
        //後手エージェントのパラメータ
        environment.gote.selectMethod = 0
        environment.gote.epsilon = 1.0
        environment.gote.gamma = 0.9
        // 学習状況を確認
        let result0 = environment.checkResult(100, '')
        data1s[m].push(result0.win)
        data2s[m].push(result0.lose)
        data3s[m].push(result0.draw)
        //描画データの生成
        for(let n: number = 1; n <= 100; n++){
            // 先手エージェントのパラメータ
            environment.sente.selectMethod = 1
            environment.sente.epsilon = n/100
            // 後手エージェントのパラメータ
            environment.gote.selectMethod = 1
            environment.gote.epsilon = n/100
            // 学習
            environment.learn(N/100, '')
            // パラメータを変更
            environment.sente.selectMethod = 1
            environment.sente.epsilon = 0.0
            environment.gote.selectMethod = 1
            environment.gote.epsilon = 1.0
            // 学習状況を確認
            let result = environment.checkResult(100, '')
            data1s[m].push(result.win)
            data2s[m].push(result.lose)
            data3s[m].push(result.draw)
        }
    }
    // 
    var data1: Array<Array<number>> = []
    var data2: Array<Array<number>> = []
    var data3: Array<Array<number>> = []
    // 
    for(let n: number = 0; n <= 100; n++){
        data1[n] = [100 * n , data1s[0][n] / M]
        data2[n] = [100 * n , data2s[0][n] / M]
        data3[n] = [100 * n , data3s[0][n] / M]
        // 
        for(let m=1; m<M; m++){
            data1[n][1] += data1s[m][n] / M
            data2[n][1] += data2s[m][n] / M
            data3[n][1] += data3s[m][n] / M
        }
    }
    // 描画データの生成
    for (let i = 0; i < data1.length; i++) {
        data.push({
            '学習回数': i * 100,
            '先手勝利': data1[i][1],
            '後手勝利': data2[i][1],
            '引き分け': data3[i][1],
        })
    }

    return data
}