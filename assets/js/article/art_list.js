$(function() {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    initTable();
    initCate();

    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = dt.getMonth() + 1;
        let d = dt.getDate();
        let hh = dt.getHours();
        hh = hh > 9 ? hh : '0' + hh;
        let mm = dt.getMinutes();
        mm = mm > 9 ? mm : '0' + mm;
        let ss = dt.getSeconds();
        ss = ss > 9 ? ss : '0' + ss;
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage()
            }
        })
    }

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                let htmlStr = template('tpl-cate', res);
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render(res.total);
            }
        })
    }
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        let cate_id = $('[name="cate_id"]').val();
        let state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    function renderPage(total, first) {
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total //数据总数，从服务端得到
                ,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    }
    $('tbody').on('click', $('.btn-delete'), function() {
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            let id = $(this).attr('data-id');
            let num = $('.btn-delete').length;
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg('删除文章数据失败！');
                    }
                    layer.msg('删除文章数据成功！');
                    if (num == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                        initTable();
                    }
                }
            })
            layer.close(index);
        });
    })
})