/* 用户登录验证
params:
    account=xxx&password=xxx*/
(function () {
    function mockData(options) {
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
                power: "userhandle|resetpassword",
            },
            {
                account: "officer",
                password: "32d25170b469b57095ca269b",
                power: "null",
            },
        ];
        let reg = query.match(/[^=&]+/g);
        let res = user.filter((item) => {
            return reg[1] == item.account && reg[3] == item.password;
        });
        if (res.length) {
            return {
                code: 0,
                codeText: "OK",
                power: res[0].power,
            };
        }
        return {
            code: 1,
            codeText: "NO",
        };
    }
    Mock.mock("/user/login", "post", mockData);
})();

/* 用户非法登录
params: null*/
(function () {
    function mockData() {
        if (!(localStorage.account && localStorage.power)) {
            return {
                code: 1,
                codeText: "NO",
            };
        }
        return {
            code: 0,
            codeText: "OK",
        };
    }
    Mock.mock("/user/login", "get", mockData);
})();

/* 用户退出
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    Mock.mock("/user/signout", "get", mockData);
})();

/* 侧边路由
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [
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
        ],
    };
    Mock.mock("/user/router", "get", mockData);
})();

/* 部门列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [
            { id: 1, name: "总裁办", desc: "" },
            { id: 2, name: "销售部", desc: "" },
            { id: 3, name: "产品研发部", desc: "" },
        ],
    };
    Mock.mock("/department/list", "get", mockData);
})();

/* 职务列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        data: [
            { id: 1, name: "管理员", desc: "" },
            { id: 2, name: "销售部经理", desc: "" },
            { id: 3, name: "销售部员工", desc: "" },
            { id: 4, name: "产品研发部经理", desc: "" },
            { id: 5, name: "产品研发部员工", desc: "" },
        ],
    };
    Mock.mock("/job/list", "get", mockData);
})();

/* 用户列表
params: null*/
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
        // 随机生成15-30个数组元素
        "data|5-8": [
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
        ],
    };
    Mock.mock("/user/list", "get", mockData);
})();

/* 重置用户密码
params:
    userId=1
    password=xxx */
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    Mock.mock("/user/resetpassword", "post", mockData);
})();

/* 删除用户
params:
    userId=1 */
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    let url = /^\/user\/delete\?userId=/;
    Mock.mock(url, "get", mockData);
})();

/* 修改用户信息
params:
    userId=1&name=xxx&sex=0&email=xxx&phone=xxx&departmentId=1&jobId=1&desc=xxx */
(function () {
    let mockData = {
        code: 0,
        codeText: "OK",
    };
    Mock.mock("/user/update", "post", mockData);
})();
