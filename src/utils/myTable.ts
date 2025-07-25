/**
 * 分析每一列，找出所有【列】可合并（数据相同）的单元格
 * @param {Array} tableData 表数据
 * @param {Array} tableColumn 表字段/表头
 * @param {Array} mergeCols 指定合并哪些列（字段）
 * @returns
 */
 export const getMergeCells = (tableData = [] as any , tableColumn = [] as any, mergeCols = [] as any) => {
    const fields = tableColumn?.map((v: { prop: any }) => v.prop)
    const array = []
    
    if (!tableData?.length || !tableColumn?.length || !mergeCols?.length) return
   
    // 倒叙遍历行（方便统计合并列单元格数至最上方，避免表格塌陷）
    for (let row = tableData.length - 1; row >= 0; row--) {
      array[row] = [] as any
      for (let col = 0; col < fields.length; col++) {
         // 1.最后一行单元格不合并（初始无可对比数据）
         // 2.不在指定列（mergeCols）的单元格不合并
         // 3.空值不合并
        if (row === tableData.length - 1 || !mergeCols.includes(fields[col]) || !tableData[row][fields[col]]) {
          array[row][col] = [1, 1]
          continue
        }
  
        // 4.数据相同但所属父级不一致的单元格不合并
        const parentFields = mergeCols.slice(0, col) // 在指定合并列中找出所有父级
        if (mergeCols.includes(fields[col]) && parentFields?.includes(fields[col - 1])) {
          console.log(mergeCols,'行-------------');
          
          const currentParents = parentFields.map((field: string | number) => tableData[row][field]) // 当前单元格所有父级
          const nextRowParents = parentFields.map((field: string | number) => tableData[row + 1][field]) // 下一行单元格所有父级
          if (currentParents?.toString() !== nextRowParents?.toString()) {
            array[row][col] = [1, 1]
            continue
          }
        }
  
        // 5.合并相同数据的单元格
        if (tableData[row][fields[col]] === tableData[row + 1][fields[col]]) {
          const beforeCell = array[row + 1][col]
          array[row][col] = [1 + beforeCell[0], 1]
          beforeCell[0] = 0
          beforeCell[1] = 0
        } else {
          array[row][col] = [1, 1] // 否则不合并
        }
      } 
    }
    return array
  }
