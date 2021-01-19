let customerListModule = (function () {
    let $tbody = $("tbody"),
        $selectBox = $(".selectBox"),
        $search = $(".searchInp"),
        $pageBox = $(".pageBox");
    let limit = 15, // 每一页请求数据的条数
        page = 1; // 请求当前的页码
    let dataArr = null; // 存放随机生成的数据

    // 渲染用户列表
    let renderUser = (data) => {
        let str = ``;
        data.forEach((item) => {
            let {
                name,
                id,
                sex,
                email,
                phone,
                weixin,
                QQ,
                type,
                userName,
                address,
            } = item;
            str += `<tr data-id="${id}" data-name="${name}">
            <td class="w8">${name}</td>
            <td class="w5">${parseInt(sex) == 1 ? "女" : "男"}</td>
            <td class="w10">${email}</td>
            <td class="w10">${phone}</td>
            <td class="w10">${weixin}</td>
            <td class="w10">${QQ}</td>
            <td class="w5">${type}</td>
            <td class="w8">${userName}</td>
            <td class="w20">${address}</td>
            <td class="w14">
                <a href="customeradd.html?customerId=${id}">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="visit.html?customerId=${id}">回访记录</a>
            </td></tr>`;
        });
        $tbody.html(str);
    };

    // 下拉框、搜索框、发生点击事件 重新渲染用户列表
    let renderRefresh = () => {
        let type = $selectBox.val(),
            search = $search.val().trim();
        let newData = dataArr;
        // 模糊搜索处理
        if (search !== "") {
            newData = newData.filter((item) => {
                return (
                    item.name.includes(search) ||
                    item.phone.includes(search) ||
                    item.email.includes(search) ||
                    item.QQ.includes(search) ||
                    item.weixin.includes(search)
                );
            });
        }
        // 筛选处理
        if (type !== "") {
            newData = newData.filter((item) => {
                return item.type === type;
            });
        }
        renderPage(newData);
    };

    // 下拉框、搜索框、发生点击事件，重新进行渲染用户
    let change = () => {
        $selectBox.on("change", function () {
            page = 1;
            renderRefresh();
        });
        $search.on("keydown", function (e) {
            if (e.keyCode === 13) {
                page = 1;
                renderRefresh();
            }
        });
        $pageBox.click((e) => {
            let target = e.target,
                tagName = target.tagName,
                targetVal = target.innerText;
            if (tagName == "A") {
                if (targetVal == "上一页") {
                    page--;
                    renderRefresh();
                }
                if (targetVal == "下一页") {
                    page++;
                    renderRefresh();
                }
            }
            if (tagName == "LI") {
                let curPage = parseInt(targetVal);
                page = curPage;
                renderRefresh();
            }
        });
    };

    // 渲染分页，根据页码渲染用户
    let renderPage = (data) => {
        let total = data.length,
            totalPage = Math.ceil(total / limit);
        let arr = [],
            dataResult = [];
        for (let i = 0; i < totalPage; i++) {
            arr.push(i + 1);
        }
        let str = `${page > 1 ? '<a href="javascript:;">上一页</a>' : ""}
					<ul class="pageNum">
						${arr
                            .map((item) => {
                                return `<li class="${
                                    item == page ? "active" : ""
                                }">${item}</li>`;
                            })
                            .join("")}
					</ul>
					${
                        page == totalPage
                            ? ""
                            : '<a href="javascript:;">下一页</a>'
                    }<span class="jumpTo">跳转到<input type="text"></span>`;
        $pageBox.html(str);

        // 绑定跳转函数
        $(".jumpTo")
            .find("input")
            .on("keydown", function (e) {
                if (e.keyCode === 13) {
                    page = $(this).val();
                    if (page < 1 || page > totalPage) {
                        alert("没有更多数据了");
                        return;
                    }
                    renderRefresh();
                }
            });

        if (page <= totalPage) {
            for (let i = (page - 1) * limit; i < page * limit; i++) {
                let item = data[i];
                if (!item) break;
                dataResult.push({
                    id: item.id,
                    name: item.name,
                    sex: item.sex,
                    email: item.email,
                    phone: item.phone,
                    QQ: item.QQ,
                    weixin: item.weixin,
                    type: item.type,
                    address: item.address,
                    userId: item.userId,
                    userName: item.userName,
                });
            }
        }
        renderUser(dataResult);
    };

    let render = () => {
        let lx = location.href.queryURLParams().lx || "my";
        return axios
            .get("/customer/list", { params: { lx } })
            .then((res, rej) => {
                let { code, data } = res;
                if (code == 0) {
                    dataArr = data;
                    renderPage(dataArr);
                    change();
                } else {
                    rej();
                }
            });
    };

    // 删除接口
    let deleteItem = (customerId) => {
        axios.get("/customer/delete", { params: { customerId } }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return String(item.id) != customerId;
                        });
                        renderPage(dataArr);
                    },
                });
                return;
            }
            alert("删除失败，请重试");
        });
    };

    let bindHandle = () => {
        $tbody.click((e) => {
            let target = e.target,
                tagName = target.tagName,
                targetVal = target.innerText.trim(),
                $parent = $(target).parent().parent(),
                customerName = $parent.attr("data-name"),
                customerId = $parent.attr("data-id");
            if (tagName === "A" && targetVal === "删除") {
                alert(`您确定要删除 ${customerName} 吗`, {
                    title: "当前为风险操作",
                    confirm: true,
                    handled: (msg) => {
                        if (msg === "CANCEL") return;
                        deleteItem(customerId);
                    },
                });
            }
        });
    };

    return {
        init() {
            render().then((res) => {
                bindHandle();
            });
        },
    };
})();
customerListModule.init();
