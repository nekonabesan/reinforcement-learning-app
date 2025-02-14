import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import NProgress from 'nprogress'

export interface drowDatas {
    '学習回数': number
    '先手勝利': number
    '後手勝利': number
    '引き分け': number
}

export default function SimpleLineChart({ data, progress }: { data: Array<drowDatas>, progress: NProgress.NProgress }): React.ReactElement
{
    progress.done()
    return (
        <>
            <LineChart 
                width={800}
                height={400}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="学習回数" interval={10} />
                <YAxis/>
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="先手勝利" stroke="#20b2aa" />
                <Line type="monotone" dataKey="後手勝利" stroke="#ffa500" />
                <Line type="monotone" dataKey="引き分け" stroke="#d2b48c" />
            </LineChart>
        </>
    )
}
