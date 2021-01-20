## CRM管理系统

浏览网址：[https://llwodexue.github.io/CRM/login.html](https://llwodexue.github.io/CRM/login.html)

| 账户类型                                   | 账户    | 密码 |
| ------------------------------------------ | ------- | ---- |
| 管理员（所有权限）                         | admin   | 123  |
| 经理（可操作用户、查看全部客户、重置密码） | manager | 123  |
| 职员（重置密码）                           | officer | 123  |


## Mock

- 使用mock拦截接口并随机渲染数据
- 详见：mock/mock.js



## 组织结构

### 员工列表

- 支持单选全选批量删除
- 支持编辑信息、删除
- 支持下拉框筛选及输入框模糊查询（根据姓名/邮箱/手机号）
- 详见：js/userlist.js

### 新增员工

- 支持增加信息（表单校验）
- 详见：js/useradd.js



## 客户管理

### 全部客户

- 支持编辑信息、删除
- 支持下拉框筛选及输入框模糊查询（根据姓名/邮箱/手机号/QQ/微信）
- 支持分页符和输入页码跳转页面
- 支持添加、删除回访记录
- 详见：js/customerlist.js和js/visit.js

### 新增客户

- 支持增加信息（表单校验）
- 详见：js/customeradd.js