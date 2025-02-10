import type { NextApiRequest, NextApiResponse } from "next"
import axios from 'axios'
import requestRotation from './request-rotation';
import requestMirror from './request-mirror';

type Data = {
    value: number, 
    rotationSymmetry: number,
    mirrorSymmetry: number
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    const params = req.body
    var baseValue: number[][] = []
    var record: number[][] = []

    if (params.record) {
        record = JSON.parse(params.record) ?? []
    } else {
        record = []
    }
    if (params.baseValue) {
        baseValue = JSON.parse(params.baseValue) ?? []
    } else {
        baseValue = []
    }

    var min_v: number = Math.pow(3,10);
    var min_r: number = 0;
    var min_m: number = 0;
    for(let r = 0; r <= 3; r++){
        for(let m = 0; m <= 4; m++){
            let rotation = requestRotation({ r: r, source: JSON.stringify(record) })
            let mirrors = requestMirror({ r: m, source: JSON.stringify(rotation.result) });
            let v = getStateValue(mirrors.result, baseValue);
            //より小さい状態値であれば更新
            if ( v < min_v ){
                min_v = v;
                min_r = r;
                min_m = m;
            }
        }
    }

    res.status(200).json({
        value: min_v, 
        rotationSymmetry: min_r, 
        mirrorSymmetry: min_m
    });
}

/*type RotationRequest = {
    r: number;
    source: string;
}

type RotationResult = {
    result: Array<Array<number>>;
}

type MirrorsRequest = {
    r: number;
    source: string;
}

type MirrorsResult = {
    result: Array<Array<number>>;
}

/**
 * 
 * 
 * @param record
 * @param r
 * @returns
 */
/*function rotationSymmetry(rotationRequest: RotationRequest): RotationResult
{
    interface RotationResponse {
        data: {
            result: number[][];
        };
    }

    var result: number[][] = [
        Array(3).fill(0),
        Array(3).fill(0),
        Array(3).fill(0)
    ]

    try {
        const requestRotation = (): Promise<RotationResponse> => {
            return axios.post('http://localhost:3000/api/rotation', 
                JSON.stringify(rotationRequest), {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                }
            );
        }

        requestRotation().then((response: RotationResponse) => {
            for (let i = 0; i < response.data.result.length; i++) {
                for (let j = 0; j < response.data.result[i].length; j++) {
                    result[i].push(response.data.result[i][j])
                }
            }
        });

        return { result: result }
    } catch (error) {
        console.error('Error fetching posts:', error)
        return { result: [] }
    }
}

/**
 * 
 * 
 * @param record
 * @param m
 * @returns
 */
/*function mirrorSymmetry(mirrorsRequest: MirrorsRequest): MirrorsResult
{
    interface MirrorsResponse {
        data: {
            result: number[][];
        };
    }

    var result: number[][] = [
        Array(3).fill(0),
        Array(3).fill(0),
        Array(3).fill(0)
    ]

    try {
        const requestMirror = (): Promise<MirrorsResponse> => {
            return axios.post('http://localhost:3000/api/mirror', 
                JSON.stringify(mirrorsRequest), {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                }
            );
        }

        requestMirror().then((response: MirrorsResponse) => {
            for (let i = 0; i < response.data.result.length; i++) {
                for (let j = 0; j < response.data.result[i].length; j++) {
                    result[i].push(response.data.result[i][j])
                }
            }
        });

        return { result: result }
    } catch (error) {
        console.error('Error fetching posts:', error)
        return { result: [] }
    }
}*/

function getStateValue(record: number[][], baseValue: number[][]): number
{
    let v = 0;
    for( let i = 0; i < record.length; i++ ){
        for( let j = 0; j < record[ 0 ].length; j++ ){
            v += record[i][j] * baseValue[i][j];
        }
    }
    return v;
}