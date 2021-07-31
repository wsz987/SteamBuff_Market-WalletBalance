# steam Buff饰品筛选倒余额
比例自定义 已适配[Buff](https://buff.163.com/) [igxe](https://www.igxe.cn/dota2/570?sort=3) c5game--[dota](https://www.c5game.com/dota.html)/[csgo](https://www.c5game.com/csgo/default/result.html?sort=update_time)

__我的帖子/说明/反馈/学习记录__

--[饰品筛选倒余额 (Keylol论坛)](https://keylol.com/t577669-1-1) 

接收键盘指令`Keyboard` 自动筛选
__更新说明__
 * 代码重构
 * 修复c5脚本失效问题
 * 移除延迟筛选及校验次数模块，新的检测方式自动执行比例筛选
 * 新增steam社区连通性检测
 * 现支持多种筛选规则
 * 多页面下面板数据同步功能
 * 面板可拖动

__脚本使用__
 * 脚本基于 [Tampermonkey 油猴](http://www.tampermonkey.net/)

 * **使用前需要安装** [@AFKOUT](https://keylol.com/suid-451341) 老哥的 [饰品比例计算脚本](https://greasyfork.org/zh-CN/scripts/35597)
⇦他的[帖子/反馈](https://keylol.com/t331397-1-1)

 * 我的脚本 [[buff/c5game/igxe]饰品比例筛选脚本](https://greasyfork.org/zh-CN/scripts/399176)

__支持键盘指令__`Keyboard`

`A 上一页`

`S 居中且过滤`

`D 下一页`

`W 居中`

`E 过滤后全部打开`  **需要浏览器弹窗权限**

__疑惑解答__

>为什么网页打开几秒后总是自动关闭
 * 因为筛选的饰品余额比例过高

>为什么按E/D会无限下一页
 * 因为我设置了定时呀!页面没有不符合条件的饰品就下一页,直到找到嘿嘿!不然会累计到1000个被筛选触发浏览器机制停止

>为什么一次性打开多个页面后不符合条件的饰品不会自动关闭 
 * 你的网速过慢导致比例脚本数据加载过慢 筛选脚本验证超时 请给脚本设置适合自己网络的验证参数 `延迟筛选时间&校验`

>为什么按E后只能打开一个网页
 * 请给网页设置弹窗权限(浏览器安全问题)  第一次使用 `E` 浏览器会提示
 * 选择第一个允许
![选择允许](https://blob.keylol.com/forum/202005/31/213133u0i9666ff76g9ddg.png)

__筛选机制__

 * 最低在售数量  >*避免冷门饰品*

 * 全都要  >*当求购比例 和 出售比例 均符合要求*

 * 仅求购  >*求购比例低于设定值*

 * 仅出售  >*出售比例低于设定值*

__效果__ `鼠标移到面板可以查看详细内容`

 * ![面板](https://blob.keylol.com/forum/202107/31/160607mgee8sa2828gwgtm.png)
 * ![Buff中的效果](https://blob.keylol.com/forum/202107/31/160317nt5h5otvvztxz1st.jpg)
 * ![Buff中的效果](https://blob.keylol.com/forum/202107/31/160319qcsrznugvbhsc4vv.jpg)
 * ![Buff中的效果](https://blob.keylol.com/forum/202107/31/160320royssjzoggjj5ov2.jpg)
