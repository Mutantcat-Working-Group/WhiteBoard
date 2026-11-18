import Vue from 'vue'
import Vuex from 'vuex'
import storage from './global/utils/storage'

Vue.use(Vuex)

const STORAGE_KEY = 'state'
const SAVE_DELAY = 400

const createFormData = () => ({
  penColor: '#222F3D',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  dotSize: 1
})

let uid = 0
const createId = () => `${Date.now().toString(36)}${(uid++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

// 文本与便签以 id 作为列表 key，保证删除中间项后不会错位复用组件
const normalizePads = (list = []) => list
  .filter(item => item && typeof item === 'object')
  .map(item => ({ ...item, id: item.id || createId() }))

const createBoard = (data = {}) => {
  const formData = {
    ...createFormData(),
    ...(data.formData || {})
  }
  const signaturePad = data.signaturePad || {}
  return {
    id: data.id || '',
    screenshot: data.screenshot || '',
    status: {
      footer: true,
      materialsBox: true,
      ...(data.status || {})
    },
    formData,
    signaturePad: {
      // 画板配置
      options: {
        dotSize: formData.dotSize,
        minWidth: formData.dotSize * 0.3,
        maxWidth: formData.dotSize * 1.7,
        throttle: 1,
        minDistance: 1,
        backgroundColor: formData.backgroundColor,
        penColor: formData.penColor,
        ...(signaturePad.options || {})
      },
      // 画板数据
      data: signaturePad.data || [],
      // 撤销历史
      undoHistory: signaturePad.undoHistory || []
    },
    // 文本列表
    textList: normalizePads(data.textList),
    // 便签列表
    noteList: normalizePads(data.noteList),
    // 素材画布（G6 图数据）
    materials: data.materials && typeof data.materials === 'object'
      ? {
          nodes: data.materials.nodes || [],
          edges: data.materials.edges || []
        }
      : { nodes: [], edges: [] },
    // 当前激活的面板
    activePad: data.activePad || {}
  }
}

const restore = () => {
  const raw = storage.get(STORAGE_KEY)
  if (!raw || !Array.isArray(raw.boardList)) {
    return null
  }
  const boardList = raw.boardList.filter(item => item && typeof item === 'object').map(createBoard)
  if (!boardList.length) {
    return null
  }
  let activeBoardIndex = Number(raw.activeBoardIndex)
  if (!Number.isInteger(activeBoardIndex) || activeBoardIndex < 0 || activeBoardIndex >= boardList.length) {
    activeBoardIndex = 0
  }
  return { boardList, activeBoardIndex }
}

const restored = restore()

const defBoard = createBoard()

const store = new Vuex.Store({
  state: {
    activeBoardIndex: restored ? restored.activeBoardIndex : null,
    defBoard: defBoard,
    boardList: restored ? restored.boardList : [],
    materialsEditor: {
      currentItem: {
        type: null,
        model: null
      }
    }
  },
  mutations: {
    'board/activeBoardIndex/update': (state, data) => {
      state.activeBoardIndex = data
    },
    'board/list/add': (state, data) => {
      state.boardList.push(createBoard(data))
    },
    'board/list/remove': (state, index) => {
      state.boardList.splice(index, 1)
      // 默认添加一项
      if (!state.boardList.length) {
        state.boardList.push(createBoard())
      }
    },
    'board/screenshot/update': (state, { index, screenshot }) => {
      state.boardList[index].screenshot = screenshot
    },
    'board/signaturePad/options/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.options[data.key] = data.val
    },
    'board/signaturePad/data/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.data = data
    },
    'board/signaturePad/undoHistory/update': (state, { index, data }) => {
      state.boardList[index].signaturePad.undoHistory = data
    },
    'board/materials/editor/currentItem/update': (state, data) => {
      state.materialsEditor.currentItem = data
    },
    'board/materials/data/update': (state, { index, data }) => {
      if (state.boardList[index]) {
        state.boardList[index].materials = data
      }
    }
  },
  actions: {

  },
  getters: {
    activeBoardIndex: (state) => state.activeBoardIndex,
    boardList: (state) => state.boardList,
    defBoard: (state) => state.defBoard,
    currentItem: (state) => state.materialsEditor.currentItem
  }
})

// 持久化：截图体积较大，配额不足时退化为不保存缩略图
const save = (withoutScreenshot) => {
  const boardList = withoutScreenshot
    ? store.state.boardList.map(board => ({ ...board, screenshot: '' }))
    : store.state.boardList
  const ok = storage.set(STORAGE_KEY, {
    boardList,
    activeBoardIndex: store.state.activeBoardIndex
  })
  if (!ok && !withoutScreenshot) {
    save(true)
  }
}

let timer = null

const flush = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
    save(false)
  }
}

const scheduleSave = () => {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    timer = null
    save(false)
  }, SAVE_DELAY)
}

// 直接修改 state（v-model、拖拽回调等）不会派发 mutation，因此监听整棵画板数据
store.watch(
  state => state.boardList,
  () => scheduleSave(),
  { deep: true }
)
store.watch(
  state => state.activeBoardIndex,
  () => scheduleSave()
)

window.addEventListener('pagehide', flush)
window.addEventListener('beforeunload', flush)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    flush()
  }
})

export default store
