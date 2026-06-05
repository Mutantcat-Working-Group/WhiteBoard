/**
 * Created by OXOYO on 2019/7/3.
 *
 * 封装G6
 */

// 使用 npm 包 @antv/g6（项目已安装 3.x）。
// 注意：src/global/lib/g6/G6/ 目录是历史遗留的 G6 v4 源码拷贝，
// 它依赖的 @antv/g/lib、@antv/util/lib/... 等 v4 子路径在当前依赖中不存在，
// 会导致 23 条 "module not found" 编译错误，因此不再从这里 import。
import G6 from '@antv/g6'
import registerBehavior from './behavior/index'
import registerEdge from './edge/index'
import registerNode from './node/index'

import config from './config/index'

// 挂载config
G6.$C = config

// 注册交互
registerBehavior(G6)
// 注册边
registerEdge(G6)
// 注册节点
registerNode(G6)

export default G6
