import Environment from './environment';

export default class Agent
{
    environment: Environment;
    Qfunction: Array<Array<number>>;
    eta: number;
    gamma: number;
    losePenalty: number;
    selectMethod: number;
    epsilon: number;
    beta: number;
    _boltzmanFactors: Array<{i:number, j:number, Q:number}>;

    /**
     * コンストラクタ
     * 
     * @param environment: Environment 環境
     */
    constructor(
        environment: Environment,
        Qfunction: Array<Array<number>> = [[0]],
        eta: number = 0.1,
        gamma: number = 1.0,
        losePenalty: number = -2,
        selectMethod: number = 0,
        epsilon: number = 0.5,
        beta: number = 1.0
    ) {
        //環境を保持
        this.environment = environment
        //行動評価関数
        this.Qfunction = [];
        this.Qfunction = Qfunction
        //学習率
        this.eta = eta
        //割引率
        this.gamma = gamma
        //負け時のペナルティ
        this.losePenalty = losePenalty
        //行動選択の方法（0:ランダム、1:Epsilon-Greedy法、2:ボルツマン法）
        this.selectMethod = selectMethod
        //貪欲性（Epsilon-Greedy法）
        this.epsilon = epsilon
        //ボルツマン因子の指数（ボルツマン法）
        this.beta = beta
        //ボルツマン因子の初期化
        this._boltzmanFactors = []
    }

    /**
     * 次の手を選択する関数
     * 
     * @param t: number 手番
     * @param record: Array<Array<number>> 履歴
     */
    selectNextMove(t: number, record: Array<Array<number>>): {i:number, j:number}
    {
        //var te_num: number;
        var _i: number = 0
        var _j: number = 0
        var selectRandom: boolean = false
        //ランダム以外
        if(this.selectMethod > 0){
            //場合によってはランダムで選択
            if(this.selectMethod == 2 || (this.selectMethod == 1 && this.epsilon > Math.random())){
                //Epsilon-Greedy法を用いて次の手を選択
                let result = this.selectNextMoveUseEpsilon(t, record);
                _i = result.i;
                _j = result.j;
                if(this.selectMethod == 2){
                    //ボルツマン法を用いて次の手を選択
                    let result = this.selectNextMoveUseBoltzman(t, record);
                    _i = result.i;
                    _j = result.j;
                }
            } else {
                selectRandom = true;
            }
        } else {
            selectRandom = true;
        }
        //ランダム選択を実行
        if(selectRandom){
            //次の手を乱数で決定（左上からの通し番号）
            let te = Math.floor((10 - t)*Math.random());
            block: {
                let kara: number = 0
                for(let i: number = 0; i < record.length; i++) {
                    for(let j: number = 0; j < record.length; j++) {
                        if(record[ i ][ j ] == 0 ) kara++;
                        if(kara == te + 1) {
                            _i = i
                            _j = j
                            break block;
                        }
                    }
                }
            }

        }
        return { i: _i, j: _j};
    }

    /**
     * Epsilon-Greedy法を用いて次の手を選択
     * 
     * @param t: number 手番
     * @param record: Array<Array<number>> 履歴
     */
    selectNextMoveUseEpsilon(t: number, record: Array<Array<number>>): {i:number, j:number}
    {
        var maxR = -10000
        var _i: number = 0
        var _j: number = 0
        //ボルツマン因子
        this._boltzmanFactors = [];
        //次の手の中で最もQ値が高い手を探索
        for(let i: number = 0; i < record.length; i++){
            for(let j: number = 0; j < record.length; j++){
                if(record[i][j] == 0) {
                    if(t % 2 == 1) record[i][j] = 1;
                    if(t % 2 == 0) record[i][j] = 2;
                    //状態値が最小値となる対称性と状態値を計算
                    let minValueResult = this.environment.getMinValue( record );
                    let min_v = minValueResult.value;
                    //元に戻す
                    record[i][j] = 0;
                    //手番号
                    let te_num = this.environment.values[t].indexOf(min_v);
                    if(te_num == -1) console.log("エラー0", t, min_v);
                    //行動評価関数の値を取得する
                    let Q = this.Qfunction[t][te_num];
                    //ボルツマン因子の計算に利用するパラメータを格納
                    this._boltzmanFactors.push({i: i, j: j, Q: Q});
                    if( Q > maxR ) {
                        maxR = Q;
                        _i = i;
                        _j = j;
                    }
                }
            }
        }
        return {i:_i, j:_j};
    }

    /**
     * ボルツマン法を用いて次の手を選択
     *
     * @param t: number 手番
     * @param record: Array<Array<number>> 履歴
     */
    selectNextMoveUseBoltzman(t: number, record: Array<Array<number>>): {i: number, j: number}
    {
        var _i: number = 0
        var _j: number = 0
        //状態和（規格化因子）
        let state_sum = 0;
        for(let m: number = 0; m < this._boltzmanFactors.length; m++){
            state_sum += Math.exp( this.beta * this._boltzmanFactors[m].Q );
        }
        // ランダム変数
        let random = Math.random();
        let int_probability = 0;
        // ボルツマン因子に基づいて次の手を選択
        for(let m = 0; m < this._boltzmanFactors.length; m++){
            int_probability += Math.exp( this.beta * this._boltzmanFactors[m].Q ) / state_sum;
                if( random < int_probability){
                _i = this._boltzmanFactors[m].i;
                _j = this._boltzmanFactors[m].j;
                break;
            }
        }
        return {i: _i, j: _j};
    }

    /**
     * 行動評価関数を更新する関数
     * 
     * @param t: number 手番
     * @param te_num: number 手番号
     * @param r: number 報酬
     */
    updateQfunction(t: number, te_num: number, r: number): void
    {
        var maxR: number = -1000;
        if( t >= 8 || r > 0) maxR = 0;
        else{
            for(let i: number = 0; i < this.Qfunction[t + 2].length; i++){
                if(this.Qfunction[t + 2][i] > maxR ) maxR = this.Qfunction[t + 2][i];
            }
        }
        var dQ = this.Qfunction[t][te_num] - (r + this.gamma * maxR);
        this.Qfunction[t][te_num] = this.Qfunction[t][te_num] - this.eta * dQ;
    }

    /**
     * 行動評価関数にペナルティを課す関数
     * 
     * @param T: number 手番
     * @param te_nums: Array<number> 手番号配列
     */
    givePenalty(T: number , te_nums: Array<number>){
        var m: number = 1;
        for(let t: number = T - 1 ; t >= 1; t -= 2){
            this.Qfunction[t][te_nums[t]] += this.losePenalty * this.eta * Math.pow(this.gamma, m);
            m++;
        }
    }
}