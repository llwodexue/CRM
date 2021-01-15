// 登录和退出
(function () {
    // 登录
    axios.get("/user/login").then((res) => {
        let { code } = res;
        if (code !== 0) {
            alert("请登录", {
                handled: function () {
                    location.href = "login.html";
                },
            });
            return;
        }
    });
    $(".baseBox span").html(`您好：${decodeURIComponent(localStorage.account)}`
    );
    // 退出
    $(".baseBox a").click(() => {
        axios.get("/user/signout").then((res) => {
            let { code } = res;
            if (code == 0) {
                alert("退出成功，3秒后回到登录页面", {
                    handled() {
                        localStorage.removeItem("power");
                        localStorage.removeItem("account");
                        location.href = "login.html";
                    },
                });
                return;
            }
        });
    });
})();

// 渲染界面
(function () {
    let $headerBox = $(".headerBox"),
        $container = $(".container"),
        $footerBox = $(".footerBox"),
        $menuBox = $(".menuBox");
    function computed() {
        let winH = $(window).height(),
            headerH = $headerBox.outerHeight(),
            footerH = $footerBox.outerHeight();
        $container.css("height", winH - headerH - footerH);
    }
    // 动态调整内容区高度
    $(window).resize(() => {
        computed();
    });
    computed();

    // 根据权限对左侧菜单进行渲染
    let power = decodeURIComponent(localStorage.getItem("power"));
    let str = ``;
    axios
        .get("/user/router")
        .then((res) => {
            let { code, data } = res;
            if (code == 0) {
                data.forEach((item) => {
                    let { title, icon, children } = item;
                    str += `<div class="itemBox">
                <h3><i class="iconfont ${icon}"></i>${title}</h3>
                <nav class="item">
                    ${children
                        .map((item) => {
                            let { subTitle, href, flag } = item;
                            return power.includes(flag)
                                ? `<a href="${href}" target="_iframe">${subTitle}</a>`
                                : "";
                        })
                        .join("")}
                </nav></div>`;
                });
                $menuBox.html(str);
            }
        })
        .then(() => {
            // 利用事件委托实现收起和展开
            $menuBox.click(function (e) {
                let target = e.target,
                    $target = $(target),
                    tagName = target.tagName;
                if (tagName === "I") {
                    $target = $target.parent();
                    tagName = "H3";
                }
                if (tagName === "H3") {
                    $target.next().stop().slideToggle();
                }
            });

            // 点击第一个navBox按钮显示左侧菜单前三个
            let $itemBox = $menuBox.find("div"),
                $organize = $itemBox.filter(":lt(3)"),
                $customer = $itemBox.eq(3);
            let index = 0;
            function showMenu(index) {
                if (index == 0) {
                    $organize.css("display", "block");
                    $customer.css("display", "none");
                    $("iframe").attr("src", "page/userlist.html");
                } else {
                    $organize.css("display", "none");
                    $customer.css("display", "block");
                    $("iframe").attr("src", "page/customerlist.html");
                }
            }
            showMenu(index);
            $(".navBox a").click(function () {
                index = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                showMenu(index);
            });
        });
})();
