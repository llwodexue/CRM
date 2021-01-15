let userListModule = (function () {
    let $deleteAll = $(".deleteAll"),
        $selectBox = $(".selectBox"),
        $searchInp = $(".searchInp"),
        $tbody = $("tbody"),
        $thead = $("thead"),
        $th = $thead.find("th");
    let power = decodeURIComponent(localStorage.getItem("power"));
    // 校验权限
    let checkPower = () => {
        if (!power.includes("userhandle")) {
            $deleteAll.remove();
            $th.first().remove();
            $th.last().remove();
        }
    };

    // 渲染下拉框
    let bindSelect = () => {
        return axios.get("/department/list", "get").then((res) => {
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
    // 存放随机生成的数据
    let dataArr = null;
    let renderStr = (data) => {
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
        return str;
    };
    // 渲染用户列表
    let renderUser = () => {
        return axios.get("/user/list").then((res) => {
            let { code, data } = res;
            if (code == 0) {
                dataArr = data;
                let str = renderStr(data);
                $tbody.html(str);
            } else {
                $tbody.html("");
            }
        });
    };
    // 重新渲染用户列表
    let renderRefresh = () => {
        let depart = $selectBox.val();
        let search = $searchInp.val().trim();
        // 每次下拉框和搜索框发生改变时都重新赋值
        let newData = dataArr;
        let str = ``;
        if (depart !== "0") {
            newData = newData.filter((item) => {
                let { departmentId } = item;
                return depart == departmentId;
            });
            str = renderStr(newData);
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
            str = renderStr(newData);
        }
        if (depart === "0" && search === "") {
            str = renderStr(dataArr);
        }
        $tbody.html(str);
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
        axios.post("/user/delete", { userId }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return String(item.id) != userId;
                        });
                        $tbody.html(renderStr(dataArr));
                    },
                });
                return;
            }
            alert("删除失败");
        });
    };
    // 批量删除接口
    let deleteItems = ($checked) => {
        let userId = [];
        $checked.each((index, item) => {
            userId.push($(item).parent().parent().attr("data-id"));
        });
        // userId ["1", "2", "3"]
        axios.post("/user/delete", { userId }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("批量删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return !userId.includes(String(item.id));
                        });
                        $tbody.html(renderStr(dataArr));
                    },
                });
                return;
            }
            alert("批量删除失败");
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

    // 渲染选框（全选/单选）
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
            checkPower();
            bindSelect().then(() => {
                renderUser().then(() => {
                    selectChange();
                    searchChange();
                    bindHandle();
                    checkBox();
                    bindDelete();
                });
            });
        },
    };
})();
userListModule.init();