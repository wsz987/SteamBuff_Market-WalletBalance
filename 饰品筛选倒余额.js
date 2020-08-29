// ==UserScript==
// @name         饰品筛选倒余额 比例自定义 支持buff c5game igxe
// @namespace    http://tampermonkey.net/
// @icon      	 https://store.steampowered.com/favicon.ico
// @version      0.23
// @description  饰品筛选倒余额 可视化比例自定义面板 支持buff c5game igxe
// @author       wsz987
// @match        *://buff.163.com/market/?game=*
// @match        *://buff.163.com/market/goods?goods_id=*
// @match        *://www.c5game.com/*
// @match        *://www.igxe.cn/*
// @match        *://www.igxe.cn/product/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/vue/2.4.2/vue.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @supportURL   https://keylol.com/t577669-1-1
// ==/UserScript==

/*A 上一页
S 居中且过滤
D 下一页
W 居中
E 过滤后全部打开*/

(function() {
    'use strict';
    const tool_default = ['300','0.7','0.75','3','2']//自定义默认配置
    web();
    middle()
    try{
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e && e.keyCode==83){
                middle().then(v.filter())
            }
            if(e && e.keyCode==68){
                v.nextpage();
            }
            if(e && e.keyCode==65){
                v.prevpage();
            }
            if(e && e.keyCode==87){
                middle();
            }
            if(e && e.keyCode==69){
                v.filter().then(v.allopen());
            }
        }
    }catch(e){console.log(e)}
    $("body").append(`
<div class="card" id='tools' style='z-index:998;position:fixed;left:10px;top:400px;'>
        <div class="card-header">
			<a href="#" class="badge badge-secondary" title="支持按键指令哦&#10;A 上一页&#10;D 下一页&#10;W 居中&#10;S 过滤&#10;E 过滤后全部打开">鼠标移动到我这</a>
			<a href="https://keylol.com/t577669-1-1" class="badge badge-secondary" target='_blank' title="点击了解脚本&#10;问题反馈&#10;我不介意打赏哈&#10;作者: wsz987">auth</a>
		</div>
		<div class="card-body" style='display:flex;flex-direction:column;'>
            <label title="便于快速出手&#10;避免误差">在售数量&nbsp;<input type='number' v-model.lazy='count' min='0' step='10' max='9999' placeholder='最低'/></label>
            <label title="实质上是避免&#10;出售-收购 比例差距过大&#10;避免JS抬价而造成损失">理想比例&nbsp;<input type='number' v-model.lazy='idea' step='0.01' min='0.6' max='1' placeholder=' 0.6~1'/></label>
            <label title="最终筛选不超过比例">最高比例&nbsp;<input type='number' v-model.lazy='unidea' step='0.01' min='0.6' max='1' placeholder=' 0.61~1'/></label>
            <span title="网速慢者福音&#10;最小值1s&#10;最大值10s&#10;默认延迟3s&#10;作用于饰品页面&#10;避免数据加载不及时&#10;导致筛选失败&#10;建议一次不要打开太多页面">延迟&nbsp;{{timeout}}s&nbsp;后筛选</span><input type="range" v-model="timeout" min="1" max="10" step="0.5"></label>
            <span title="用于一不小心打开太多页面的再校验&#10;注意:这个选项会消耗浏览器性能&#10;最小0次&#10;最大10次&#10;默认2次&#10;每次延迟0.5s">&nbsp;{{fortimeout}}次&nbsp;校验</span><input type="range" v-model="fortimeout" min="0" max="10" step="1"></label>
        </div>
        <div class="card-footer btn-group" style='justify-content:center;padding: 0.5rem;'>
            <button class="btn" @click='prevpage'>&lt;</button>
            <button class="btn" @click='tools_reset'>重置</button>
            <button class="btn" @click='nextpage'>&gt;</button>
        </div>
    </div>
`);
    if(GM_getValue("saved")==null)
        GM_setValue("saved", tool_default)
    console.log(`配置[${GM_getValue('saved')}]`)
    var saved_update = GM_getValue("saved")
    var v=new Vue({
        el: '#tools',
        data:{
            count:GM_getValue("saved")[0],
            idea:GM_getValue("saved")[1],
            unidea:GM_getValue("saved")[2],
            timeout:GM_getValue("saved")[3],
            fortimeout:GM_getValue("saved")[4]
        },
        mounted() {
            if(location.href.includes('buff.163.com/market/goods?goods_id=')||location.href.includes('www.igxe.cn/product')||location.href.includes('c5game.com/dota/')||location.href.includes('c5game.com/csgo/item')){
                console.log(`执行比例: ${GM_getValue('saved')[1]} ${GM_getValue('saved')[2]}`)
                console.log(`${this.timeout}s后开始筛选 ${this.fortimeout}次校验`)
                setTimeout(()=>{
                    console.log(`是否进入校验${this.choice()}`)
                    if(this.choice()){
                        console.log(`启动校验`)
                        for (let i = 0; i < this.fortimeout; i++) {
                            (i=> {
                                setTimeout(()=>{
                                    console.log(`第 ${i+1}次校验`)
                                    this.choice()
                                }, 500 * i);
                            })(i);
                        }
                    }
                },this.timeout*1000);
            }
        },
        methods:{
            prevpage(){
                try{
                    $(".page-link.prev")[0].click();
                }catch(e){
                    try{
                        console.log(e)
                        $(".previous")[0].childNodes[0].click();
                    }catch(e){console.log(e)
                              $(".prev.js-page")[0].click();}
                }
            },
            nextpage(){
                try{
                    $(".page-link.next")[0].click()
                    try{
                        setTimeout(this.filter,2000);
                    }catch(e){console.log(e)}
                }catch(e){
                    try{
                        console.log(e)
                        $(".next")[0].childNodes[0].click();
                    }catch(e){
                        console.log(e)
                        $(".next.js-page")[0].click();
                    }
                }
            },
            tools_reset(){
                console.log('数据重置')
                GM_setValue("saved", null)
                window.location.reload()
            },
            choice(){
                if($('.lsr') && $('.hbr')){
                    const lsr=Number($('.lsr').text()),
                          hbr=Number($('.hbr').text()),
                          Value_1=Number(this.idea),
                          Value_2=Number(this.unidea)
                    if(lsr=='' || hbr=='') return true
                    if(lsr>1 || hbr>1) window.close()
                    if(lsr > Value_1){
                        console.log('1')
                        if(hbr > Value_2) window.close()
                        return false
                    }else{
                        console.log('2')
                        if(hbr > Value_2) window.close()
                        return false
                    }
                    return true
                }
                return true
            },
            filter(){
                return new Promise(resolve => {
                    let n=0
                    Array.from($(website[1])).filter(x=>{
                        if(eval(x.innerHTML.replace(/[^0-9]/g, ''))>parseInt(this.count))
                            return
                        ++n;
                        x.parentNode.parentNode.remove();
                    })
                    if(eval(n)==eval(website[3])){
                        this.nextpage();
                    }
                });
            },
            allopen(){
                let i=0,l=$(website[2])
                for(i;i<l.length;i++){
                    GM_openInTab(l[i].parentNode.href);//依旧停留筛选页面
                }
            }
        },
        watch:{
            count(val){
                if(val==''){alert('不建议为空');return;}
                saved_update[0]=val
                GM_setValue("saved",saved_update)
                console.log(`数量修改为${GM_getValue("saved")[0]}`)
            },
            idea(val){
                if(val==''||eval(val)<0.6){alert('不能<0.6');return;}
                saved_update[1]=val
                GM_setValue("saved",saved_update)
                console.log(`理想比例修改为${GM_getValue("saved")[1]}`)
            },
            unidea(val){
                if(val==''||eval(val)<0.6){alert('不能<0.6');return;}
                saved_update[2]=val
                GM_setValue("saved",saved_update)
                console.log(`最高比例修改为${GM_getValue("saved")[2]}`)
            },
            timeout(val){
                saved_update[3]=val
                GM_setValue("saved",saved_update)
                console.log(`延迟筛选修改为${GM_getValue("saved")[3]}s`)
            },
            fortimeout(val){
                saved_update[4]=val
                GM_setValue("saved",saved_update)
                console.log(`校验筛选修改为${GM_getValue("saved")[4]}次--${GM_getValue("saved")[4]*0.5}s`)
            }
        }
    })
    })();

function web(){
    switch(location.host){
        case "buff.163.com":
            window.website = ['.market-card','.f_Bold.c_Gray','.lazy','20']
            break;
        case "www.igxe.cn":
            window.website = ['.dataList','.sum','.label','20']
            break;
        case "www.c5game.com":
            window.website = ['.list-item4','.num','.market-state','28']
            break;
    }
}

function middle(){  //居中
    return new Promise(resolve => {
        try{
            if(!location.href.includes('buff.163.com/market/goods?goods_id=')||!location.href.includes('product')||!location.href.includes('www.c5game.com/dota/')){
                if($(website[0]).width()>$(window).height()){
                    $(this).scrollTop($(website[0]).offset().top)
                }else{
                    $(this).scrollTop($(website[0]).offset().top+($(window).height()-$(website[0]).width())/2);
                }

            }
        }catch(e){console.log(e)}
    });
}

GM_addStyle(`
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.card-body {
  flex: 1 1 auto;
  text-align: center;
  padding: 0.5rem 1rem 0rem;
}
.card-footer {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.btn-group{
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
}
.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}
.badge-secondary {
  color: #fff !important;
  background-color: #6c757d;
}
label {
    color:rgb(0, 0, 0);
    display: inline-block;
    margin-bottom: 0.5rem;
}
input {
    padding: 1px 0px;
    border-width: 2px;
    border-style: inset;
    border-color: initial;
    border-image: initial;
    font: 400 13.3333px Arial;
    margin: 0;
    font-family: inherit;
    overflow: visible;
    font-size: inherit;
    line-height: inherit;
    overflow: visible;
}
a{
   text-decoration: none;
}
`)
