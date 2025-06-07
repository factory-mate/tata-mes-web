<script setup>
import { ref, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import { getMaterial } from '@/api/material';

const route = useRoute();

const detail = ref({});
const infoData = ref({});
const extendData = ref({});
const unitData = ref([]);
const wmsData = ref({});
const sAPInfos = ref([]);

onActivated(async () => {
  const { rowId } = route.params;
  getMaterial({ cInvCode: rowId }).then(res => {
    detail.value = res.data;
    infoData.value = res.data.iNENTORY_INFO ?? {};
    extendData.value = res.data.iNENTORY_EXTEND ?? {};
    unitData.value = res.data.iNENTORY_UNIT ?? [];
    wmsData.value = res.data.iNENTORY_WMS ?? {};
    sAPInfos.value = res.data.sAPInfos ?? [];
  });
});
</script>

<template>
  <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px">
    <el-card>
      <el-tag type="primary" size="large">基本信息</el-tag>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6"> 存货分类：{{ infoData.cInvClassName }} </el-col>
        <el-col :span="6"> 存货编号：{{ infoData.cInvCode }} </el-col>
        <el-col :span="6"> 存货名称：{{ infoData.cInvName }} </el-col>
        <el-col :span="6"> 存货规格：{{ infoData.cInvstd }} </el-col>
      </el-row>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6">
          保质期管理：{{ infoData.IsPeriod ? '是' : '否' }}
        </el-col>
        <el-col :span="6"> 质保天数：{{ infoData.iPeriodDay }} </el-col>
        <el-col :span="6">
          批次管理：{{ infoData.IsBatch ? '是' : '否' }}
        </el-col>
        <el-col :span="6">
          库存管理：{{ infoData.IsStore ? '是' : '否' }}
        </el-col>
      </el-row>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6"> 供应商名称：{{ infoData.cVendorName }} </el-col>
        <el-col :span="6"> 质检：{{ infoData.IsQCName }} </el-col>
        <el-col :span="6"> 物料类型：{{ infoData.cMaterialTypeName }} </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-tag type="primary" size="large">物料规格</el-tag>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6"> 物料长：{{ extendData.iDefindParm11 }} </el-col>
        <el-col :span="6"> 物料宽：{{ extendData.iDefindParm12 }} </el-col>
        <el-col :span="6"> 物料厚：{{ extendData.iDefindParm13 }} </el-col>
        <el-col :span="6"> 板材等级：{{ extendData.cDynamicsParm01 }} </el-col>
      </el-row>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6"> 适用品牌：{{ extendData.cDynamicsParm02 }} </el-col>
        <el-col :span="6"> 材质：{{ extendData.cDynamicsParm03 }} </el-col>
        <el-col :span="6"> 颜色：{{ extendData.cDynamicsParm04 }} </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-tag type="primary" size="large">库管信息</el-tag>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6">
          是否库存预警：{{ wmsData.IsWarn ? '是' : '否' }}
        </el-col>
        <el-col :span="6"> 安全库存量：{{ wmsData.nSafeQuinity }} </el-col>
        <el-col :span="6"> 最高库存量：{{ wmsData.nMaxQuinity }} </el-col>
        <el-col :span="6"> 最低库存量：{{ wmsData.nMinQuinity }} </el-col>
      </el-row>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6"> 预警规则：{{ wmsData.cWarnRuleCode }} </el-col>
        <el-col :span="6"> 出入库方式：{{ wmsData.cInOutTypeCode }} </el-col>
        <el-col :span="6"> 默认仓库：{{ wmsData.cWareHouseCode }} </el-col>
        <el-col :span="6"> 默认库区：{{ wmsData.cWareHouseAreaCode }} </el-col>
      </el-row>
      <el-row
        :gutter="24"
        style="margin-top: 12px; font-weight: 700; font-size: 14px"
      >
        <el-col :span="6">
          默认库位：{{ wmsData.cWareHouseLocationCode }}
        </el-col>
        <el-col :span="6"> 最小包装量：{{ wmsData.iMinPackage }} </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-tag type="primary" size="large">扩展信息</el-tag>
      <el-table :data="sAPInfos" style="width: 100%; margin-top: 20px">
        <el-table-column prop="cSAPCode" label="SAP 物料编码" />
        <el-table-column prop="cVendorCode" label="供应商编码" />
        <el-table-column prop="cVendorName" label="供应商名称" />
        <el-table-column prop="cPackageNumber" label="每包数量" />
      </el-table>
    </el-card>

    <el-card>
      <el-tag type="primary" size="large">单位信息</el-tag>
      <el-table :data="unitData" style="width: 100%; margin-top: 20px">
        <el-table-column prop="cUnitTypeName" label="计量单位应用类型" />
        <el-table-column prop="cUnitName" label="主计量单位名称" />
        <el-table-column prop="cAssUnitName" label="辅计量单位名称" />
        <el-table-column prop="iChangeRate" label="换算率" />
        <el-table-column prop="IsDefaultName" label="是否默认" />
      </el-table>
    </el-card>
  </div>
</template>
