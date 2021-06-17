$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    //自定义表单验证
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            if (value !== $('.reg-box [name="password"]').val())
                return '两次密码不一致，请重新输入！';
        }
    });

    //监听注册表单的提交事件
    let layer = layui.layer;
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        $.post('/api/reguser', { username: $('#form-reg [name="username"]').val(), password: $('#form-reg [name="password"]').val() }, function(res) {
            if (res.status !== 0)
                return layer.msg(res.message);
            layer.msg('注册成功，请登录！');
            $('#link_login').click();
        })
    })

    //监听登录表单的提交事件
    $('#form-login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                localStorage.setItem('token', res.token);
                window.location.href = './index.html';
            }
        })
    })
})