export default function Home() {
    return (
        <>
            <div>
                <h1>倒立振子の作り方ゼロから学ぶ強化学習: 物理シミュレーション×機械学習</h1>
            </div>
            <div>
                <div>
                    <h3>Chapter&nbsp;1</h3>
                    <p><a href="/chapter-1">chapter&nbsp;1</a></p>
                </div>
                <div>
                    <h3>Chapter&nbsp;2</h3>
                    <p>
                        <a href="/chapter-2/enumeration-of-all-states">
                            chapter&nbsp;2&nbsp;&nbsp;三目並べの全状態の列挙
                        </a>
                    </p>
                    <p>
                        <a href="/chapter-2/end-with-a-winner">
                            chapter&nbsp;2&nbsp;&nbsp;三目並べの全状態の列挙（勝敗決定で終了）
                        </a>
                    </p>
                </div>
                <div>
                    <h3>Chapter&nbsp;3</h3>
                    <p>
                        <a href="/chapter-3">
                            chapter&nbsp;3&nbsp;&nbsp;三目並べの学習状況のチェック
                        </a>
                    </p>
                </div>
                <div>
                    <h3>Chapter&nbsp;4&nbsp;&nbsp;強化学習成果のパラメータ依存性</h3>
                    <h4>三目並べ</h4>
                    <p>
                        <a href="/chapter-4">
                            chapter&nbsp;4&nbsp;&nbsp;三目並べゲーム
                        </a>
                    </p>
                    <h4>Epsiron-Greadyu法</h4>
                    <p>
                        <a href="/chapter-4/graph/epsiron-greedy">
                            chapter&nbsp;4&nbsp;&nbsp;Epsiron-Greedy法を用いた学習
                        </a>
                    </p>
                    <p>
                        <a href="/chapter-4/graph/epsiron-greedy/change-parameters-each-learning">
                            chapter&nbsp;4&nbsp;&nbsp;学習回数ごとにパラメータを変化
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}