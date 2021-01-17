(function () {
    let $account = $(".userName"),
        $password = $(".userPass"),
        $submit = $(".submit"),
        $viewPW = $(".icon-chakan");

    // 点击查看密码
    let flag = false;
    $viewPW.click(function () {
        if (flag) {
            $password.attr("type", "password");
            flag = false;
        } else {
            $password.attr("type", "text");
            flag = true;
        }
    });

    // 对密码进行加密处理
    function encodePass(w) {
        return md5(w).substring(4).split("").reverse().join("").substring(4);
    }

    // 给当前的登录按钮绑定点击事件
    $submit.click(async function () {
        let account = $account.val().trim();
        let password = $password.val().trim();
        // 对账号密码进行非空验证
        if (!account || !password) {
            alert("当前用户名或密码不能为空");
            return;
        } else if (account.includes("=") || password.includes("=")) {
            alert("当前用户名或密码不能包含=");
            return;
        } else if (account.includes("&") || password.includes("&")) {
            alert("当前用户名或密码不能包含&");
            return;
        }
        password = encodePass(password);
        // 发送请求
        let res = await axios.post("/user/login", {
            account,
            password,
        });
        let { code, power } = res;
        if (code == 0) {
            alert("登录成功", {
                handled: function () {
                    localStorage.setItem("power", encodeURIComponent(power));
                    localStorage.setItem(
                        "account",
                        encodeURIComponent(account)
                    );
                    location.href = "index.html";
                },
            });
        } else {
            alert("用户名和密码不匹配");
            // 登陆失败，清空用户名和密码
            $account.val("");
            $password.val("");
        }
    });
})();
