// ==UserScript==
// @name         饰品筛选倒余额 比例自定义 支持buff c5game igxe
// @namespace    http://tampermonkey.net/
// @icon      	 https://store.steampowered.com/favicon.ico
// @version      0.15
// @description  饰品筛选倒余额 可视化比例自定义面板 支持buff c5game igxe
// @author       wsz987
// @match        *://buff.163.com/market/?game=*
// @match        *://buff.163.com/market/goods?goods_id=*
// @match        *://www.c5game.com/*
// @match        *://www.igxe.cn/*
// @match        *://www.igxe.cn/product/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @supportURL   https://keylol.com/t577669-1-1
// ==/UserScript==

const $ = window.jQuery;
/*A 上一页
S 居中且过滤
D 下一页
W 居中
E 过滤后全部打开*/

(function() {
    'use strict';
    window.onload=function(){
        web();
        middle();
        tool()
        try{
            document.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e && e.keyCode==83){
                    middle().then(filter())
                }
                if(e && e.keyCode==68){
                    nextpage();
                }
                if(e && e.keyCode==65){
                    prevpage();
                }
                if(e && e.keyCode==87){
                    middle();
                }
                if(e && e.keyCode==69){
                    filter().then(allopen());
                }
            }
        }catch(e){console.log(e)}
    }
    if(window.location.href.indexOf('buff.163.com/market/goods?goods_id=')>-1||window.location.href.indexOf('www.igxe.cn/product')>-1||window.location.href.indexOf('c5game.com/dota/')>-1||window.location.href.indexOf('c5game.com/csgo/')>-1){
        setTimeout(function(){
            for(var i=0;i<6;i++){
                setTimeout(choice,500*i);
            }
        },3000);
    }
})();

function tool(){
    var li = "<div id='addBtn' style='cursor:pointer;z-index:998;position:fixed;left:10px;top:200px;font-size:100%'>A 上一页<br/>S&nbsp;&nbsp;过滤<br/>D 下一页<br/>W 居中<br/>E 过滤后全部打开</div>";
    var tool ="<div class='price_tool_div' style='cursor:pointer;z-index:998;position:fixed;left:10px;top:400px;font-size:100%'><form onsubmit='return false' id='price_tool_form'><div class='price_tool_input_div'><label class='tool_input_btn'><b>在售数量&nbsp;</b></label><input type='number' step='10' min='0' max='9999' class='price_tool_input filter_search' id='sale_count' placeholder='最低'/></div><div class='price_tool_input_div'><label class='tool_input_btn'><b>理想比例&nbsp;</b></label><input type='number' step='0.01' min='0.6' max='1'  class='price_tool_input filter_search'  id='ideal' placeholder=' 0.6~1'/></div><div class='price_tool_input_div'><label class='tool_input_btn'><b>最高比例&nbsp;</b></label><input type='number' step='0.01' min='0.6' max='1'  class='price_tool_input filter_search'  id='unideal' placeholder=' 0.61~1'/></div></form><div style='margin-top: 0.3rem;text-align: center;'><span class='pre_pagebtn' style='padding: 0 10px;margin-right: 20px;'>&lt;</span><span class='price_tool_reset' ><b>重置</b></span><span class='next_pagebtn' style='padding: 0 10px;margin-left: 20px;'>&gt;</span></div></div>"
    $("body").append(li,tool);
    $('.pre_pagebtn')[0].onclick=function(){
        prevpage();
    }
    $('.next_pagebtn')[0].onclick=function(){
        nextpage();
    }
    var saved_default=['300','0.7','0.75'],
        saved_update = GM_getValue("saved_tool");
    $('.price_tool_reset')[0].onclick=function(){  //reset
        GM_setValue("saved_tool",saved_default);
        initdata()
        alert('重置成功 默认数据["300","0.7","0.75"]')
    }
    if (saved_update == null) {
        GM_setValue("saved_tool",saved_default);
    }
    console.log(GM_getValue('saved_tool'))
    initdata()
    $("#sale_count")[0].onchange= function(){
        saved_update[0]=parseInt($("#sale_count")[0].value)
        if(saved_update[0]>0&&window.location.href.indexOf('buff.163.com/market/?game=')>-1){window.location.reload()}
        if(saved_update[0]>0&&window.location.href.indexOf('www.igxe.cn')>-1&&window.location.href.indexOf('product')==-1){window.location.reload()}
        if(saved_update[0]>0&&window.location.href.indexOf('www.c5game.com')>-1){window.location.reload()}
        GM_setValue("saved_tool",saved_update);
    };
    $("#ideal")[0].onchange= function(){
        if($("#ideal")[0].value==''||$("#ideal")[0].value<0.6||$("#ideal")[0].value>=1){alert('理想比例值为0.6~<1')}
        else{
            saved_update[1]=$("#ideal")[0].value
            GM_setValue("saved_tool",saved_update);
        }
    };
    $("#unideal")[0].onchange= function(){
        if($("#unideal")[0].value==''||$("#unideal")[0].value<0.6||$("#unideal")[0].value>=1){alert('最高比例值为0.6~<1')}
        else{
            saved_update[2]= $("#unideal")[0].value
            GM_setValue("saved_tool",saved_update);
        }
    };
}

function choice(){
    try{
        var lsr=eval($(".lsr")[0].innerText),
            hbr=eval($(".hbr")[0].innerText),
            Value_1=eval(GM_getValue('saved_tool')[1]),
            Value_2=eval(GM_getValue('saved_tool')[2]);  //lsr出售价比例  hbr收购价比例
        console.log(GM_getValue('saved_tool')[1],GM_getValue('saved_tool')[2]);
        if(lsr>eval(1)||hbr>eval(1)){window.close()}
        if(lsr>Value_1){
            if(hbr>Value_2){
                window.close();
            }
        }else{
            if(hbr>Value_2){
                window.close();
            }
        }
    }catch(e){console.log(e)}
}

function web(){
    if(window.location.href.indexOf('buff.163.com/market/?game=')>-1){
        GM_setValue('website',['.market-card','f_Bold c_Gray','.lazy','20'])
    }
    if(window.location.href.split('/')[3]!=''&& window.location.href.indexOf('www.igxe.cn')>-1 && window.location.href.split('/')[3]!='product'){
        GM_setValue('website',['.dataList','sum','.label','20'])
    }
    if(window.location.href.split('/')[3]!=''&& window.location.href.indexOf('www.c5game.com')>-1 ){
        GM_setValue('website',['.list-item4','num','.market-state','28'])
    }
}

function filter(){     //过滤
    return new Promise(resolve => {
        if($("#sale_count")[0].value==''){alert('最低在售值不能为空')}
        else{
            console.log("666")
            var n=0,
                l=document.getElementsByClassName(GM_getValue('website')[1]),
                i=l.length-1;
            for(i;i>=0;i--){
                if(eval(l[i].innerHTML.replace(/[^0-9]/g, ''))<parseInt(GM_getValue('saved_tool')[0])){
                    console.log("个被过滤");
                    l[i].parentNode.parentNode.remove();
                    ++n;
                }
                if(eval(n)==eval(GM_getValue('website')[3])){
                    nextpage();
                }
            }
        }
    });

}

function initdata(){  //初始化
    if(GM_getValue('saved_tool')[0]!=''){
        $("#sale_count")[0].value=GM_getValue('saved_tool')[0]
        //filter()
    }
    if(GM_getValue('saved_tool')[1]!=''){
        $("#ideal")[0].value=GM_getValue('saved_tool')[1]
    }
    if(GM_getValue('saved_tool')[2]!=''){
        $("#unideal")[0].value=GM_getValue('saved_tool')[2]
    }
}
function middle(){  //居中
    try{
        if(window.location.href.indexOf('buff.163.com/market/goods?goods_id=')==-1&&window.location.href.indexOf('product')==-1&&window.location.href.indexOf('www.c5game.com/dota/')==-1){
            return new Promise(resolve => {
                if($(GM_getValue('website')[0]).width()>$(window).height()){
                    $(this).scrollTop($(GM_getValue('website')[0]).offset().top)
                }else{
                    $(this).scrollTop($(GM_getValue('website')[0]).offset().top+($(window).height()-$(GM_getValue('website')[0]).width())/2);
                }
            });
        }
    }catch(e){console.log(e)}
}

function nextpage(){
    try{
        document.getElementsByClassName("page-link next")[0].click();
        try{
            setTimeout(filter,2000);
        }catch(e){console.log(e)}
    }catch(e){
        try{
            console.log(e)
            document.getElementsByClassName("next")[0].childNodes[0].click();
        }catch(e){console.log(e)
                  document.getElementsByClassName("next js-page")[0].click();}
    }
}

function prevpage(){
    try{
        document.getElementsByClassName("page-link prev")[0].click();
    }catch(e){
        try{
            console.log(e)
            document.getElementsByClassName("previous")[0].childNodes[0].click();
        }catch(e){console.log(e)
                  document.getElementsByClassName("prev js-page")[0].click();}
    }
}

function allopen(){
    try{
        var i=0,l=$(GM_getValue('website')[2])
        for(i;i<l.length;i++){
            //window.open(l[i].parentNode.href,i);
            GM_openInTab(l[i].parentNode.href);//依旧停留筛选页面
        }
    }catch(e){console.log(e)}
}