let stringifyPrimitive = v => {
  switch (typeof v) {
    case 'string':
      return v

    case 'boolean':
      return v ? 'true' : 'false'

    case 'number':
      return isFinite(v) ? v : ''

    default:
      return ''
  }
}

export default (obj, sep, eq, name) => {
  sep = sep || '&'
  eq = eq || '='
  if (obj === null) {
    obj = undefined
  }

  if (typeof obj === 'object') {
    return Object.keys(obj)
      .map(k => {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq
        if (Array.isArray(obj[k])) {
          return obj[k]
            .map(v => {
              return ks + encodeURIComponent(stringifyPrimitive(v))
            })
            .join(sep)
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
        }
      })
      .join(sep)
  }

  if (!name) return ''
  return (
    encodeURIComponent(stringifyPrimitive(name)) +
    eq +
    encodeURIComponent(stringifyPrimitive(obj))
  )
}
