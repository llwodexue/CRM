let visitModule = (function () {
    let $visitText = $(".visitText"),
        $visitTime = $(".visitTime"),
        $submit = $(".submit"),
        $tbody = $("tbody");
    let dataArr = null; // 存放随机生成的数据
    let time = new Date()
        .toLocaleString()
        .split(" ")[0]
        .formatTime("{0}-{1}-{2}");
    console.log(time);
    $visitTime.val(time);

    let render = (data) => {
        let str = ``;
        data.forEach((item) => {
            let { id, visitTime, visitText } = item;
            str += `<tr data-id='${id}'>
            <td class="w5">${id}</td>
            <td class="w15">${visitTime}</td>
            <td class="w70 wrap">${visitText}</td>
            <td class="w10"><a href="javascript:;">删除</a></td></tr>`;
        });
        $tbody.html(str);
    };
    // 渲染访问列表
    let bindVisitList = (customerId) => {
        return axios
            .get("/visit/list", { params: { customerId } })
            .then((res, rej) => {
                let { code, data } = res;
                dataArr = data;
                if (code != 0) {
                    alert("请求列表失败");
                    return rej();
                }
                render(dataArr);
            });
    };

    // 删除接口
    let deleteItem = (visitId) => {
        axios.get("/visit/delete", { params: { visitId } }).then((res) => {
            let { code } = res;
            if (code === 0) {
                alert("删除成功", {
                    handled: () => {
                        dataArr = dataArr.filter((item) => {
                            return String(item.id) != visitId;
                        });
                        dataArr.forEach((item, index) => {
                            item.id = index;
                        });
                        render(dataArr);
                    },
                });
                return;
            }
            alert("删除失败，请重试");
        });
    };
    // 绑定删除按钮
    let bindDelete = () => {
        $tbody.click((e) => {
            let target = e.target,
                tagName = target.tagName,
                targetVal = target.innerText,
                visitId = $(target).parent().parent().attr("data-id");
            if (tagName === "A" && targetVal === "删除") {
                alert(`您确定要删除编号 ${visitId} 吗`, {
                    title: "当前为风险操作",
                    confirm: true,
                    handled: (msg) => {
                        if (msg === "CANCEL") return;
                        deleteItem(visitId);
                    },
                });
            }
        });
    };
    // 绑定提交按钮
    let bindSubmit = (customerId) => {
        $submit.click(() => {
            if ($visitText.val().trim() == "") {
                alert("请输入内容");
                return;
            }
            axios
                .post("/visit/add", {
                    customerId,
                    visitText: $visitText.val(),
                    visitTime: $visitTime.val().trim(),
                })
                .then((res) => {
                    let { code } = res;
                    if (code == 0) {
                        alert("新增成功", {
                            handled() {
                                dataArr.push({
                                    id: dataArr.length,
                                    visitText: $visitText.val(),
                                    visitTime: $visitTime.val().trim(),
                                });
                                render(dataArr);
                                $visitText.val("");
                            },
                        });
                    } else {
                        alert("新增失败");
                    }
                });
        });
    };

    return {
        init() {
            let customerId = location.href.queryURLParams().customerId || "";
            bindVisitList(customerId).then((res) => {
                bindDelete();
                bindSubmit(customerId);
            });
        },
    };
})();
visitModule.init();
