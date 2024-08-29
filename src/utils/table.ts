interface ObjInterface {
    [key: string]: any; // 字段扩展声明
}
/**
 * @description 合并表格行
 * @export
 * @param {object[]} data 表格数据
 * @param {string} rowName 合并行的name
 * @param {string} otherRowName 合并其他行
 * @return {*}
 */
export function tableRowMerge(
    data: ObjInterface[],
    rowName: string,
    otherRowName?: string
) {
    const idArray = [] as number[];
    let idPos = 0;
    for (let i = 0; i < data.length; i++) {
        // 如果当 i == 0 说明数据是第一行, 需要重新赋值
        if (i == 0) {
            // idArray.push(1) 说明这一行数据被显示出来
            idArray.push(1);
            // idPos = 0 重置当前的计数器
            idPos = 0;
        }
        // 说明不是从第一行开始遍历的
        else {
            if (otherRowName) {
                //主行之外的 另一行合并
                if (
                    data[i][rowName] == data[i - 1][rowName] &&
                    data[i][otherRowName] == data[i - 1][otherRowName]
                ) {
                    // 如果相同就需要将 idArray 的数据自加
                    idArray[idPos] += 1;
                    // 同时需要将 idArray push一个0 表示下一行不用显示
                    idArray.push(0);
                }
                // 说明 当前的数据和上一行的指定数据不同
                else {
                    // idArray.push(1) 说明当前一行的数据需要显示
                    idArray.push(1);
                    // 重新给计数器赋值
                    idPos = i;
                }
            } else {
                // 判断当前的指定数据是否和之前的指定数据值相同
                if (data[i][rowName] == data[i - 1][rowName]) {
                    // 如果相同就需要将 idArray 的数据自加
                    idArray[idPos] += 1;
                    // 同时需要将 idArray push一个0 表示下一行不用显示
                    idArray.push(0);
                }
                // 说明 当前的数据和上一行的指定数据不同
                else {
                    // idArray.push(1) 说明当前一行的数据需要显示
                    idArray.push(1);
                    // 重新给计数器赋值
                    idPos = i;
                }
            }
        }
    }
    return idArray;
}
