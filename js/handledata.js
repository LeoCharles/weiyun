

var dataControl = {
    // 获取父级id下所有子数据
    getChildById: function (data, pid) {
        var arr = [];
        for ( var i = 0, len = data.length; i < len; i++ ) {
            if ( data[i].pid == pid ) {
                arr.push( data[i] );
            }
        };
        return arr;
    },
    // 获取当前id的所有父级数据
    getParents: function (data, id) {
        var arr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if ( data[i].id == id ) {
                arr.push(data[i]);
                arr = arr.concat(dataControl.getParents(data, data[i].pid));
                break;
            }
        }
        return arr;
    },
    // 获取当前id的所有子数据
    getChildren: function (data, id, arr, bl) {
        // arr不存在时，第三个参数是bl
        if (arr.constructor === Boolean) {
            // bl代表是否包含当前元素
            bl = arr;
            arr = null;
        }
        var arr = arr || [];
        var children = dataControl.getChildById(data, id);
        if (bl) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].id == id) {
                    arr.push(data[j]);
                }
            }
        }
        for (var i = 0; i < children.length; i++) {
            arr.push(children[i]);
            dataControl.getChildren(data, children[i].id, arr);
        }
        return arr;
    },
    // 获取当前id的层级数
    getLeveById: function (data, id) {
        return dataControl.getParents(data, id).length;
    },
    // 获取当前id的所有父级的name
    getParentsNameAll: function (id) {
        return getParents(id).map(function (item) {
            return item.name;
        });
    },
    // 判断当前id是否有子级
    hasChrildren: function (data, id) {
        return dataControl.getChildById(data, id).length !== 0;
    },
    // 改变数据的id
    changeDataId: function (newChild, item, pid){
        var prevId = item.id;
        var prevPid = item.pid;
        var newId = random();
        var newPid = pid;
        item.id = newId;
        item.pid = newPid;
        for( var i = 1; i < newChild.length; i++ ){
            if( newChild[i].pid == prevId ){
                dataControl.changeDataId(newChild, newChild[i], newId);
            }
        }
    },
    // 改变数据
    changeDataById: function (newChild, pid){
        var extendChild = tools.extend(newChild, true);
        dataControl.changeDataId(extendChild, extendChild[0], pid);
        return  extendChild;
    },
    // 判断一个数组中是否包含另一个项
    isContain: function (arr, item){
        for( var j = 0; j < arr.length; j++ ){
            if( arr[j] === item ) return true;
        }
        return false;
    },
    // 要删除的数据，传入一个数组
    delectDataByData: function (data, children){
        return data.filter(function (item){
            return !dataControl.isContain(children, item)
        });
    },
    // 数据中是否已经存在这个名字
    isNameExsit: function (data, id, names,currentId){
        var children = dataControl.getChildById(data,id);
        for( var i = 0; i < children.length; i++ ){
            if( children[i].name == names && children[i].id != currentId ){
                return true;
            }
        }
        return false;
    },
    // 修改某个id的名字
    changeNameById:function (data, id, name){
        for( var i = 0; i < data.length; i++ ){
            if( data[i].id == id ){
                data[i].name = name;
                return true;
            }
        }
        return false;
    }


};
