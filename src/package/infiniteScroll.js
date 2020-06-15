
import throttle from 'lodash/throttle'

// 自定义用户参数 稍后和用户传入的进行合并
const attributes = {
    delay:{
        default:200
    },
    immediate:{
        default:true
    },
    disabled:{
        default:false
    },
    distance:{
        default:10
    }
}
const getScrollOptions = (el,vm)=>{
    return Object.entries(attributes).reduce((map,[key,option])=>{
        let defaultValue = option.default;
        let value = el.getAttribute(`infinite-scroll-${key}`);
        value = vm[value] ? vm[value] : defaultValue;
        map[key] = value;
        return map;
    },{})
}
const getScrollContainer = (el)=>{
    let parent = el;
    while(parent){
        if(document.documentElement == parent){
            return window;
        }
        const overflow = getComputedStyle(parent)['overflow-y'];
        if(overflow.match(/scroll|auto/)){
            return parent;
        }
        parent = parent.parentNode;
    }
}
const handleScroll = function (cb) {
    let {container,el,vm,observer} = this[scope];

    let {disabled,distance} = getScrollOptions(el,vm);

    if(disabled) return; // 没有更多数据了
    // 当前卷去的高度 + 可见高度= 当前滚动元素的底部显示的位置
    let scrollBottom = container.scrollTop + container.clientHeight; 
    // 总页面高度 - 当前滚动元素的底部显示的位置 和 需要加载的距离进行比对
    if(container.scrollHeight -scrollBottom <= distance ){
        cb();
    }else{
        if(observer){ // 解除监控，滚动时不需要再次进行计算
            observer.disconnect();
            this[scope].observer = null;
        }
    }
}
const scope = 'infinite-scroll';
export default {
    name:'infinite-scroll',
    inserted(el,bindings,vnode){
        const cb = bindings.value;
        const vm = vnode.context;
        const container = getScrollContainer(el);
        
        if(container !== window){
            let {delay,immediate} = getScrollOptions(el,vm);
         
            let onScroll = throttle(handleScroll.bind(el,cb),delay);
            el[scope] = {
                onScroll,
                container,
                el,
                vm
            }
            if(immediate){
                const observer =el[scope].observer= new MutationObserver(onScroll);
                observer.observe(container,{
                    childList:true,// 监控孩子列表的变化 
                    subtree:true, // 当子dom 发生变化也触发
                });
                onScroll(); // 默认先加载
            }
            container.addEventListener('scroll',onScroll);
        }
    },
    unbind(el){
        const {onScroll,container} = el[scope];
        if(container){
            container.removeEventListener('scroll',onScroll);
            el[scope] = null;
        }
    }
}