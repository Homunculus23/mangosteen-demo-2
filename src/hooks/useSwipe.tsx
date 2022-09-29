import { computed, onMounted, onUnmounted, ref, Ref } from "vue";

type Point = {  //存储坐标
  x: number;
  y: number;
}

export const useSwipe = (element: Ref<HTMLElement | null>)=>{
  const start = ref<Point>()  //用start和end记录坐标
  const end = ref<Point>()
  const swiping = ref(false)  //swiping用于判断是否发生移动。这里的ref初始值写false，就能自动推断bool类型，省去<>。
  const distance = computed(()=>{ //distance返回x、y移动距离，类型自动推断为 ComputedRef (计算结果Ref，下同)
    if(!start.value || !end.value){return}
    return {
      x: end.value.x - start.value.x,
      y: end.value.y - start.value.y,
    }
  })
  const direction = computed(()=>{  //direction返回移动方向
    if(!swiping) { return '' }
    if(!distance.value) { return '' }
    const {x, y} = distance.value
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? 'right' : 'left'
    } else {
      return y > 0 ? 'down' : 'up'
    } 
  })

  const onStart = (e: TouchEvent) => {
    swiping.value = true  //标记点击开始
    end.value = start.value = { //为防止遗留上一次的end数据，给start赋值时为end赋值
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }
  const onMove = (e: TouchEvent) => {
    if (!start.value) { return }  //防止用户没有点击而进入事件
    end.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }
  const onEnd = (e: TouchEvent) => {
    swiping.value = false; //移动过程结束
  }

  onMounted(()=>{ //onMounted是Vue提供的一个hook(钩子函数)，没有生命周期。Mounted会默认挂到当前组件，随组件加载而挂载，而不是main
    if(!element.value){return}
    element.value.addEventListener('touchstart', onStart)
    element.value.addEventListener('touchmove', onMove)
    element.value.addEventListener('touchend', onEnd)
  })

  onUnmounted(()=>{
    if(!element.value){return}
    element.value.addEventListener('touchstart', onStart)
    element.value.addEventListener('touchmove', onMove)
    element.value.addEventListener('touchend', onEnd)
  })
  return {
    swiping, distance, direction, start, end
  }
}