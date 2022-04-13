import { defaults } from 'lodash'

export default (arr) => {
  const nodes = {}
  return arr.filter(function (obj) {
    const id = obj.name
    const parentId = obj.parentName

    nodes[id] = defaults(obj, nodes[id], { children: [] })
    parentId && (nodes[parentId] = nodes[parentId] || { children: [] }).children.push({ ...obj, id })

    return !parentId
  })
}
