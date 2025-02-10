import Rotarion from './rotation'
import Mirror from './mirror'
import getStateValue from './get-state-value'

export interface MinValue { 
    value: number,
    rotationSymmetry: number,
    mirrorSymmetry: number
}

//状態値が最小値となる対称性と状態値を計算
export default function (record: Array<Array<number>>, baseValue: Array<Array<number>>): MinValue
{
    let min_v = Math.pow(3,10);
    let min_r = 0;
    let min_m = 0;
    for( let r = 0; r <=3; r++  ){
        for( let m = 0; m <=4; m++  ){
            let _record: Array<Array<number>> = Rotarion(r, record);
            let __record: Array<Array<number>> = Mirror(m, _record);
            let v: number = getStateValue(__record, baseValue);
            //より小さい状態値であれば更新
            if ( v < min_v ){
                min_v = v;
                min_r = r;
                min_m = m;
            }
        }
    }
    return {value :min_v, rotationSymmetry : min_r, mirrorSymmetry : min_m };
}