

var tools = (function () {
    // 创建tools对象
    var toolsObj = {
        // $选择器
        $: function (selector, context) {
            context = context || document;
            // 有空格时，采用高级选择器
            if (selector.indexOf('') !== -1) {
                return context.querySelectorAll(selector);
            }
            // id选择器
            else if (selector.charAt(0) === '#') {
                return document.getElementById(selector.slice(1));
            }
            // class选择器
            else if (selector.charAt(0) === '.') {
                return context.getElementsByClassName(selector.slice(1));
            }
            // 标签选择器
            else {
                return context.getElementsByTagName(selector)
            }
        },
        // 添加事件
        addEvent: function (element, eventName, eventFn) {
            if (element.addEventListener) {
                element.addEventListener(eventName, eventFn, false);
            } else if (element.attachEvent) {
                element.attachEvent('on' + eventName, eventFn);
            }
        },
        // 移除事件
        removeEvent: function (element, eventName, eventFn) {
            if (element.addEventListener) {
                element.removeEventListener(eventName, eventFn, false);
            } else if (element.attachEvent) {
                element.detachEvent('on' + eventName, eventFn);
            }
        },
        // 获取event对象
        getEvent: function(event){
            return event ? event : window.event;
        },
        // 获取事件目标
        getTarget: function(event){
            return event.target || event.srcElement;
        },
        // 阻止事件默认行为
        preventDefault: function(event){
            if (event.preventDefault){
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        // 阻止事件冒泡
        stopPropagation: function(event){
            if (event.stopPropagation){
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },
        // 判断是否有某个类
        hasClass: function(element, className){
            var arr = element.className.split(' '); // 通过空格分割类名
            for( var i = 0, len = arr.length; i < len; i++ ){
                if( arr[i] === className ){
                    return true;
                }
            }
            return false;
        },
        // 添加类
        addClass: function (element, className) {
            if (typeof className === 'string') {
                if (!tools.hasClass(element, className)) {
                    element.className += ' ' + className;
                }
            }
        },
        // 删除类
        removeClass: function (element, className) {
            var arr = element.className.split(' ');
            for ( var i = 0, len = arr.length; i < len; i++ ) {
                if (arr[i] === className) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            element.className = arr.join(' ');
        },
        // 交替添加删除类
        toggleClass: function (element, className) {
            if (tools.hasClass(element, className)) {
                tools.removeClass(element, className);
                return false;
            } else {
                tools.addClass(element, className);
                return true;
            }
        },
        // 隐藏
        hide: function (element){
            return element.style.display = "none";
        },
        // 显示
        show:function (element){
            return element.style.display = "block";
        },
        // 获取父级节点
        parents: function(obj, selector){
            if ( selector.charAt(0) === "#" ){
                while (obj.id !== selector.slice(1)){
                    obj = obj.parentNode;
                }
            } else if ( selector.charAt(0) === "." ){
                while ((obj && obj.nodeType !== 9) && !tools.hasClass(obj,selector.slice(1))) {
                    obj = obj.parentNode;
                }
            } else {
                while (obj && obj.nodeType !== 9 && obj.nodeName.toLowerCase() !== selector){
                    obj = obj.parentNode;
                }
            }
            return obj && obj.nodeType === 9  ? null : obj;
        },
        // 遍历
        each: function (obj, callBack) {
            for (var i = 0, len = obj.length; i < len; i++) {
                callBack(obj[i], i);
            }
        },
        // 获取元素自身宽高
        getOffset: function (obj){
            return {
                width: obj.offsetWidth,
                height: obj.offsetHeight
            }
        },
        // 获取某个元素相对于视窗的位置集合
        getEleRect: function (obj) {
            return obj.getBoundingClientRect();
        },
        // 碰撞检测
        collisionRect: function(obj1, obj2){
            var obj1Rect = tools.getEleRect(obj1);
            var obj2Rect = tools.getEleRect(obj2);

            var obj1W = obj1Rect.width;
            var obj1H = obj1Rect.height;
            var obj1L = obj1Rect.left;
            var obj1T = obj1Rect.top;

            var obj2W = obj2Rect.width;
            var obj2H = obj2Rect.height;
            var obj2L = obj2Rect.left;
            var obj2T = obj2Rect.top;
            //碰上返回true 否则返回false
            if( obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H ){
                return true
            }else{
                false;
            }
        },

    };

    // 返回tools对象
    return toolsObj;

}());