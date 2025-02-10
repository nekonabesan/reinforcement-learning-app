import React from 'react';
import createTable from '@/util/create-table';

export default function Chapter1() {
    var record1 = [];
    record1.push([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]);
    record1.push([
        [0, 2, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]);
    record1.push([
        [0, 2, 0],
        [0, 1, 0],
        [1, 0, 0]
    ]);
    record1.push([
        [0, 2, 2],
        [0, 1, 0],
        [1, 0, 0]
    ]);
    record1.push([
        [1, 2, 2],
        [0, 1, 0],
        [1, 0, 0]
    ]);
    record1.push([
        [1, 2, 2],
        [2, 1, 0],
        [1, 0, 0]
    ]);
    record1.push([
        [1, 2, 2],
        [2, 1, 0],
        [1, 0, 1]
    ]);

    
    return (
        <React.Fragment key='chapter1'>
            {
                record1.map((data, index) => createTable(data, ``, 'record1', '', true, true))
            }
        </React.Fragment>
    )
}