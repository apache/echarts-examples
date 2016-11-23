function initValidator() {

    $('#login-form').validator().on('valid.bs.validator', function(e) {
        // valid input
        if ($('#email-input').val() !== '' && $('#password-input').val() !== '') {
            $('#reg-btn,#login-btn').attr('disabled', false);
        }
    }).on('invalid.bs.validator', function(e) {
        // invalid input
        $('#reg-btn,#login-btn').attr('disabled', true);
    });

}

$(document).ready(function() {
    initValidator();
});



function showLogin() {

    if (!pipe.isLoggedIn) {
        // show login panel
        $('#login-dropdown-panel').slideToggle();
    } else {
        // show profile setting panel
        $('#user-dropdown-panel').slideToggle();
    }

}



function cancelLogin() {

    $('#login-dropdown-panel').slideUp();

}



function login() {

    var email = $('#email-input').val();
    var password = $('#password-input').val();

    if (!isLoginFormValid(email, password)) {
        alert('登录失败，请检查输入项！');
    }

    $.post('login', {
        email: email,
        password: password
    }, function(data) {
        log(data.name + '登录成功');
        $('#login-dropdown-panel').slideUp();
        $('#nav-avatar-img')[0].src = data.avatar;
        pipe.isLoggedIn = true;
    }).fail(function (err) {
        alert('登录失败！');
        console.error(err);
    });

}



function logout() {

    $.get('logout', {}, function(data) {
        if (data.success) {
            // reload after logged out
            window.location.reload();
        }
    });

}



function register() {

    var email = $('#email-input').val();
    var password = $('#password-input').val();

    if (!isLoginFormValid(email, password)) {
        alert('注册失败，请检查输入项！');
    }

    $.post('register', {
        email: email,
        password: password
    }, function(data) {
        // login automatically
        $('#login-email').val($('#reg-email').val());
        $('#login-pw').val($('#reg-pw').val());
        login();
    }).fail(function (err) {
        alert('注册失败！');
        console.error(err);
    });

}



function isLoginFormValid(email, password) {

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordRe = /^[0-9A-Za-z_]{8,16}$/;

    return emailRe.test(email) && passwordRe.test(password);

}
