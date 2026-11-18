/**
 * 本地存储
 */

const prefix = 'mutantcat.whiteboard.'
let warned = false

const storage = {
  key (name) {
    return `${prefix}${name}`
  },
  get (name) {
    try {
      const raw = window.localStorage.getItem(storage.key(name))
      return raw ? JSON.parse(raw) : null
    } catch (error) {
      return null
    }
  },
  set (name, data) {
    try {
      window.localStorage.setItem(storage.key(name), JSON.stringify(data))
      return true
    } catch (error) {
      // 隐私模式或超出配额时降级为不持久化，避免打断绘制
      if (!warned) {
        warned = true
      }
      return false
    }
  },
  remove (name) {
    try {
      window.localStorage.removeItem(storage.key(name))
      return true
    } catch (error) {
      return false
    }
  }
}

export default storage
