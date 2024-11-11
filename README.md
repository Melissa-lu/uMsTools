# uMsTools

宗旨：方便大家不会因为 ms 的 session突然到期，导致正在编写的用例、bug等被迫未保存下中断，功亏一篑，而说出一些美妙的词汇或者转为美妙的精神状态。love & peace

## 安装指南

谷歌浏览器插件的安装方式：下载，然后拖动到扩展程序页面

## 操作指南

一 session 刷新部分

<img width="401" alt="企业微信截图_43e29191-632a-4ca4-ba90-75e2886c849f" src="https://github.com/user-attachments/assets/a560648f-001b-4d6a-8788-79af07ffaa7d">

二 用例步骤一键填写部分

<img width="1042" alt="企业微信截图_45f03d8f-1c61-4be3-ae87-9242e12b952b" src="https://github.com/user-attachments/assets/c57845cc-97ed-449f-ade0-a78a12483659">


#### 提示框展示条件——

* 当每次刷新页面的时候，提示框会出现5秒后自动消失

* 当 metersphere session 或者 SSO 本身要到期 前的1个小时内，提示框会一直出现

#### 操作——

一 session 刷新部分

* 点击提示框内部，可触发刷新 metersphere session 的时间，

* 确认刷新后，可点击关闭按钮关闭弹窗 （ 因到期时间1小时内出现的提示框刷新后也不会自动消失，需要手动关闭 ）

二 用例步骤一键填写部分

* 点击输入框，输入目标文案，

* 点击【通过】按钮，则当前用例 实际结果 值 = 目标文案的步骤，对应的 步骤执行结果 更新为 通过

* 可点击关闭按钮关闭弹窗 

#### 其他

* SSO 到期时间不会被刷新，但是刷新 metersphere session 有时候会延长 SSO 到期时间
  
* 每个页面都是独立的，其他页面也要刷新

* 两个功能互不不影响，session的会出现5秒后自动消失，用例的不会


