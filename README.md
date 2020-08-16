# steam Buff饰品筛选倒余额
比例自定义 已适配[Buff](https://buff.163.com/) [igxe](https://www.igxe.cn/dota2/570?sort=3) c5game--[dota](https://www.c5game.com/dota.html)/[csgo](https://www.c5game.com/csgo/default/result.html?sort=update_time)

__我的帖子/说明/反馈__

[饰品筛选倒余额 (Keylol论坛)](https://keylol.com/t577669-1-1)

面板模块采用 `Vue` 实现数据交互 

筛选机制由 `JQury` 实现 `DOM` 操作 及动态组件加载

结合JS `ES6` 新特性来方便操作 `let` , `const` , `includes` , `new Promise()` , `Array.from().filter(()=>{})` , `async-await`/`then()`避免回调 **等**

手动 **Copy** `Bootstrap4` 相关 `CSS` **微调**兼容各网站页面样式

兼容 `Edge` `Chrome` `Firefox(略丑)`
  * [igxe](https://www.igxe.cn/dota2/570?sort=3)有显示BUg
  * c5game由于页面地址混乱只适配[dota](https://www.c5game.com/dota.html)/[csgo](https://www.c5game.com/csgo/default/result.html?sort=update_time)

__脚本使用__
 * 脚本基于 [油猴](http://www.tampermonkey.net/)

 * **使用前需要安装** [@AFKOUT](https://keylol.com/suid-451341) 老哥的 [饰品比例计算脚本](https://greasyfork.org/zh-CN/scripts/35597-%E9%A5%B0%E5%93%81%E6%AF%94%E4%BE%8B%E8%AE%A1%E7%AE%97%E8%84%9A%E6%9C%AC)
⇦他的[帖子/反馈](https://keylol.com/t331397-1-1)

 * 我的脚本 [饰品筛选倒余额脚本](https://greasyfork.org/zh-CN/scripts/399176-%E9%A5%B0%E5%93%81%E7%AD%9B%E9%80%89%E5%80%92%E4%BD%99%E9%A2%9D-%E6%AF%94%E4%BE%8B%E8%87%AA%E5%AE%9A%E4%B9%89-%E6%94%AF%E6%8C%81buff-c5game-igxe)

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

 * 理想比例  >*当前市场最低出售价比例*

 * 最高比例  >*当前市场最高收购价比例*

 * 理想比例 

        >不符合要求 >*筛选* 不超过最高比例

        > 符合要求  >*筛选* 不超过最高比例 (避免JS抬价造成虚假比例)

__效果__ `鼠标移到面板可以查看详细内容`

 * ![面板](https://blob.keylol.com/forum/202008/12/232150n1kr7z75y7uzt7z1.png)
 * ![面板1](https://blob.keylol.com/forum/202008/12/232200xi4oom9oasnzxm9n.png)
 * ![面板2](https://blob.keylol.com/forum/202008/12/232203m02948stksc20ajw.png)
 * ![Buff中的效果](https://blob.keylol.com/forum/202008/12/231520h44u99bjb9rrijqy.png)
