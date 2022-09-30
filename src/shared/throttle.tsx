export const throttle = (fn: Function, time: number)=>{
    let timer: number | undefined = undefined   //timer在本次声明之前存在，说明之前调用过
    return (...args: any[])=>{
        if(timer){
            return
        }else{
            fn(...args)
            timer = setTimeout(()=>{
                timer = undefined
            },time)
        }
    }
}