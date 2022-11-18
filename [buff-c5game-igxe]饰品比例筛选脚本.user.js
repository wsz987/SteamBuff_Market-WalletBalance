// ==UserScript==
// @name         [buff/c5game/igxe]饰品比例筛选脚本
// @namespace    http://tampermonkey.net/
// @icon      	 https://store.steampowered.com/favicon.ico
// @version      1.3
// @description  支持[buff/c5game/igxe]饰品比例筛选,支持多种筛选规则
// @author       wsz987
// @match        *://buff.163.com/market/*
// @match        *://buff.163.com/goods/*
// @match        *://www.c5game.com/*
// @match        *://www.igxe.cn/*
// @match        *://www.igxe.cn/product/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @supportURL   https://keylol.com/t577669-1-1
// ==/UserScript==

(function() {
    initWebConfig()
    const INIT={
        RULES:[
            {
                name:'全都要',
                key:'by_hbr_lsr',
                desc:'出售及求购都符合条件',
                func({ lsr, hbr },{ MIX_NUMBER, MAX_NUMBER }){
                    let sell_num = getVal(MIX_NUMBER),
                        wbuy_num = getVal(MAX_NUMBER)
                    if(lsr>1 || hbr>1) window.close()
                    lsr>sell_num && window.close()
                    hbr>wbuy_num && window.close()
                }
            },
            {
                name:'仅出售',
                key:'by_lsr',
                desc:'仅依据出售比例&#10;即低于理想比例',
                func({ lsr },{ MIX_NUMBER }){
                    lsr>1 && window.close()
                    lsr>getVal(MIX_NUMBER) && window.close()
                }
            },
            {
                name:'仅求购',
                key:'by_hbr',
                desc:'仅依据求购比例&#10;即低于最高比例',
                func({ hbr },{ MAX_NUMBER }){
                    hbr>1 && window.close()
                    hbr>getVal(MAX_NUMBER) && window.close()
                }
            }
        ],
        Header_DOM:{
            KET_COMMAND:{
                id:'KET_COMMAND',
                tips:'支持按键指令哦&#10;A 上一页&#10;D 下一页&#10;W 居中&#10;S 过滤&#10;E 过滤后全部打开',
                name:'快捷指令提示',
                template(){
                    return `<label title="${this.tips}">
                                <button style="padding: 0.2rem 0.3rem;">${this.name}
                                </button>
                            </label>`
                }
            },
            AUTH:{
                id:'AUTH',
                tips:'作者: wsz987&#10;此脚本于Keylol论坛免费发布且仅供学习参考&#10;点击了解脚本&#10;问题反馈&#10;打赏&#10;',
                name:'auth',
                func(){
                    GM_openInTab("https://keylol.com/t577669-1-1")
                    GM_notification(
                        {
                            text :'如果有用请帮忙加点体力(点这里)\r\n不介意打赏(￣y▽,￣)╭\r\n提交BUG请附上console输出',
                            title :'饰品自动筛选脚本',
                            highlight: true,
                            timeout: 5000
                        },
                        function(){ GM_openInTab("https://keylol.com/t577669-1-1", { active: true }); }
                    )
                },
                template(){
                    return `<label title="${this.tips}" style="float: right !important;margin-left:5px;">
                                <span>作</span>
                                <button id="${this.id}" style="padding: 0.2rem 0.3rem;" id="${this.id}">者
                                </button>
                            </label>`
                }
            },
            CONNECT_STATUS:{
                id:'CONNECT_STATUS',
                tips:'社区连接状态检索',
                name:'社区访问',
                func(){
                    tryCatch(()=>{
                        let connectBtn =  $('.connect-status-btn')
                        connectBtn && GM_xmlhttpRequest({
                            url: "https://steamcommunity.com/market/",
                            timeout: 15000,
                            method: "get",
                            onloadstart: function (event) {
                                //readyState: 1
                                //status: 0
                                console.log("onloadstart", event);
                                event.readyState==1 && connectBtn.html('<span style="color:#fff;">响应中…</span>')
                            },
                            onload: function (res) {
                                //status: 200
                                //statusText: "OK"
                                //readyState: 4
                                console.log("onload", res);
                                res && res.status == 200 && res.readyState && connectBtn.text('访问正常')
                            },
                            onerror: function (err) {
                                //readyState: 4
                                //status: 0
                                connectBtn.text('网络错误')
                                console.log("检测steam连接性出错：连接错误", err);
                            },
                            ontimeout: function (res) {
                                connectBtn.text('请求超时')
                                console.log("检测steam连接性出错：请求超时",res);
                            }
                        })
                    })
                },
                template(){
                    return `<label title="${this.tips}" class='connect-status'>${this.name}&nbsp;
                                <button id="${this.id}" style="padding: 0.2rem 0.3rem;" class="connect-status-btn"><span style="color:#fffffe;">连接检测</span>
                                </button>
                            </label>`
                }
            }
        },
        DOM:{
            RULES_TYPE:{
                name:'筛选规则',
                tips:'筛选规则选择',
                defaultVal:1,
                key:'RULES_TYPE',
                foreignKey:'RULES',
                template(){
                    return `
                    <label title="${this.tips}">${this.name}&nbsp;
                        <select data-key='${this.key}'>
                           ${this.foreignKey.map((rule,index)=>`<option value="${index}" ${this.defaultVal==index ? 'selected':''}>${rule.name}</option>`)}
                        </select>
                    </label>
                    `
                }
            },
            ON_SALE_COUNT:{
                name:'在售数量',
                tips:'较大的基数便于快速出手&#10;避免误差',
                defaultVal:300,
                key:'ON_SALE_COUNT',
                template(){
                    return `<label title="${this.tips}">${this.name}&nbsp;<input type='number' min='0' step='10' max='9999' placeholder='最低在售' value='${this.defaultVal}' data-key='${this.key}'/></label>`
                }
            },
            MIX_NUMBER:{
                name:'出售比例',
                tips:'实质上是避免&#10;出售-收购 比例差距过大&#10;避免JS抬价而造成损失',
                defaultVal:0.7,
                key:'MIX_NUMBER',
                template(){
                    return `<label title="${this.tips}">${this.name}&nbsp;<input type='number' step='0.01' min='0.6' max='1' placeholder=' 0.6~1' value='${this.defaultVal}' data-key='${this.key}'/></label>`
                }
            },
            MAX_NUMBER:{
                name:'求购比例',
                tips:'最终筛选不超过比例',
                defaultVal:0.75,
                key:'MAX_NUMBER',
                template(){
                    return `<label title="${this.tips}">${this.name}&nbsp;<input type='number' step='0.01' min='0.6' max='1' placeholder=' 0.61~1' value='${this.defaultVal}' data-key='${this.key}'/></label>`
                }
            }
        },
        Footer_DOM:{
            PREV_PAGE:{
                id:'PREV_PAGE',
                func(){
                    tryCatch(()=>$(webConfig.preBtn)[0].click())
                },
                template(){
                    return `<button id="${this.id}">&lt;</button>`
                }
            },
            RESET_BUTTON:{
                id:'RESET_BUTTON',
                func(){
                    GM_listValues().map( name => GM_deleteValue(name) )
                    $('.card-body').children().remove()
                    $('.card-body').html(INIT.render('DOM'))
                    alert('重置成功')
                },
                template(){
                    return `<button id="${this.id}">重置</button>`
                }
            },
            SYNC_DATA:{
                id:'SYNC_DATA',
                tips:'同步最新数据&#10;避免页面众多导致混乱',
                func(){
                    tryCatch(()=>{
                        $('.card-body').children().remove()
                        $('.card-body').html(INIT.render('DOM'))
                    })
                },
                template(){
                    return `<label title="${this.tips}" class="syncData-btn">
                                <button id="${this.id}" style="padding: 0.2rem 0.3rem;">
                                    <svg t="1627656092949" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1182" width="16" height="16"><path d="M1017.576727 326.493091l-87.226182 151.272727c0.256 3.677091 0.558545 7.284364 0.558546 10.961455h-6.842182a46.545455 46.545455 0 0 1-28.392727 21.736727h-0.395637a46.289455 46.289455 0 0 1-8.424727 1.419636h-2.327273a29.137455 29.137455 0 0 1-11.264-1.210181c-1.466182-0.325818-2.955636-0.512-4.398545-1.000728a46.685091 46.685091 0 0 1-8.634182-3.886545l-161.908363-93.626182a46.801455 46.801455 0 0 1 46.731636-81.082182l70.842182 40.96A325.352727 325.352727 0 0 0 217.949091 349.090909H209.454545a46.545455 46.545455 0 1 1-78.08-34.048 417.861818 417.861818 0 0 1 771.048728 23.994182l34.210909-59.345455a46.754909 46.754909 0 1 1 80.942545 46.801455z m-124.951272 382.464a417.838545 417.838545 0 0 1-771.048728-23.994182l-34.210909 59.345455A46.778182 46.778182 0 1 1 6.4 697.483636l87.249455-151.272727C93.393455 542.557091 93.090909 538.949818 93.090909 535.272727h6.842182a46.545455 46.545455 0 0 1 28.369454-21.736727h0.395637A47.104 47.104 0 0 1 137.146182 512h2.327273a29.137455 29.137455 0 0 1 11.264 1.210182c1.466182 0.325818 2.955636 0.512 4.398545 1.000727a46.685091 46.685091 0 0 1 8.634182 3.886546l161.908363 93.626181a46.801455 46.801455 0 0 1-46.731636 81.082182l-70.842182-40.96A325.352727 325.352727 0 0 0 806.050909 674.909091H814.545455a46.545455 46.545455 0 1 1 78.08 34.048z" p-id="1183" fill="#fffffe"></path></svg>
                                </button>
                            </label>`
                }
            },
            NEXT_PAGE:{
                id:'NEXT_PAGE',
                func(){
                    tryCatch(()=>$(webConfig.nextBtn)[0].click())
                },
                template(){
                    return `<button id="${this.id}">&gt;</button>`
                }
            },
        },
        render(TYPE){
            let Template=''
            Object.values(this[TYPE]).map(item=>{
                if(TYPE==='DOM')
                    Template+=item.template.call({...item,defaultVal: getVal(item),foreignKey :this[item.foreignKey] })
                else {
                    Template+=item.template()
                    item.func && $(document).on('click', `#${item.id}`, ()=> {
                        item.func()
                    });
                }
            })
            return Template
        }
    }
    // 数据绑定
    $(document).on('input', '#tool-card > .card-body input,#tool-card > .card-body select', ({target:{dataset:{ key },value}})=> {
        if(!value.toString()) return alert(`数据错误: "${key}" -- ${value}`)
        setVal(key,value)
        let actionDOM=document.querySelector(`.card-body span#${key}`)
        actionDOM && tryCatch(()=>actionDOM.innerText=getVal({key}))
    });
    // DOM 挂载
    $("body").append(`
    <div id='tool-card'>
       <div class="card-header">
          ${INIT.render('Header_DOM')}
       </div>
       <div class="card-body">
          ${INIT.render('DOM')}
       </div>
       <div class="card-footer">
          ${INIT.render('Footer_DOM')}
       </div>
    </div>
    `)
    onkeydownListener(INIT)
    ondetailMountdedListener( data => execRules(INIT,data))
    dargCard()
})();

function dargCard(){
    tryCatch(()=>{
        $("#tool-card").mousedown(function() {
            $("#tool-card").on({ // 要移动拖拽的目标DOM
                mousedown: function(e){
                    var el = $(this);
                    var os = el.offset();
                    var dx = e.pageX - os.left
                    var dy = e.pageY - os.top;
                    $(document).on('mousemove.drag', function(e){
                        el.offset({
                            top: e.pageY-dy,
                            left: e.pageX-dx
                        });
                    });
                },
                mouseup: function(e){
                    $(document).off('mousemove.drag');
                }})
        })
    })
}

function ondetailMountdedListener(callBack){
    let detail = {}
    $(document).on("DOMNodeInserted",".detail-summ,.afkout .price", (e)=>{
        let { innerText: value, className} = e.target
        //value.includes('Steam302') && alert(value)
        detail[className]= value - ''
        detail && detail.lsr && detail.hbr && callBack && callBack(detail)
    })
}

function execRules({ DOM, RULES },data){
    RULES[getVal(DOM.RULES_TYPE)].func(data,DOM)
}

function onkeydownListener({Footer_DOM:Event,DOM}){
    tryCatch(()=>{
        document.onkeydown=function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            // S
            if(e && e.keyCode==83){
                middle()
                filter(DOM,Event)
            }
            // D
            if(e && e.keyCode==68){
                Event.NEXT_PAGE.func()
            }
            // A
            if(e && e.keyCode==65){
                Event.PREV_PAGE.func()
            }
            // W
            if(e && e.keyCode==87){
                middle();
            }
            // E
            if(e && e.keyCode==69){
                filter(DOM,Event)
                openALLInTab()
            }
        }
    })
}

function middle(){
    tryCatch(()=>{
        const { goodsContainer } =webConfig
        const Rules =['buff.163.com/market/','igxe.cn/market/','c5game.com/']
        if(Rules.some(rule=>location.href.includes(rule))){
            //if(!location.href.includes('buff.163.com/market/')||!location.href.includes('product')||!location.href.includes('www.c5game.com/dota/')){
            if($(goodsContainer).width()>$(window).height()){
                $(this).scrollTop($(goodsContainer).offset().top)
            }else{
                $(this).scrollTop($(goodsContainer).offset().top+($(window).height()-$(goodsContainer).width())/2);
            }
        }
    })
}

function initWebConfig(){
    let config={}
    switch(location.host){
        case "buff.163.com":
            config={
                goodsContainer:'.market-card',
                onSaleCount:'.f_Bold.c_Gray',
                goodsItemHref:"ul[class^='card_']>li:not(.script_no)>a",
                goodsCount:20,
                preBtn:'.page-link.prev',
                nextBtn:'.page-link.next',
                currentGoodsNode:(el)=>el.parentNode.parentNode
            }
            break;
        case "www.igxe.cn":
            config={
                goodsContainer:'.list',
                onSaleCount:'.info .stock',
                goodsItemHref:'.list a.item:not(.script_no)',
                goodsCount:20,
                preBtn:'.btn-prev',
                nextBtn:'.btn-next',
                currentGoodsNode:(el)=>el.parentNode.parentNode
            }
            break;
        case "www.c5game.com":
            config={
                goodsContainer:'#market_index .list',
                onSaleCount:'.count',
                goodsItemHref:'.list .el-col:not(.script_no) a.mb20',
                goodsCount:42,
                preBtn:'.btn-prev',
                nextBtn:'.btn-next',
                currentGoodsNode:(el)=>el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
            }
            c5game_goodsDetailPageFix()
            c5game_listenListDataLoad()
            break;
    }
    if(JSON.stringify(config) == "{}") console.error('script config init error')
    else window.webConfig = config
}

function openALLInTab(){
    for(let i of $(webConfig.goodsItemHref)){
        i?.href && GM_openInTab(i?.href)
    }
}

function filter({ON_SALE_COUNT},Event){
    let { onSaleCount, goodsCount,currentGoodsNode }=webConfig
    let n=0
    Array.from($(onSaleCount)).filter(x=>{
        if(eval(x.innerHTML.replace(/[^0-9]/g, ''))>=parseInt(getVal(ON_SALE_COUNT)))
            return
        ++n;
        currentGoodsNode(x).className += ' script_no'
    })
    if(n==goodsCount){
        Event.NEXT_PAGE.func()
    }
}

function c5game_listenListDataLoad(){
    tryCatch(()=>{
        const mutation = new MutationObserver(function(mutationRecoards, observer) {
            if(mutationRecoards[0]?.oldValue=="list el-loading-parent--relative"){
                console.log('c5game list data loaded');
                $('.script_no').removeClass('script_no')
            }
        })
        mutation.observe(document.querySelector("#market_index > ul.list"), {
            attributes: true,
            characterDataOldValue :true,
            attributeFilter: ['class'],
            attributeOldValue: true
        });
    })
}

function c5game_goodsDetailPageFix(){
    tryCatch(()=>{
        let href = document.querySelector("div.bottom-info > a")?.attributes?.href?.value
        $("body").append(`<div class ='steamUrl scriptFix' style="display:none;"><a href='${href}'></a></div>`)
        $("body").append("<div class='hero-fix  scriptFix'><div class ='hero'></div></div>")
        $("body").append(`<tbody class='scriptFix' style="display:none;"><td class='ft-orange'><span></span></td></tbody>`)
        $(document).on("DOMNodeInserted",".onsale-table", (e)=>{
            let firstPrice = $('.onsale-table-item .text-price:first').text()
            $('tbody.scriptFix .ft-orange:first span').text(firstPrice)
        })
    })
}

function setVal(key,val){
    console.log('setVal',key,val)
    GM_setValue(key,val)
}
function getVal({key,defaultVal}){
    return GM_getValue(key,defaultVal) - ''
}

function tryCatch(callBack){
    try{
        callBack && callBack()
    }catch(e){
        console.log(e)
    }
}
GM_addStyle(`
#tool-card{
    z-index:998;
    position:fixed;
    left:10px;
    top:400px;
    background-color: #0f0e17;
    color:#a7a9be;
    display: flex;
    flex-direction: column;
    padding: 0.75rem 1rem 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 7px;
    border: 2px solid #ff8906;
    min-width:160px;
}
.card-header label{
    margin-bottom: 0.2rem;
}
.card-body{
    display: flex;
    flex-direction: column;
}
.card-footer{
    display: flex;
    justify-content: space-around;
    margin-top: 0.3rem;
}
#tool-card button{
    background-color: #ff8906;
    color:#fffffe;
    padding: 0.3rem 0.5rem;
    border:none;
    border-radius: 3px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
}
#tool-card input,
#tool-card button{
    margin-bottom: 0.2rem;
}
#tool-card button:active{
    position: relative;
    top: 1px;
}
.card-body input{
    color: #fffffe;
    background-color: transparent;
    border: none;
    font-weight: 600;
    font-size: 1rem;
    border-bottom: 0.1rem solid #ff8906;
    text-align: center;
    min-width:59px;
}
.card-body label{
    display: flex;
    align-items: center;
    justify-content: space-around;
}
.card-body select{
    color: #fffffe;
    background-color: transparent;
    border: none;
    font-weight: 600;
    font-size: 1rem;
    border-bottom: 0.1rem solid #ff8906;
    text-align-last:center;
}
.card-body option{
    background-color: #0f0e17;
    color: #a7a9be;
    text-align:center;
}
.connect-status{
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 0.2rem;
}
.connect-status-btn{
    margin-bottom: 0 !important;
    color:#0f0e17 !important;
}
.syncData-btn{
    margin-bottom: 0.2rem !important;
}
.syncData-btn button{
    height: 100%;
    display: flex;
    align-items: center;
}
#AUTH{
    color: #0f0e17 !important;
}
.script_no{
    display:none !important;
}
.hero-fix{
    position: absolute;
    top: 25%;
    right: 30%;
    color:white;
    font-weight: bold;
    z-index:999;
}
`)
