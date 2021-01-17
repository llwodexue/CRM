// 存放随机生成的数据

let userListModule = (function () {
    let $deleteAll = $(".deleteAll"),
        $selectBox = $(".selectBox"),
        $searchInp = $(".searchInp"),
        $tbody = $("tbody"),
        $thead = $("thead"),
        $th = $thead.find("th");
    let power = decodeURIComponent(localStorage.getItem("power"));
    // 存放随机生成的数据
    let dataArr = null;
    // 校验权限
    let checkPower = () => {
        // 登录
        return axios.get("/user/login").then((res, rej) => {
            let { code } = res;
            if (code !== 0) {
                return rej();
            }
            if (!power.includes("userhandle")) {
                $deleteAll.remove(); // 移除批量删除按钮
                $th.first().remove(); // 移除复选框
                $th.last().remove(); // 移除操作按钮
            }
        });
    };

    // 渲染下拉框
    let bindSelect = () => {
        return axios.get("/department/list").then((res) => {
            let { data, code } = res;
            if (code == 0) {
                let str = `<option value="0">全部</option>`;
                data.forEach((item) => {
                    let { id, name } = item;
                    str += `<option value="${id}">${name}</option>`;
                });
                $selectBox.html(str);
            }
        });
    };

    let render = (data) => {
        let str = ``;
        data.forEach((item) => {
            let { id, name, sex, department, job, email, phone, desc } = item;
            str += `<tr data-id='${id}' data-name='${name}'>
            ${
                power.includes("userhandle")
                    ? `<td class="w3"><input type="checkbox"></td>`
                    : ""
            }
            <td class="w10">${name}</td>
            <td class="w5">${sex == 0 ? "女" : "男"}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12">
                ${
                    power.includes("userhandle")
                        ? `<a href="useradd.html?userId=${id}">编辑</a><a href="javascript:;">删除</a>`
                        : ""
                }
                ${
                    power.includes("resetpassword")
                        ? `<a href="javascript:;">重置密码</a>`
                        : ""
                }
            </td>
        </tr>`;
        });
        $tbody.html(str);
        // 每次重新渲染内容都会发生改变（input在内容区），需要重新对复选框进行绑定
        checkBox();
    };
    // 渲染用户列表
    let renderUser = () => {
        return axios.get("/user/list").then((res) => {
            let { code, data } = res;
            if (code == 0) {
                // 查看localStorage是否有user
                let user = localStorage.getItem("user");
                if (user) {
                    dataArr = JSON.parse(user);
                } else {
                    // 存放随机生成的数据
                    dataArr = data;
                    localStorage.setItem("user", JSON.stringify(dataArr));
                }
                render(dataArr);
            } else {
                $tbody.html("");
            }
        });
    };
    // 模糊搜索 重新渲染用户列表
    let renderRefresh = () => {
        let depart = $selectBox.val();
        let search = $searchInp.val().trim();
        // 每次下拉框和搜索框发生改变时都重新赋值
        let newData = dataArr;
        if (depart !== "0") {
            newData = newData.filter((item) => {
                let { departmentId } = item;
                return depart == departmentId;
            });
        }
        if (search !== "") {
            newData = newData.filter((item) => {
                let { phone, email, name } = item;
                return (
                    phone.includes(search) ||
                    email.includes(search) ||
                    name.includes(search)
                );
            });
        }
        render(newData);
    };
    // 下拉框发生更改
    let selectChange = () => {
        $selectBox.on("change", function () {
            renderRefresh();
        });
    };
    // 搜索框内容改变
    let searchChange = () => {
        $searchInp.on("keydown", function (e) {
            if (e.keyCode == 13) {
                renderRefresh();
            }
        });
    };
    // 重置密码接口
    let resetPass = (userId) => {
        axios.post("/user/resetpassword", { userId }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("重置密码成功");
                return;
            }
            alert("重置密码失败");
        });
    };
    // 删除接口
    let deleteItem = (userId) => {
        // userId "1"
        axios.get("/user/delete", { params: { userId } }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return String(item.id) != userId;
                        });
                        localStorage.setItem("user", JSON.stringify(dataArr));
                        render(dataArr);
                    },
                });
                return;
            }
            alert("删除失败，请重试");
        });
    };
    // 批量删除接口
    let deleteItems = ($checked) => {
        let paramUser = [];
        $checked.each((index, item) => {
            paramUser.push($(item).parent().parent().attr("data-id"));
        });
        // paramUser ["1", "2", "3"]
        let userId = paramUser.join();
        axios.get("/user/delete", { params: { userId } }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("批量删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return !paramUser.includes(String(item.id));
                        });
                        localStorage.setItem("user", JSON.stringify(dataArr));
                        render(dataArr);
                    },
                });
                return;
            }
            alert("批量删除失败，请重试");
        });
    };

    // 利用事件委托给操作进行事件绑定
    let bindHandle = () => {
        $tbody.click((e) => {
            let target = e.target,
                tagName = target.tagName,
                targetVal = target.innerText.trim(),
                $parent = $(target).parent().parent(),
                userName = $parent.attr("data-name"),
                userId = $parent.attr("data-id");
            if (tagName === "A" && targetVal === "重置密码") {
                alert(`您确定要把 ${userName} 的密码重置吗`, {
                    title: "当前为风险操作",
                    confirm: true,
                    handled: (msg) => {
                        if (msg === "CANCEL") return;
                        resetPass(userId);
                    },
                });
            }
            if (tagName === "A" && targetVal === "删除") {
                alert(`您确定要删除 ${userName} 吗`, {
                    title: "当前为风险操作",
                    confirm: true,
                    handled: (msg) => {
                        if (msg === "CANCEL") return;
                        deleteItem(userId);
                    },
                });
            }
        });
    };

    // 渲染复选框（全选/单选）
    let checkBox = () => {
        let allCheck = $th.find("input");
        let everyCheck = $tbody.find("input");
        // thead点击事件
        allCheck.click(function () {
            let flag = $(this).prop("checked");
            everyCheck.prop("checked", flag);
        });
        // tbody点击事件
        everyCheck.click(function () {
            let flag = true;
            // 循环查看每一行复选框的状态
            $(this).prop("checked", $(this).prop("checked"));
            everyCheck.each((index, item) => {
                if (!$(item).prop("checked")) {
                    return (flag = false);
                }
            });
            allCheck.prop("checked", flag);
        });
    };

    // 批量删除
    let bindDelete = () => {
        $deleteAll.click(() => {
            let $isChecked = $tbody.find("input").filter((index, item) => {
                return $(item).prop("checked");
            });
            if ($isChecked.length == 0) {
                alert("请先选中您要删除的数据");
                return;
            }
            alert(`您确定要删除当前 ${$isChecked.length} 条数据吗？`, {
                title: "当前为风险操作",
                confirm: true,
                handled: (msg) => {
                    if (msg === "CANCEL") return;
                    deleteItems($isChecked);
                },
            });
        });
    };

    return {
        init() {
            (async function () {
                await checkPower();
                await bindSelect();
                await renderUser();
                selectChange();
                searchChange();
                bindHandle();
                checkBox();
                bindDelete();
            })();
        },
    };
})();
userListModule.init();
