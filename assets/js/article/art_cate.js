$(function() {
    let layer = layui.layer;
    let form = layui.form;

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    initArtCateList();
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
            }
        })
    })
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id');
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败！');
                }
                form.val('form-edit', res.data);
            }
        })
    })

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                }
            })
            layer.close(index);
            initArtCateList();
        });
    })
})