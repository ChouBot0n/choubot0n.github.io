var username=getCookie("username");   //获取当前的用户名
window.onload=function(){
    new Swiper('.swiper-container', {
        autoplay : true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
          },
    });
    $('user').firstChild.innerHTML=("当前用户："+username);
    LoadDoc("home");
    initMap();
}
//请求xml文档
function LoadDoc(t)
{
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp!=null)
    {
        xmlhttp.onreadystatechange=function(){
            if (xmlhttp.readyState==4){
                if(xmlhttp.status==200){
                    changeText(this,t);
                }
            }
        };
        xmlhttp.open("GET","/xml/reference.xml",true);
        xmlhttp.send(null);
    }
}
//替换文本内容
function changeText(ajax,t)
{
    highLight(t);
    //清除main下所有的子节点
    var div=$("main");
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
    var h1=document.createElement("h1");
    if(t=="home"){
        h1.innerHTML="主页";
    }else if(t=="ftrq"){
        h1.innerHTML="风土人情";
    }else if(t=="ttcp"){
        h1.innerHTML="土特产品";
    }else if(t=="dfjj"){
        h1.innerHTML="地方经济";
    }else if(t=="dfjy"){
        h1.innerHTML="地方教育";
    }else if(t=="whcc"){
        h1.innerHTML="文化传承";
    }else if(t=="mrds"){
        h1.innerHTML="名人大事";
    }
    $('main').appendChild(h1);
    //添加文本
    var xmlDoc=ajax.responseXML;
    var x=xmlDoc.getElementsByTagName(t)[0].children;
    for(var i=0;i<x.length;i++){
        var text=x[i].firstChild.nodeValue;
        var tmpp=document.createElement('p');
        tmpp.innerHTML=text;
        div.appendChild(tmpp);
    }
}
function highLight(obj){
    var n=document.getElementsByClassName("navi")[0].getElementsByTagName('li');
    for(var i=0;i<n.length;i++){
        if(n[i].id==obj) n[i].style.borderBottom="2px solid #708090";
        else n[i].style.border="none";
    }
}
//生成地图，基于百度地图提供的API
function initMap(){
    createMap();
}
function createMap(){
    var map=new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(117.011793,23.668609),12);	  
	map.setCurrentCity("饶平"); 
    map.enableScrollWheelZoom(true);
    addMapControl(map); 
}
function addMapControl(map){
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});
	var top_left_navigation = new BMap.NavigationControl();  
    var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});
    map.addControl(top_left_control);        
	map.addControl(top_left_navigation);     
	map.addControl(top_right_navigation);  
}
//加载BBS论坛
function loadBBS(){
     //高亮选项卡
     highLight("yst");
     //清除所有节点
     var div=$("main");
     while(div.hasChildNodes()){
      div.removeChild(div.firstChild);
     }
    //加载论坛
    var headbox=document.createElement("div");
    headbox.id="headbox";
    var h=document.createElement("h1");
    h.innerHTML="议事堂"
    headbox.appendChild(h);
    div.appendChild(headbox);
    //发帖记录
    var recordbox=document.createElement("div");
    recordbox.id="recordbox";
    div.appendChild(recordbox);
    readText();
    //编辑区
    var textbox=document.createElement("div");
    var textarea=document.createElement("textarea");
    textarea.id="textarea";
    textbox.id="textbox";
    textarea.setAttribute("cols",70);
    textarea.setAttribute("rows",5);
    textbox.appendChild(textarea);
    textbox.appendChild(document.createElement("br"));
    var submit=document.createElement("button");
    submit.id="submit";
    submit.innerHTML="发送";
    submit.addEventListener("click",getText);
    textbox.appendChild(submit);
    div.appendChild(textbox);
    
}
//获取cookie的值
function getCookie(cname){
    name=cname+"=";
    var ca=document.cookie.split(";");
    for(var i=0;i<ca.length;i++){
        var c = ca[i].trim();
        if (c.indexOf(name)==0)  return c.substring(name.length);
        return "";
    }
}
//获取输入文本
function getText(){
        var d=new Date();
        var text=jQuery("#textarea").val();
        var msginfo="bbsid:"+getCookie("username")+","+d.toLocaleString();
        var comments=text;
        localStorage.setItem(msginfo,comments);
        jQuery("#textbox").text("");
        loadBBS();
}
//读取存档的帖子内容
function readText(){
    for(var i=localStorage.length-1;i>=0;i--){
        var text=localStorage.getItem(localStorage.key(i));
        if(localStorage.key(i).indexOf("bbsid:")==0){
            var record=document.createElement("div");
        var innerrecord=document.createElement("div");
        record.className="record";
        innerrecord.className="innerrecord";
        record.id=localStorage.key(i);
        var p=document.createElement("p");
        p.innerHTML=localStorage.key(i);
        innerrecord.appendChild(p);
        var block=document.createElement("p");
        block.id="blockquote";
        block.innerHTML=text;
        innerrecord.appendChild(block);
        var innerImg=document.createElement('img');
        innerImg.className="innerImg";
        innerImg.src="img/bit.png";
        innerImg.setAttribute("width","90px");
        innerImg.setAttribute("height","90px");
        record.appendChild(innerImg);
        record.appendChild(innerrecord);
        var rep=document.createElement("button");
        rep.className="reply";
        rep.innerHTML="回复";
        rep.addEventListener('click',function(){
            var pid=this.parentNode.id;
            jQuery("#textarea").text("@"+pid.split(",")[0]+" ");
        });
        record.appendChild(rep);
        if(localStorage.key(i).split(',')[0].substr("bbsid:".length)==getCookie("username")){
            var del=document.createElement("button");
            del.className="del";
            del.innerHTML="删除";
            del.addEventListener('click',function(){
            var pid=this.parentNode.id;
            localStorage.removeItem(pid);
            loadBBS();
        });
        record.appendChild(del);
        }
        $("recordbox").appendChild(record);
        }
    }
}