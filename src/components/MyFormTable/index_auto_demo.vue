<template>
  <el-table
    :data="tableData"
    ref="tabledata"
    :span-method="objectSpanMethod"
    @select="handleSelect"
    @select-all="handleallSelect"
    border
    style="width: 100%; margin-top: 20px"
  >
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column prop="id" label="ID" width="180"> </el-table-column>
    <el-table-column prop="name" label="姓名"> </el-table-column>
    <el-table-column prop="amount1" label="数值 1（元）"> </el-table-column>
    <el-table-column prop="amount2" label="数值 2（元）"> </el-table-column>
    <el-table-column prop="amount3" label="数值 3（元）"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      tableData: [
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        },
        {
          id: '12987122',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        },
        {
          id: '12987122',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        },
        {
          id: '12987122',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
          upto: true
        },
        {
          id: '129871261111',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '129871261111',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          upto: true
        },
        {
          id: '1298712223',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        },
        {
          id: '1298712223',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9,
          upto: true
        },
        {
          id: '129871000',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        },
        {
          id: '129871000',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        },
        {
          id: '129871000',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
          // upto: true
        },
        {
          id: '129871000',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
          upto: true
        },
        {
          id: '1298710933',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
          upto: true
        },
        {
          id: '12987109331',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15,
          upto: true
        }
      ],
      selectId: []
    };
  },
  computed: {
    tableDataarr() {
      let { tableData } = this;
      let arrayData = [];
      tableData.forEach((item, index) => {
        if (item.upto) {
          if (arrayData.length === 0) {
            return arrayData.push({
              index: index + 1,
              numindex: index + 1
            });
          } else {
            return arrayData.push({
              index: index + 1 - arrayData[arrayData.length - 1].numindex,
              numindex: index + 1
            });
          }
        } else {
          return;
        }
      });
      return arrayData;
    }
  },
  mounted() {},
  methods: {
    del() {
      console.log(this.selectId, 123);
    },
    handleSelect(selection, row) {
      // let res = this.selectId.some((item) => {
      //     return row.id === item
      // })
      // if (res) {
      //     this.selectId = this.selectId.filter((item) => {
      //         return item !== row.id
      //     })
      //     this.handleallSalll();
      // } else {
      //     this.selectId = [...this.selectId, row.id]
      //     this.handleallSalll();
      // }
    },
    handleallSalll() {
      // this.tableData.forEach((item) => {
      //     let res = this.selectId.some((pro) => {
      //         return item.id === pro
      //     })
      //     if (res) {
      //         return this.$refs['tabledata'].toggleRowSelection(item, true)
      //     } else {
      //         return this.$refs['tabledata'].toggleRowSelection(item, false)
      //     }
      // })
    },
    handleallSelect(data) {
      // this.selectId = data.map(item => {
      //     return item.id
      // })
      // this.selectId = [...new Set(this.selectId)]
      // this.handleallSalll();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(column)
      let arraycolumn = ['id', 'name', 'amount3'];
      let dataselection = ['index', 'selection'];
      // selection
      if (
        arraycolumn.indexOf(column.property) !== -1 ||
        dataselection.indexOf(column.type) !== -1
      ) {
        let arrnum = this.tableDataarr.find((item, keyindex) => {
          return item.numindex >= rowIndex + 1;
        });
        let arrindex = this.tableDataarr.findIndex((item, keyindex) => {
          return item.numindex >= rowIndex + 1;
        });
        if (arrnum) {
          let { index } = arrnum;
          if (arrindex === 0) {
            if (rowIndex % index === 0) {
              return {
                rowspan: index,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          } else {
            let rowkey = rowIndex - this.tableDataarr[arrindex - 1].numindex;

            if (rowkey % index === 0) {
              return {
                rowspan: index,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
      }
    }
  }
};
</script>
