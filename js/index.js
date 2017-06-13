(function () {

    /* 主要内容区高度自适应 */

    var header = tools.$('.header')[0];
    var weiyunContent = tools.$('.weiyun-content')[0];
    var headerH = header.offsetHeight;

    // 封装改变高度函数
    function changeHeight() {
        var viewH = document.documentElement.clientHeight;
        weiyunContent.style.height = viewH - headerH + 'px';
    }

    // 初始化
    changeHeight();
    // 窗口改变时，重新计算可视区高度
    window.onresize = changeHeight;


    /* 渲染文件展示区、树形导航区和文件路径区 */

    var datas = data.files;  // 获取后台数据
    var fileList = tools.$('.file-list')[0]; // 文件展示区容器
    var treeMenu = tools.$('.tree-menu')[0]; // 树形导航区容器
    var pathNav = tools.$('.path-nav')[0]; // 文件路径导航区容器
    var empty = tools.$('.g-empty')[0]; // 文件展示区空白提醒
    var parentId = 0; // 父级id，默认为0

    // 渲染文件展示区html结构，默认最外层
    fileList.innerHTML = createFilesHtml(datas, 0);
    // 给文件展示区每个文件注册点击事件
    tools.addEvent(fileList, 'click', function (ev) {
        var target = tools.getTarget(ev);
        // 找到class为item的父级,设置为ev.target
        if ( tools.parents(target, '.item') ) {
            target = tools.parents(target, '.item');
            // 获取父级的自定义属性file-id，渲染子数据
            var fileId = target.dataset.fileId;
            renderFilesPathTree(fileId);
        }
    });

    // 渲染树形导航区html结构，默认都展开
    treeMenu.innerHTML = createTreeHtml(datas, -1);
    // 给树形导航区每个文件注册点击事件
    tools.addEvent(treeMenu, 'click', function (ev) {
        var target = tools.getTarget(ev);
        if( tools.parents(target, '.tree-title') ) {
            target = tools.parents(target, '.tree-title');
            var fileId = target.dataset.fileId;
            renderFilesPathTree(fileId);
        }
    });

    // 渲染文件路径导航区html结构，默认渲染第一层
    pathNav.innerHTML = createPathNavHtml(datas, 0);
    // 树形导航区默认定位到最外层
    positionTreeById(0);
    // 给文件路径导航区每个文件注册点击事件
    tools.addEvent(pathNav, 'click', function (ev) {
        var target = tools.getTarget(ev);
        if( tools.parents(target, 'a') ) {
            var fileId = target.dataset.fileId;
            renderFilesPathTree(fileId);
        }
    });

    // 在树形导航区定位到传入id的文件
    function positionTreeById(fileId) {
        var ele = document.querySelector('.tree-title[data-file-id="'+ fileId +'"]');
        tools.addClass(ele, 'tree-nav');
    }

    // 渲染文件展示区、树形导航区和文件路径区数据
    function renderFilesPathTree(fileId) {
        var treeNav = tools.$('.tree-nav', treeMenu)[0]; // 当前定位的文件
        var hasChild = dataControl.hasChrildren(datas, fileId); // 是否有子级

        // 判断是否有子数据，再渲染文件展示区
        if ( hasChild ) {
            empty.style.display = 'none';
            fileList.innerHTML = createFilesHtml(datas, fileId);
        } else {
            empty.style.display = 'block';
            fileList.innerHTML = '';
        }

        // 渲染文件路径导航区
        pathNav.innerHTML = createPathNavHtml(datas, fileId);

        // 定位树形导航区当前文件
        tools.removeClass(treeNav, 'tree-nav');
        positionTreeById(fileId);

        // 获取所有渲染后的文件，再给这些文件绑定事件
        fileItem = tools.$('.file-item', fileList);
        tools.each(fileItem, function(item, index){
            fileHandle(item);
        })

        // 重新渲染后取消全选按钮勾选
        tools.removeClass(checkedAll, 'checked');

        // 重新渲染后保存当前父级id
        parentId = fileId;
    }


    /* 鼠标移入移除、全选和单选 */

    var fileItem = tools.$('.file-item', fileList); // 文件展示区所有文件
    var checkedAll = tools.$('.cheched-all')[0]; // 全选按钮
    var allCheckbox = tools.$('.checkbox', fileList); // 当前文件展示区所有的checkbox

    // 给每个文件初始化事件绑定
    tools.each(fileItem, function (item, index) {
         fileHandle(item);
    });

    // 给全选按钮添加事件
    tools.addEvent(checkedAll, 'click', function(ev) {
        // 获取最新的文件和所有的checkbox
        fileItem = tools.$('.file-item', fileList);
        allCheckbox = tools.$('.checkbox', fileList);

        // 判断checkbox是否已经勾选
        var isAddClass = tools.toggleClass(this, 'checked');

        if ( isAddClass ) {
            tools.each(fileItem, function (item, index) {
                tools.addClass(item, 'file-checked');
                tools.addClass(allCheckbox[index], 'checked');
            });
        } else {
            tools.each(fileItem, function (item, index) {
                tools.removeClass(item, 'file-checked');
                tools.removeClass(allCheckbox[index], 'checked');
            })
        }
    });

    // 单独给一个文件添加事件处理
    function fileHandle(item) {
        var checkbox = tools.$('.checkbox', item)[0];

        // 每个文件添加鼠标移入事件
        tools.addEvent(item, 'mouseenter', function () {
            tools.addClass(this, 'file-checked');
        });

        // 每个文件添加鼠标移出事件
        tools.addEvent(item, 'mouseleave', function () {
            if ( !tools.hasClass(checkbox, 'checked') ) {
                tools.removeClass(this, 'file-checked');
            }
        });

        // 给checkbox添加点击事件，并阻止事件冒泡
        tools.addEvent(checkbox, 'click', function(ev) {
            // 获取最新的allCheckbox
            allCheckbox = tools.$('.checkbox', fileList);
            // toggleClass返回一个布尔值，有这个class则为true
            var isAddClass = tools.toggleClass(this, 'checked');
            if ( isAddClass ) {
                // 判断是否所有的checkbox都有checked
                if ( getCheckedFile().length == allCheckbox.length ) {
                    tools.addClass(checkedAll, 'checked');
                }
            } else {
                // 只要没有checked这个class就说明没有全选
                tools.removeClass(checkedAll, 'checked');
            }
            tools.stopPropagation(ev);
        });
    }

    // 获取所有checkbox被勾选的文件
    function getCheckedFile() {
        var arr = [];
        tools.each(allCheckbox, function (checkbox, index) {
            if (tools.hasClass(checkbox, 'checked')) {
                arr.push(fileItem[index]);
            }
        });
        return arr;
    }

    /* 框选功能 */

    var newDiv = null;
    var disX = 0, disX = 0;

    tools.addEvent(document, 'mousedown', function (ev) {
        var target = tools.getTarget(ev);
        if ( tools.parents(target, '.nav-a') ) return;
        disX = ev.clientX;
        disY = ev.clientY;

        // 鼠标移动
        tools.addEvent(document, 'mousemove', mouseMove)

        // 鼠标抬起
        tools.addEvent(document, 'mouseup', mouseUp)

        // 阻止默认行为
        ev.preventDefault();
    })

    // 鼠标移动
    function mouseMove(ev) {
        fileItem = tools.$('.file-item', fileList);
        allCheckbox = tools.$('.checkbox', fileList);
        if ( Math.abs(ev.clientX - disX) > 20 || Math.abs(ev.clientY - disY) > 20 ) {
            // 只生成一个div
            if ( !newDiv ) {
                newDiv = document.createElement('div');
                document.body.appendChild(newDiv);
                newDiv.className ='select-box';
            }
            newDiv.style.display = 'block';
            newDiv.style.width = Math.abs(ev.clientX - disX) + 'px';
            newDiv.style.height = Math.abs(ev.clientY - disY) + 'px';
            newDiv.style.left = Math.min(ev.clientX, disX) + 'px';
            newDiv.style.top = Math.min(ev.clientY, disY) + 'px';

            // 拖选框碰撞检测，如果碰上文件，就勾选文件
            tools.each(fileItem, function (item, index) {
                if ( tools.collisionRect(newDiv, item) ) {
                    tools.addClass(item, 'file-checked');
                    tools.addClass(allCheckbox[index], 'checked');
                } else {
                    tools.removeClass(item, 'file-checked');
                    tools.removeClass(allCheckbox[index], 'checked');
                }
            });
            // 如果全部选中，勾选全选按钮
            if ( getCheckedFile().length == allCheckbox.length ) {
                tools.addClass(checkedAll, 'checked');
            } else {
                tools.removeClass(checkedAll, 'checked');
            }
        }
    }
    // 鼠标抬起
    function mouseUp() {
        tools.removeEvent(document, 'mousemove', mouseMove);
        tools.removeEvent(document, 'mouseup', mouseUp);
        if (newDiv) {
            newDiv.style.display = 'none';
        }
    }


    /* 新建文件 */

     var create = tools.$('.create')[0];

     tools.addEvent(create, 'mouseup', function () {
        // 新建文件之前先把空白提醒隐藏
        empty.style.display = 'none';

        var firstElement = fileList.firstElementChild;
        var newElement = createFileElement({
            title: '',
            id: new Date().getTime()
        })
        var fileTitle = tools.$('.file-tilte', newElement)[0];
        var fileEdtor = tools.$('.file-edtor', newElement)[0];
        var edtor = tools.$('.edtor', newElement)[0];

        fileTitle.style.display = 'none';
        fileEdtor.style.display = 'block';
        fileList.insertBefore(newElement, firstElement);
        edtor.select(); // 自动获取光标
        create.isCreateFile = true;// 添加一个状态，表示正在创建文件
     });

     // 给document添加mousedown事件，鼠标在其他地方点击时，确定创建文件
     tools.addEvent(document, 'mousedown', function () {

        if ( create.isCreateFile ) {
            var firstElement = fileList.firstElementChild;
            var edtor = tools.$('.edtor', firstElement)[0];
            var value = edtor.value.trim();

            // 没有输入文件名。则创建不成功
            if (value === '') {
                fileList.removeChild(firstElement);
                if (fileList.innerHTML === '') {
                    empty.style.display = 'block';
                }
            } else {
                // 输入框有内容时，文件创建成功时
                var fileTitle = tools.$('.file-tilte', firstElement)[0];
                var fileEdtor = tools.$('.file-edtor', firstElement)[0];

                // 显示文件名，隐藏输入框
                fileTitle.style.display = 'block';
                fileEdtor.style.display = 'none';
                fileTitle.innerHTML = value;

                // 给新文件添加事件
                fileHandle(firstElement);

                // 获取新文件的数据
                var fileId = tools.$('.item', firstElement)[0].dataset.fileId;
                var pid = parentId; // 文件渲染时，获取到父级id
                var newFileData = {
                    id: fileId,
                    pid: pid,
                    title: value,
                    type: 'file'
                };

                // 将新建的文件的数据添加到数组
                datas.unshift(newFileData);

                var level = dataControl.getLeveById(datas, fileId);
                var elementDiv = document.querySelector('.tree-title[data-file-id="'+pid+'"]');
                var nextElementUl = elementDiv.nextElementSibling;

                // 将新生成的li元素添加到ul
                nextElementUl.append(createTreeElement({
                    id: fileId,
                    title: value,
                    level: level,
                }))
                // 判断新的ul里是否有子元素
                if (nextElementUl.innerHTML !== '') {
                    tools.addClass(elementDiv, 'tree-contro');
                    tools.removeClass(elementDiv, 'tree-contro-none');
                }

                // 创建成功，显示提示信息
                showTips('ok', '新建文件夹成功!');
            }
            //无论创建成不成功，状态都要设为false
            create.isCreateFile = false;
        }
     })

     /* 提示信息 */

     var fullTipBox = tools.$('.full-tip-box')[0];
     var tipText = tools.$('.text', fullTipBox)[0];

     // 提醒信息函数
     function showTips(className, text) {
        tools.addClass(fullTipBox, className);
        tipText.innerHTML = text;

        // 每次调用都从-32px到0的位置运动
        fullTipBox.style.top = '-32px';
        fullTipBox.style.transition = 'none';

        // 显示提示信息
        setTimeout(function () {
            fullTipBox.style.top = 0;
            fullTipBox.style.transition = '.3s';
        }, 0);

        // 2s后隐藏
        clearTimeout(fullTipBox.timer);
        fullTipBox.timer = setTimeout(function() {
            fullTipBox.style.top = '-32px';
            fullTipBox.style.transition = 'none';
            tools.removeClass(fullTipBox, className);
        }, 2000);
     }


     /* 重命名 */
     // 需要完善
     var rename = tools.$('.rename')[0];

     tools.addEvent(rename, 'mouseup', function () {
        fileItem = tools.$('.file-item', fileList);
        allCheckbox = tools.$('.checkbox', fileList);

        if ( !getCheckedFile().length ) {
            showTips('err', '请选择文件！');
        } else if (getCheckedFile().length > 1) {
            showTips('err', '只能对单个文件重命名！');
        } else {
            var selectElement = tools.$('.file-checked', fileList)[0];
            var fileTitle = tools.$('.file-tilte', selectElement)[0];
            var fileEdtor = tools.$('.file-edtor', selectElement)[0];
            var edtor = tools.$('.edtor', selectElement)[0];

            // 显示输入框，隐藏文件名
            fileTitle.style.display = 'none';
            fileEdtor.style.display = 'block';
            edtor.select(); // 自动获取光标

            tools.addEvent(document, 'mousedown', function() {
                var value = edtor.value.trim();
                if (value == '') {
                    showTips('err', '请输入文件名！');
                    console.log()
                } else {
                    fileTitle.innerHTML = value;
                    fileTitle.style.display = 'block';
                    fileEdtor.style.display = 'none';

                }
            })
        }
     })


}());