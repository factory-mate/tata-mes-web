import request from '@/utils/request';

export function getMaterial(params) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Inventory/GetByCode',
    method: 'get',
    params
  });
}

export function addMaterial(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Inventory/Add',
    method: 'post',
    data
  });
}

export function updateMaterial(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Inventory/Edit',
    method: 'post',
    data
  });
}

export function getTags() {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDicType',
    method: 'get',
    params: {
      cTableCode: 'FM_INENTORY_DEFINEDVALUE',
      cAttributeCode: 'cKey',
      Conditions: 'cDictonaryTypeCode=cDefindParm01'
    }
  });
}

export function getInOutTypes() {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetForList',
    method: 'get',
    params: {
      Conditions: 'cDictonaryTypeCode=cInOutTypeCode'
    }
  });
}

export function getUnitTypes() {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDicType',
    method: 'get',
    params: {
      cTableCode: 'FM_INENTORY_INFO',
      cAttributeCode: 'cUnitTypeCode',
      Conditions: 'cDictonaryTypeCode=cUnitTypeCode'
    }
  });
}

export function inventoryClassGetForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/InentoryClass/GetForPage',
    method: 'post',
    data
  });
}

export function vendorGetForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Vendor/GetForPage',
    method: 'post',
    data
  });
}

export function unitGetForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Unit/GetForPage',
    method: 'post',
    data
  });
}

export function warehouseGetForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Warehouse/GetForPage',
    method: 'post',
    data
  });
}

export function warehouseAreaGetForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/WareHouse_Area/GetForPage',
    method: 'post',
    data
  });
}

export function warehouseLocationGetForPage(data) {
  return request({
    url:
      import.meta.env.VITE_APP_BASE_API + '/api/WareHouse_Location/GetForPage',
    method: 'post',
    data
  });
}

export function getCMaterialTypes(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDicType',
    method: 'get',
    params: {
      cTableCode: 'FM_INENTORY_INFO',
      cAttributeCode: 'cMaterialType'
    }
  });
}

export function getMaterialForPage(data) {
  return request({
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDidForPage',
    method: 'post',
    params: {
      cTableCode: 'FM_MES_PRODUCT_VOUCH_S_S_S',
      cAttributeCode: 'cDefindParm01'
    },
    data
  });
}
