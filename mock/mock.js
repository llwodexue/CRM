(function () {
    function success(option) {
        return {
            code: 0,
            codeText: "OK",
            ...option,
        };
    }
    function fail() {
        return {
            code: 1,
            codeText: "NO",
        };
    }

    /* 用户登录验证
    params:
        account=xxx&password=xxx*/
    let login = (options) => {
        let query = options.body;
        let user = [
            {
                account: "admin",
                password: "32d25170b469b57095ca269b",
                power:
                    "userhandle|departhandle|jobhandle|departcustomer|allcustomer|resetpassword",
            },
            {
                account: "manager",
                password: "32d25170b469b57095ca269b",
                power: "userhandle|departhandle|allcustomer|resetpassword",
            },
            {
                account: "officer",
                password: "32d25170b469b57095ca269b",
                power: "resetpassword",
            },
        ];
        let reg = query.match(/[^=&]+/g);
        let res = user.filter((item) => {
            return reg[1] == item.account && reg[3] == item.password;
        });
        if (res.length) {
            return success({ power: res[0].power });
        }
        return fail();
    };
    Mock.mock("/user/login", "post", login);

    /* 用户非法登录
    params: null*/
    let checkLogin = () => {
        if (!(localStorage.account && localStorage.power)) {
            return fail();
        }
        return success();
    };
    Mock.mock("/user/login", "get", checkLogin);

    /* 用户退出
    params: null*/
    let signOut = success();
    Mock.mock("/user/signout", "get", signOut);

    /* 侧边路由
    params: null*/
    let routerArr = [
        {
            title: "员工管理",
            icon: "icon-user",
            children: [
                {
                    subTitle: "员工列表",
                    href: "page/userlist.html",
                    flag: "",
                },
                {
                    subTitle: "新增员工",
                    href: "page/useradd.html",
                    flag: "userhandle",
                },
            ],
        },
        {
            title: "部门管理",
            icon: "icon-department",
            children: [
                {
                    subTitle: "部门列表",
                    href: "page/departmentlist.html",
                    flag: "",
                },
                {
                    subTitle: "新增部门",
                    href: "page/departmentadd.html",
                    flag: "departhandle",
                },
            ],
        },
        {
            title: "职务管理",
            icon: "icon-job",
            children: [
                {
                    subTitle: "职务列表",
                    href: "page/joblist.html",
                    flag: "",
                },
                {
                    subTitle: "新增职务",
                    href: "page/jobadd.html",
                    flag: "jobhandle",
                },
            ],
        },
        {
            title: "客户管理",
            icon: "icon-customer",
            children: [
                {
                    subTitle: "我的客户",
                    href: "page/customerlist.html?lx=my.html",
                    flag: "",
                },
                {
                    subTitle: "全部客户",
                    href: "page/customerlist.html?lx=all.html",
                    flag: "allcustomer",
                },
                {
                    subTitle: "新增客户",
                    href: "page/customeradd.html",
                    flag: "",
                },
            ],
        },
    ];
    let router = success({ data: routerArr });
    Mock.mock("/user/router", "get", router);

    /* 部门列表
    params: null*/
    let departArr = [
        { id: 1, name: "总裁办", desc: "" },
        { id: 2, name: "销售部", desc: "" },
        { id: 3, name: "产品研发部", desc: "" },
    ];
    let departList = success({ data: departArr });
    Mock.mock("/department/list", "get", departList);

    /* 职务列表
    params: null*/
    let jobArr = [
        { id: 1, name: "管理员", desc: "" },
        { id: 2, name: "销售部经理", desc: "" },
        { id: 3, name: "销售部员工", desc: "" },
        { id: 4, name: "产品研发部经理", desc: "" },
        { id: 5, name: "产品研发部员工", desc: "" },
    ];
    let jobList = success({ data: jobArr });
    Mock.mock("/job/list", "get", jobList);

    /* 用户列表
    params: null*/
    let userArr = [
        {
            "id|+1": 0,
            name: "@cname",
            "sex|1": [0, 1],
            phone: /^1[3-9]\d{9}$/,
            email: "@email",
            "department|+1": [
                "总裁办",
                "销售部",
                "销售部",
                "产品研发部",
                "产品研发部",
            ],
            "departmentId|+1": [1, 2, 2, 3, 3],
            "job|+1": [
                "管理员",
                "销售部经理",
                "销售部员工",
                "产品研发部经理",
                "产品研发部员工",
            ],
            "jobId|+1": [1, 2, 3, 4, 5],
            desc: "@cparagraph(1)",
        },
    ];
    // 随机生成19-13个数组元素
    let userList = success({ "data|10-13": userArr });
    Mock.mock("/user/list", "get", userList);

    /* 重置用户密码
    params:
        userId=1
        password=xxx */
    let resetPass = success();
    Mock.mock("/user/resetpassword", "post", resetPass);

    /* 删除用户
    params:
        userId=1 */
    let deleteUser = success();
    let urlDel = /^\/user\/delete\?userId=/;
    Mock.mock(urlDel, "get", deleteUser);

    /* 修改用户信息
    params:
        userId=1&name=xxx&sex=0&email=xxx&phone=xxx&departmentId=1&jobId=1&desc=xxx */
    let updateUser = success();
    Mock.mock("/user/update", "post", updateUser);

    /* 获取用户详细信息
    params:
        userId=1 */
    let userInfo = (options) => {
        // 取到拼接后的url中的userId
        let useId = options.url.queryURLParams().userId || "";
        let data = JSON.parse(localStorage.getItem("user"));
        data = data.find((item) => {
            return item.id == useId;
        });
        return success({ data: data });
    };
    let urlInfo = /^\/user\/info\?userId=/;
    Mock.mock(urlInfo, "get", userInfo);

    /* 修改用户信息
    params:
        userId=1&name=xxx&sex=0&email=xxx&phone=xxx&departmentId=1&jobId=1&desc=xxx */
    let parseObj = (obj) => {
        for (const key in obj) {
            if (key != "phone" && Number(obj[key])) obj[key] = +obj[key];
        }
        return obj;
    };
    let userUpdate = (options) => {
        let obj = options.body.queryURLParams();
        let data = JSON.parse(localStorage.getItem("user"));
        obj = parseObj(obj);
        data.find((item, index) => {
            item.id == obj.id ? (data[index] = { ...item, ...obj }) : null;
        });
        localStorage.setItem("user", JSON.stringify(data));
        return success();
    };
    Mock.mock("/user/update", "post", userUpdate);

    /* 增加用户信息
    params:
        userId=1&name=xxx&sex=0&email=xxx&phone=xxx&departmentId=1&jobId=1&desc=xxx */
    let userAdd = (options) => {
        let obj = options.body.queryURLParams();
        let data = JSON.parse(localStorage.getItem("user"));
        obj.id = data.length;
        obj = parseObj(obj);
        obj.department = departArr[obj.departmentId - 1].name;
        obj.job = jobArr[obj.jobId - 1].name;
        data.push(obj);
        localStorage.setItem("user", JSON.stringify(data));
        return success();
    };
    Mock.mock("/user/add", "post", userAdd);
})();
