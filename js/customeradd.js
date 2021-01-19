let customerAddModule = (function () {
    let $userName = $(".username"),
        $woman = $("#woman"),
        $userEmail = $(".useremail"),
        $userPhone = $(".userphone"),
        $userQQ = $(".userqq"),
        $userWeiXin = $(".userweixin"),
        $customerAddress = $(".customeraddress"),
        $customerType = $(".customertype"),
        $spanUserName = $(".spanusername"),
        $spanUserEmail = $(".spanuseremail"),
        $spanUserPhone = $(".spanuserphone"),
        $submit = $(".submit");

    let renderSelect = (data) => {
        let str = ``;
        data.forEach((item) => {
            str += `<option value="${item.id}">${item.name}</option>`;
        });
        return str;
    };

    // 渲染客户类型下拉框
    let bindList = () => {
        return axios.get("/customer/type").then((res) => {
            let { code, data } = res;
            if (code == 0) {
                $customerType.html(renderSelect(data));
            }
        });
    };

    // 从客户页点编辑附带信息
    let customerInfo = (customerId) => {
        return axios
            .get("/customer/info", { params: { customerId } })
            .then((res) => {
                let {
                    code,
                    data: {
                        name,
                        email,
                        phone,
                        sex,
                        QQ,
                        weixin,
                        type,
                        address,
                    },
                } = res;
                if (code == 0) {
                    $userName.val(name);
                    sex == 0 ? $woman.prop("checked", true) : null;
                    $userEmail.val(email);
                    $userPhone.val(phone);
                    $userWeiXin.val(weixin);
                    $userQQ.val(QQ);
                    $customerType.val(type);
                    $customerAddress.val(address);
                }
            });
    };

    // 校验名字
    let checkUserName = () => {
        let value = $userName.val().trim();
        if (!value) {
            $spanUserName.html("当前用户名不能为空");
            return false;
        }
        $spanUserName.html("");
        return true;
    };
    // 校验邮箱
    let checkEmail = () => {
        let value = $userEmail.val().trim();
        if (!value) {
            $spanUserEmail.html("当前邮箱不能为空");
            return false;
        }
        let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (!reg.test(value)) {
            $spanUserEmail.html("邮箱不符合规则");
            return false;
        }
        $spanUserEmail.html("");
        return true;
    };
    // 校验手机号
    let checkPhone = () => {
        let value = $userPhone.val().trim();
        if (!value) {
            $spanUserPhone.html("当前手机号不能为空");
            return false;
        }
        if (value.length > 11) {
            $spanUserPhone.html("手机号长度超过11位");
            return false;
        }
        let reg = /^1[3-9]\d{9}$/;
        if (!reg.test(value)) {
            $spanUserPhone.html("手机号不符合规则");
            return false;
        }
        $spanUserPhone.html("");
        return true;
    };

    // 给点击按钮绑定点击事件
    let bindSubmit = (customerId) => {
        $submit.click(() => {
            if (!(checkUserName() && checkEmail() && checkPhone())) {
                alert("请检查表单信息");
                return;
            }
            alert("操作成功，即将返回客户列表页", {
                handled() {
                    location.href = "customerlist.html";
                },
            });
        });
    };

    return {
        init() {
            (async function () {
                let customerId =
                    location.href.queryURLParams().customerId || "";
                await bindList();
                if (customerId || customerId === 0) {
                    await customerInfo(customerId);
                }
                $userName.on("blur", checkUserName);
                $userEmail.on("blur", checkEmail);
                $userPhone.on("blur", checkPhone);
                bindSubmit(customerId);
            })();
        },
    };
})();
customerAddModule.init();
