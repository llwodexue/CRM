let userAddModule = (function () {
    let $userName = $(".username"),
        $spanUserName = $(".spanusername"),
        $woman = $("#woman"),
        $userEmail = $(".useremail"),
        $spanUserEmail = $(".spanuseremail"),
        $userPhone = $(".userphone"),
        $spanUserPhone = $(".spanuserphone"),
        $userDepartment = $(".userdepartment"),
        $userJob = $(".userjob"),
        $userDesc = $(".userdesc"),
        $submit = $(".submit");

    // 渲染下拉框
    let renderSelect = (data) => {
        let str = ``;
        data.forEach((item) => {
            str += `<option value="${item.id}">${item.name}</option>`;
        });
        return str;
    };

    // 从员工列表页点编辑附带信息
    let userInfo = (userId) => {
        return axios.get("/user/info", { params: { userId } }).then((res) => {
            let {
                code,
                data: { name, email, phone, sex, departmentId, jobId, desc },
            } = res;
            if (code == 0) {
                $userName.val(name);
                sex == 0 ? $woman.prop("checked", true) : null;
                $userEmail.val(email);
                $userPhone.val(phone);
                $userDepartment.val(departmentId);
                $userJob.val(jobId);
                $userDesc.val(desc);
            }
        });
    };

    // 渲染部门列表、职务列表下拉框
    let bindList = () => {
        let p1 = axios.get("/department/list");
        let p2 = axios.get("/job/list");
        return axios.all([p1, p2]).then((res) => {
            let [depart, job] = res;
            if (depart.code == 0)
                $userDepartment.html(renderSelect(depart.data));

            if (job.code == 0) $userJob.html(renderSelect(job.data));
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
    let bindSubmit = (userId) => {
        $submit.click(() => {
            if (!(checkUserName() && checkEmail() && checkPhone())) {
                alert("请检查表单信息");
                return;
            }
            let url = userId ? "/user/update" : "/user/add";
            let obj = {
                name: $userName.val().trim(),
                sex: $woman.prop("checked") ? 0 : 1,
                email: $userEmail.val().trim(),
                phone: $userPhone.val().trim(),
                departmentId: $userDepartment.val(),
                jobId: $userJob.val(),
                desc: $userDesc.val() || "什么都没有",
            };
            userId ? (obj.id = userId) : null;
            axios
                .post(url, obj)
                .then((res, rej) => {
                    let { code } = res;
                    if (code == 0) {
                        alert("操作成功，即将返回用户列表页", {
                            handled() {
                                location.href = "userlist.html";
                            },
                        });
                    } else {
                        return rej();
                    }
                })
                .catch(() => {
                    alert("当前操作失败，请重试");
                });
        });
    };

    return {
        init() {
            (async function () {
                let userId = location.href.queryURLParams().userId || "";
                await bindList();
                if (userId || userId === 0) {
                    await userInfo(userId);
                }
                $userName.on("blur", checkUserName);
                $userEmail.on("blur", checkEmail);
                $userPhone.on("blur", checkPhone);
                bindSubmit(userId);
            })();
        },
    };
})();
userAddModule.init();
