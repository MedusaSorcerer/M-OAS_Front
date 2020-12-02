layui.use(["form", "okLayer", "okUtils", "okMock", 'tree', 'util'], function () {
    let util = layui.util;
    let form = layui.form;
    let okLayer = layui.okLayer;
    let okUtils = layui.okUtils;
    let okMock = layui.okMock;
    let tree = layui.tree;
    let roleList = {};
    let roleId = '';

    okUtils.ajax(okMock.api.role, 'get').done(function (response) {
        if (response.status === 200) {
            var inner = '';
            for (var val of response.data) {
                var default_ = inner === '' ? 'select' : '';
                inner += '<p><button class="layui-btn layui-btn-primary ' + default_ + '" lay-filter="role" lay-submit data-id="' + val.id + '">' + val.name + '</button></p>';
                roleList[val.id] = {a: val.role, b: val.admin};
            }
            document.getElementById('role-list').innerHTML = inner;
            var but = document.querySelector("button[data-id='" + okUtils.session('roleId') + "']");
            if (!but) {
                but = document.querySelector("button[data-id='" + response.data[0]['id'] + "']");
                okUtils.session('roleId', response.data[0]['id']);
            }
            but.click()
        }
    }).fail(function (error) {
        console.log(error);
    });

    function fit(data, method) {
        var ids = [];
        for (var val of data) {
            if (method === true) {
                if (val['spread'] === true) {
                    if (val['children']) {
                        ids = ids.concat(fit(val['children']), true);
                    } else {
                        ids.push(val['id']);
                    }
                }
            } else {
                if (val['spread'] === true) {
                    ids.push(val['id']);
                    if (val['children']) {
                        ids = ids.concat(fit(val['children']));
                    }
                }
            }
        }
        return ids;
    }

    form.on('submit(role)', function (data) {
        for (var val of document.getElementsByClassName('select')) {
            val.classList.remove('select');
        }
        data.elem.classList.add('select');
        roleId = data.elem.getAttribute('data-id');
        okUtils.session('roleId', roleId);
        tree.reload('role', {});
        tree.setChecked('role', fit(roleList[roleId]['a'], true));
        if (roleList[roleId]['b'] === true) {
            for (var doc1 of document.getElementById('tool').children) {
                if (doc1.getAttribute('lay-active') === 'add') {
                    continue
                }
                doc1.classList.add('layui-btn-disabled');
            }
        } else {
            for (var doc2 of document.getElementById('tool').children) {
                doc2.classList.remove('layui-btn-disabled');
            }
        }
        form.render();
        return false;
    });

    tree.render({
        elem: '#role-detail',
        id: 'role',
        showCheckbox: true,
        showLine: false,
        data: [
            {
                title: 'Dashboard',
                spread: true,
                field: 'm/1',
                id: 'm/1',
                checked: true,
            },
            {
                title: '流程处理',
                spread: true,
                field: 'm/2',
                id: 'm/2',
                children: [
                    {
                        title: '我提交的流程',
                        spread: true,
                        field: 'm/2/1',
                        id: 'm/2/1',
                    },
                    {
                        title: '我处理的流程',
                        spread: true,
                        field: 'm/2/2',
                        id: 'm/2/2',
                    }
                ]
            },
            {
                title: '考勤处理',
                spread: true,
                field: 'm/3',
                id: 'm/3',
                children: [
                    {
                        title: '个人考勤',
                        spread: true,
                        field: 'm/3/1',
                        id: 'm/3/1',
                    }
                ]
            },
            {
                title: '工作报告',
                spread: true,
                field: 'm/4',
                id: 'm/4',
                children: [
                    {
                        title: '工作日报',
                        spread: true,
                        field: 'm/4/1',
                        id: 'm/4/1',
                    },
                    {
                        title: '工作月报',
                        spread: true,
                        field: 'm/4/2',
                        id: 'm/4/2',
                    },
                    {
                        title: '项目工程',
                        spread: true,
                        field: 'm/4/3',
                        id: 'm/4/3',
                    }
                ]
            },
            {
                title: '人事管理',
                spread: true,
                field: 'm/5',
                id: 'm/5',
                children: [
                    {
                        title: '员工管理',
                        spread: true,
                        field: 'm/5/1',
                        id: 'm/5/1',
                    },
                    {
                        title: '角色管理',
                        spread: true,
                        field: 'm/5/3',
                        id: 'm/5/3',
                    },
                    {
                        title: '部门管理',
                        spread: true,
                        field: 'm/5/2',
                        id: 'm/5/2',
                    },
                ]
            },
            {
                title: '知识库',
                spread: true,
                field: 'm/6',
                id: 'm/6',
                children: [
                    {
                        title: '知识广场',
                        spread: true,
                        field: 'm/6/1',
                        id: 'm/6/1',
                    },
                    {
                        title: '我的文章',
                        spread: true,
                        field: 'm/6/2',
                        id: 'm/6/2',
                    }
                ]
            },
            {
                title: '解析工具',
                spread: true,
                field: 'm/7',
                id: 'm/7',
                children: [
                    {
                        title: '日志解析',
                        spread: true,
                        field: 'm/7/1',
                        id: 'm/7/1',
                    }
                ]
            },
            {
                title: '系统设置',
                spread: true,
                field: 'm/8',
                id: 'm/8',
                children: [
                    {
                        title: '个人设置',
                        spread: true,
                        field: 'm/8/1',
                        id: 'm/8/1',
                    },
                    {
                        title: '安全设置',
                        spread: true,
                        field: 'm/8/2',
                        id: 'm/8/2',
                    },
                    {
                        title: '系统设置',
                        spread: true,
                        field: 'm/8/3',
                        id: 'm/8/3',
                    }
                ]
            }
        ]
    });

    util.event('lay-active', {
        update: update,
        add: add,
        del: del,
    })

    function update() {
        if (roleId && roleList[roleId]['b'] === false) {
            var role = fit(tree.getChecked('role'));
            okUtils.ajax(okMock.api.role + '/' + roleId, 'put', JSON.stringify({role: role}), null, true, true).done(function () {
                layer.msg('修改成功', {icon: 1, time: 1000}, function () {
                    window.location.reload(function () {
                        document.getElementsByTagName('button')[5].click()

                    });
                });
            }).fail(function (error) {
                console.log(error)
            })
        }
    }

    function add() {
        layer.prompt({
            formType: 2,
            value: '',
            title: '请输入新增角色名',
            area: ['800px', '20px'],
        }, function (value) {
            if (value) {
                okUtils.ajax(okMock.api.role, 'post', {'name': value}).done(function () {
                    layer.msg('新增成功', {icon: 1, time: 1000}, function () {
                        window.location.reload();
                    });
                }).fail(function (error) {
                    console.log(error);
                });
            }
        });
    }

    function del() {
        if (roleId && roleList[roleId]['b'] === false) {
            okLayer.confirm("确定要删除吗？", function () {
                okUtils.ajax(okMock.api.role + '/' + roleId, 'delete').done(function () {
                    layer.msg('删除成功', {icon: 1, time: 1000}, function () {
                        okUtils.session('roleId', null);
                        window.location.reload();
                    });
                }).fail(function (error) {
                    console.log(error)
                });
            })
        }
    }

    okLoading.close();
})