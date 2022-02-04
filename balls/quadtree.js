/**
 * 四叉树类
 * @file quadtree.js
 * @author 赵鑫<7176466@qq.com>
 */

class QuadTree {
    /**
     * 四叉树构造函数
     * @param {Number} x tree top-left x-coordinate
     * @param {Number} y tree top-left y-coordinate
     * @param {Number} w tree width
     * @param {Number} h tree height
     * @param {Number} capacity tree capacity limit
     * @param {Array} elements init elements
     */
    constructor(x, y, width, height, capacity, elements) {
        this.x = x
        this.y = y
        this.w = width
        this.h = height
        this.capacity = capacity
        this.elements = [] // element must has x and y property
        this.subTrees = []
        this.insertMany(elements)
    }

    /**
     * 返回元素是否位于树范围内
     * @param {*} element
     * @returns {Boolean}
     */
    contains(element) {
        return element.x >= this.x && element.x < this.x + this.w && element.y >= this.y && element.y < this.y + this.h
    }

    /**
     * 将元素放入树中，当前树填满后分为四棵子树并将当前树中的元素放入子树中（递归实现）
     * TODO: 如果元素有宽高属性则插入4个点，或者说元素有几个点数据就插几个点
     * @param {*} element
     * @returns {Boolean}
     */
    insert(element) {
        // 元素不在树范围内时忽略
        if (!this.contains(element)) return false
        // 有子树时依次尝试将元素放入子树中
        if (this.subTrees.length > 0) {
            for (const tree of this.subTrees) if (tree.insert(element)) return true
            return false
        }
        // 树未满时，将元素插入树中
        if (this.elements.length < this.capacity) {
            this.elements.push(element)
            return true
        }
        // 当前树满时，生成子树，并重新尝试插入该元素
        this.split()
        return this.insert(element)
    }

    /**
     * 将多个元素放入树中
     * @param {Array} elements
     * @returns {Boolean}
     */
    insertMany(elements) {
        if (elements) return elements.every((e) => this.insert(e))
    }

    /**
     * 生成子树
     * TODO: 限制最小树的大小或树的最大层次
     */
    split() {
        if (this.subTrees.length === 0) {
            const halfW = this.w / 2
            const halfH = this.h / 2
            const northWest = new QuadTree(this.x, this.y, halfW, halfH, this.capacity)
            const northEast = new QuadTree(this.x + halfW, this.y, halfW, halfH, this.capacity)
            const southEast = new QuadTree(this.x + halfW, this.y + halfH, halfW, halfH, this.capacity)
            const southWest = new QuadTree(this.x, this.y + halfH, halfW, halfH, this.capacity)
            this.subTrees = [northWest, northEast, southEast, southWest]
            // 将当前树的元素塞到子树中去
            this.insertMany(this.elements)
            this.elements = []
        }
    }

    /**
     * 查询指定矩形范围内的元素（递归实现），返回这些元素的数组
     * @param {Number} x 矩形范围左上角点x坐标
     * @param {Number} y 矩形范围左上角点y坐标
     * @param {Number} w 矩形范围宽度
     * @param {Number} h 矩形范围高度
     * @returns {Array} 查询到的元素
     */
    query(x, y, w, h) {
        if (x >= this.x + this.w || x + w <= this.x || y >= this.y + this.h || y + h <= this.y) return []
        let elements = []
        if (this.subTrees.length > 0) {
            for (const tree of this.subTrees) {
                elements = elements.concat(tree.query(x, y, w, h))
            }
        } else elements = elements.concat(this.elements)
        return elements
    }
}

/**
 * 绘制四叉树（依赖 p5.js）
 * @param {*} color
 */
QuadTree.prototype.show = function (color) {
    if (this.subTrees.length > 0) this.subTrees.forEach((tree) => tree.show(color))
    else {
        noFill()
        strokeWeight(1)
        stroke(color || 128)
        rect(this.x, this.y, this.w, this.h)
    }
}

// export for commonJS or browser
if (typeof module !== 'undefined' && typeof exports === 'object') module.exports = QuadTree
else window.QuadTree = QuadTree
