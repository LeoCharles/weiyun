

// 单个文件的html结构
function fileConstruct(fileData) {
    var str = `
               <div class="item" data-file-id="${fileData.id}">
                    <lable class="checkbox"></lable>
                    <div class="file-img">
                        <i></i>
                    </div>
                    <div class="file-title-box">
                        <span class="file-tilte">${fileData.title}</span>
                        <span class="file-edtor">
                            <input type="text" value="${fileData.title}" class="edtor">
                        </span>
                    </div>
               </div>
               `;
    return str;
}

// 文件展示区html结构模板
function getFileHtml(fileData) {
    var fileHtml = `
                    <div class="file-item">
                        ${fileConstruct(fileData)}
                    </div>
                    `;
    return fileHtml;
}

// 创建文件展示区文件的元素对象，而不是字符串
function createFileElement(fileData) {
    var newDiv = document.createElement('div');
    newDiv.className = 'file-item';
    newDiv.innerHTML = fileConstruct(fileData);
    return newDiv;
}


// 创建文件展示区的html结构
function createFilesHtml(fileData, renderId) {
    // 获取所有子数据
    var childData = dataControl.getChildById(fileData, renderId);
    var fileHtml = '';
    // 渲染每个子数据的html结构
    childData.forEach(function (item) {
        fileHtml += getFileHtml(item);
    });
    return fileHtml;
}


// 创建树形导航区的html结构
function createTreeHtml(fileData, treeId) {
    var children = dataControl.getChildById(fileData, treeId);
    var html = '<ul>';
    children.forEach(function (item) {
        // 获取当前数据的层级 每深入一层，padding-left加14px
        var level = dataControl.getLeveById(fileData, item.id);
        // 判断当前数据是否有子数据，如果没有显示没有文件的样式
        var hasChild = dataControl.hasChrildren(fileData, item.id);
        // 如果没有子数据, 添加没有小图标的样式；有子数据，添加箭头朝下的样式
        var className = hasChild ? 'tree-contro' : 'tree-contro-none';
        // 根据子数据的个数循环生成多个li，每个li再递归调用createTreeHtml()
        html += `
                <li>
                    <div class="tree-title ${className}" data-file-id="${item.id}" style="padding-left:${level*14}px;">
                        <span>
                            <strong class="ellipsis">${item.title}</strong>
                            <i class="ico"></i>
                        </span>
                    </div>
                    ${createTreeHtml(fileData, item.id)}
                </li>
                `;
    })
    html += '</ul>';
    return html;
}

// 创建树形导航的li元素对象
function createTreeElement(options) {
    var newLi = document.createElement('li');
    newLi.innerHTML = `
                    <div class="tree-title tree-contro-none" data-file-id="${options.id}" style="padding-left:${options.level*14}px;">
                        <span>
                            <strong class="ellipsis">${options.title}</strong>
                            <i class="ico"></i>
                        </span>
                    </div>
                    <ul></ul>
                        `;
    return newLi;
}


// 创建文件路径导航区html结构
function createPathNavHtml(fileData, fileId) {
    // 通过id获取所有父级，并反向排列
    var parents = dataControl.getParents(fileData, fileId).reverse();
    // 文件路径的层级数
    var lv = parents.length;
    // 文件路径的html结构
    var pathNavHtml = '';
    // 渲染每个文件的路径结构
    parents.forEach(function (item, index) {
        // 如果是当前文件路径的最后一个就返回，不拼接
        if (index === parents.length-1) return;
        pathNavHtml += `
                        <a href="javascript:void(0)" style="z-index: ${lv--};" data-file-id="${item.id}">
                            ${item.title}
                        </a>
                      `;
    });
    // 渲染当前文件路径的最后一个
    pathNavHtml += `
                    <span class="current-path" style="z-index: ${lv--};">
                        ${parents[parents.length-1].title}
                    </span>
                    `;
    return pathNavHtml;
}



