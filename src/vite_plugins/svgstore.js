/* eslint-disable */
import path from 'path'
import fs from 'fs'
import store from 'svgstore' // 用于制作 SVG Sprites
import { optimize } from 'svgo' // 用于优化 SVG 文件
//svgstore和svgo插件没有严格的ts定义，所以在这里只能用js文件写

export const svgstore = (options = {}) => {
  const inputFolder = options.inputFolder || 'src/assets/icons';
  return {
    name: 'svgstore',
    resolveId(id) {
      if (id === '@svgstore') {
        //由于VSCode等编辑器不支持直接import svgstore.js 文件，因此需要在这里用 @svgstore return 一次函数名
        return 'svg_bundle.js'
      }
    },
    load(id) {
      if (id === 'svg_bundle.js') {
        //sprites实际上就是一个大的svg
        const sprites = store(options);
        const iconsDir = path.resolve(inputFolder);
        for (const file of fs.readdirSync(iconsDir)) {
          const filepath = path.join(iconsDir, file);
          const svgid = path.parse(file).name
          let code = fs.readFileSync(filepath, { encoding: 'utf-8' });
          //将所有要加载的svg添加到sprites中一次性下载
          sprites.add(svgid, code)
        }
        //optimize优化svg文件
        const { data: code } = optimize(sprites.toString({ inline: options.inline }), {
          plugins: [
            'cleanupAttrs', 'removeDoctype', 'removeComments', 'removeTitle', 'removeDesc', 
            'removeEmptyAttrs',
            //removeAttrs删掉svg文件中无用的属性
            { name: "removeAttrs", params: { attrs: "(data-name|data-xxx)" } }
          ]
        })
        //最后一步是将code变成js文件，因为我们最后需要生成svg_bundle.js的内容
        return `const div = document.createElement('div')
div.innerHTML = \`${code}\`
const svg = div.getElementsByTagName('svg')[0]
if (svg) {
  svg.style.position = 'absolute'
  svg.style.width = 0
  svg.style.height = 0
  svg.style.overflow = 'hidden'
  svg.setAttribute("aria-hidden", "true")
}
// listen dom ready event
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.firstChild) {
    document.body.insertBefore(div, document.body.firstChild)
  } else {
    document.body.appendChild(div)
  }
})`
      }
    }
  }
}