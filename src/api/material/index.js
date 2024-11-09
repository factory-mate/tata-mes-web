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
    url: import.meta.env.VITE_APP_BASE_API + '/api/Inventory/Update',
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
