export const EMPTY_ID_INT = -1
export const EMPTY_ID_STRING = '-1'

export const FORMAT_BACKEND_DATETIME = 'YYYY-MM-DDTHH:mm:ss.SSS'
export const FORMAT_BACKEND_DATETIME_WITHOUT_TZ = 'YYYY-MM-DDTHH:mm:ss'
export const REGEX_CURRENCY_US = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/
export const REGEX_INPUT =
  '^[a-zA-Z-aàảãáạăằẳẵắặâầẩẫấậbcdđeèẻẽéẹêềểễếệfghiìỉĩíịjklmnoòỏõóọôồổỗốộơờởỡớợpqrstuùủũúụưừửữứựvwxyỳỷỹýỵz0-9 ]*$'
export const REGEX_PHONE = /04+([0-9])/
export const AG_GRID_FIELD_PARENT_DETAILS = '_PARENT_DETAILS'
export const AG_GRID_FIELD_PARENT_ID = '_PARENT_ID'
export const AG_GRID_FIELD_CHILDS_COUNT = '_CHILDS_COUNT'
export const AG_GRID_FIELD_IS_COLLAPSED = '_IS_COLLAPSED'
export const AG_GRID_FIELD_ORDERING_INDICATOR = '_ORDERING_INDICATOR'

export const ADDRESS = {
  street: null,
  ward: null,
  state: null,
  postalCode: null
}

export const LEAD_TYPE_INDIVIDUAL = 0
export const LEAD_TYPE_BUSINESS = 1
export const LEAD_STAGE_NEW = 0
export const CLIENT_TYPE_PERSON = 3
export const CLIENT_TYPE_BUSINESS = 1
export const TAX_TYPE_INCOME = 0
