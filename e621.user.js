// ==UserScript==
// @name         e621
// @version      1.3.0
// @homepageURL https://github.com/Yusifx1/e621-userscript/
// @downloadURL        https://github.com/Yusifx1/e621-userscript/releases/latest/download/e621.user.js
// @description  e621 pool and etc. downloader and parser
// @author        Yusifx1
// @match        https://e621.net/*
// @match        https://e926.net/*
// @grant        GM_download
// @grant       GM_setValue
// @grant  GM_getValue
// ==/UserScript==

var host=window.location.hostname,
loc= window.location.pathname,
search=window.location.search,
topbody = document.querySelector ( '#top' ),
body=document.body,
ids,scrolldelay,cgp,url,ctime,select,a,l,img,subdiv,plimit,count,json,pac,pools,page,id,x,src,pc,purl,max,min;
var clist ="";
var xhr = new XMLHttpRequest();
var useragent="e621downloaderbyYusifx1/1.3.0";
var obj = [];
var list=[];
var sample=[];
var ext=[];
var act=0;
var val={};
var finished=0;
var mstyle='background-color: #00549e;color:white;font-size: 18px;cursor: pointer;border-radius: 8px;';
var sstyle = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;max-height: 150px; overflow: auto;column-count:2;color:blue;cursor:pointer';
var fncstyle='background-color: #9e5a00;color:white;font-size: 14px;cursor: pointer;border-radius: 8px;';
var tabbutstyle='background-color: inherit;color:white; cursor: pointer;  padding: 14px 16px; transition: 0.3s;border-radius: 0;';
var saved=GM_getValue( "e621downByYusifx1");
var subscription=GM_getValue( "e621subByYusifx1");
if (!subscription) {
subscription={};
subscription.pool={};
}
if (saved) {
if (saved.name == undefined) {saved.name="pool-%id%_%name%/%count%_%md5%";}
if (saved.sname == undefined) {saved.sname="set-%id%_%name%/%count%_%md5%";}
if (saved.sym == undefined) {saved.sym="[\\[\\]\\\\:?;*+/=<|>\\\"]";}
if (saved.check == undefined) {saved.check="true";}
if (saved.join == undefined) {saved.join="-";}
if (saved.check3 == undefined) {saved.check3="false";}
if (saved.res == undefined) {saved.res="Sample";}
if (saved.step == undefined) {saved.step=10;}
if (saved.slidespeed == undefined) {saved.slidespeed=2;}
if (saved.scroll == undefined) {saved.scroll="Focus on image";}
if (saved.subint == undefined) {saved.subint=30;}
if (saved.scrapeo == undefined) {saved.scrapeo="order:random";}
if (saved.typelist == undefined) {saved.typelist="All";}
} else {
reset();
}

function subscribediv () {
subbut.disabled=true;
subdiv = document.createElement("div");
subdiv.style='background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;position: absolute;left: 10vw;width: 80vw;top: 10vh;padding: 15px;';
body.appendChild(subdiv);
subdiv.style.zIndex = "98";

var mb1 = document.createElement("button");
mb1.innerHTML="x";
subdiv.appendChild(mb1);
mb1.style="display:block;color:white;background-color: transparent;float:right;font-size: 30px;";
mb1.addEventListener ("click", function() { subdiv.remove();subbut.disabled=false;});

var tabdiv = document.createElement("div");
tabdiv.style='background-color: #1263ba;';

var poolmenu=document.createElement("button");
poolmenu.innerHTML="Pools";
poolmenu.style=tabbutstyle;
poolmenu.addEventListener("click", function() {tabhs();poolmenu.style.background="#072546";pooldiv.style.display = "block";});
tabdiv.appendChild(poolmenu);

var setsmenu=document.createElement("button");
setsmenu.innerHTML="Sets (W.I.P)";
setsmenu.style=tabbutstyle;
setsmenu.addEventListener("click", function() {tabhs();setsmenu.style.background="#072546";setsdiv.style.display = "block";});
tabdiv.appendChild(setsmenu);

var tagsmenu=document.createElement("button");
tagsmenu.innerHTML="Tags (W.I.P)";
tagsmenu.style=tabbutstyle;
tagsmenu.addEventListener("click", function() {tabhs();tagsmenu.style.background="#072546";tagsdiv.style.display = "block";});
tabdiv.appendChild(tagsmenu);
subdiv.appendChild(tabdiv);
var option;
var type = document.createElement("select");
option = document.createElement("option");
    option.text = "Has updates";
    type.appendChild(option);
option = document.createElement("option");
    option.text = "Without updates";
    type.appendChild(option);
option = document.createElement("option");
    option.text = "All";
    type.appendChild(option);
type.value=saved.typelist;
tabdiv.appendChild(type);
type.style.float="right";
type.addEventListener ("change", dis);

function dis() {
	saved.typelist=type.value;
	GM_setValue("e621downByYusifx1",saved);
 var display=subdiv.getElementsByTagName("article");
for (var i=0;i<display.length;i++) {
        display[i].style.display="none";
    }
if (type.value=="Has updates") {
display =subdiv.getElementsByClassName("hasnew");
} else if (type.value=="Without updates") {
 display =subdiv.getElementsByClassName("notnew");
}
    for (var i=0;i<display.length;i++) {
        display[i].style.display="inline-block";
    }
}
var pooldiv = document.createElement("div");
pooldiv.style='top: 5%;padding: 15px; display: none;';
subdiv.appendChild(pooldiv);

var tagsdiv = document.createElement("div");
tagsdiv.style='top: 5%;padding: 15px; display: none;';
subdiv.appendChild(tagsdiv);

var setsdiv = document.createElement("div");
setsdiv.style='top: 5%;padding: 15px; display: none;';
subdiv.appendChild(setsdiv);

var toPool=document.createElement("a");
toPool.href='https://e621.net/pools?search[id]='+Object.keys(subscription.pool);
toPool.innerHTML="» View Pool list";
toPool.style.display="block";
pooldiv.appendChild(toPool);

checkpreview();

for (var poolid in subscription.pool) {

var article=document.createElement("article");
article.classList.add("post-preview","captioned");
article.style='overflow:visible;margin: 20px 10px 10px 20px;vertical-align: middle;display:none;';
if (subscription.pool[poolid].new=="yes") {
article.classList.add("hasnew");
} else {
article.classList.add("notnew");
}

var link=document.createElement("a");
link.href="/pools/"+poolid;

var preview =document.createElement("img");
if (subscription.pool[poolid].rating=="s" || host=="e621.net") {
preview.src=subscription.pool[poolid].url;
} else {
preview.src=subscription.pool[poolid].surl;
}

var p =document.createElement("p");
p.classList.add("desc");
var link1=document.createElement("a");
link1.href="/pools/"+poolid;
link1.textContent=subscription.pool[poolid].name;

if (subscription.pool[poolid].new=="yes") {
var circle = document.createElement("div");
circle.style='position: absolute;top:-20px;right:-20px;border-radius: 50%; background: red;height:40px;width:40px;text-align: center;font-size:20px;line-height: 40px;';
circle.textContent=subscription.pool[poolid].newid.length-subscription.pool[poolid].id.length;
article.appendChild(circle);
}

article.appendChild(link).appendChild(preview);
article.appendChild(p).appendChild(link1);
pooldiv.appendChild(article);
}
dis();

function tabhs() {
poolmenu.style=tabbutstyle;
setsmenu.style=tabbutstyle;
tagsmenu.style=tabbutstyle;
poolmenu.disabled=false;
setsmenu.disabled=false;
tagsmenu.disabled=false;
pooldiv.style.display="none";
setsdiv.style.display="none";
tagsdiv.style.display="none";
}
poolmenu.click();
}

function settings () {
mb.disabled=true;

var div = document.createElement("div");
div.style='background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;position: absolute;left: 20vw;width: 60vw;top: 10vh;padding: 15px;';
body.appendChild(div);
div.style.zIndex = "99";

var head=document.createElement("p");
head.innerHTML="E621 downloader (1.3.0)";
div.appendChild(head);

var mb1 = document.createElement("button");
mb1.innerHTML="x";
div.appendChild(mb1);
mb1.style="position: absolute;color:white;background-color: transparent;top:0;right: 5px;font-size: 30px;";
mb1.addEventListener ("click", function() { div.remove();mb.disabled=false;});

var setmenu=document.createElement("button");
setmenu.innerHTML="Download";
setmenu.style='background-color: #eee; color: #444; cursor: pointer; width: 100%; border: none; outline: none;';
setmenu.addEventListener("click", tab);
div.appendChild(setmenu);

var downdiv = document.createElement("div");
downdiv.style='padding: 0 18px;background-color: transparent;display: none;overflow: hidden;';
div.appendChild(downdiv);

setmenu=document.createElement("button");
setmenu.innerHTML="Gallery";
setmenu.addEventListener("click", tab);
setmenu.style='background-color: #eee; color: #444; cursor: pointer; width: 100%; border: none; outline: none;';
div.appendChild(setmenu);

var gsdiv = document.createElement("div");
gsdiv.style='padding: 0 18px;background-color: transparent;display: none;overflow: hidden;';
div.appendChild(gsdiv);

setmenu=document.createElement("button");
setmenu.innerHTML="Subscription";
setmenu.addEventListener("click", tab);
setmenu.style='background-color: #eee; color: #444; cursor: pointer; width: 100%; border: none; outline: none;';
div.appendChild(setmenu);

var subsdiv = document.createElement("div");
subsdiv.style='padding: 0 18px;background-color: transparent;display: none;overflow: hidden;';
div.appendChild(subsdiv);

var header3 = document.createElement("H1");
header3.innerHTML="Subscription settings";
header3.style='padding: 15px';
subsdiv.appendChild(header3);

var uisp= document.createElement("H3");
uisp.innerHTML="Update interval:  ";

var uis= document.createElement("input");
uis.type="number";
uis.style.width = "50px";
uis.min="1";
uis.step="1";
uis.value=saved.subint;
subsdiv.appendChild(uisp).appendChild(uis);

var sublist= document.createElement("H3");
sublist.innerHTML="Subscriptions:  ";

var header = document.createElement("H1");
header.innerHTML="Gallery settings";
header.style='padding: 15px';
gsdiv.appendChild(header);

var label= document.createElement("H3");
label.innerHTML="Image quality ";

var selecte = document.createElement("select");
 var option = document.createElement("option");
    option.text = "Sample";
    selecte.appendChild(option);
option = document.createElement("option");
    option.text = "Source";
    selecte.appendChild(option);
selecte.value=saved.res;
gsdiv.appendChild(label).appendChild(selecte);


var stept= document.createElement("H3");
stept.innerHTML="Post count per gallery page:  ";

var stepin= document.createElement("input");
stepin.type= "number";
stepin.min="1";
stepin.style.width="50px";
stepin.value=saved.step;
gsdiv.appendChild(stept).appendChild(stepin);

var slsp= document.createElement("H3");
slsp.innerHTML="Slideshow delay:  ";

var slss= document.createElement("input");
slss.type="number";
slss.style.width = "50px";
slss.min="0.1";
slss.step="0.1";
slss.value=saved.slidespeed;
gsdiv.appendChild(slsp).appendChild(slss);

label= document.createElement("H3");
label.innerHTML="Slideshow style  ";

var select2 = document.createElement("select");
option = document.createElement("option");
    option.text = "Focus on image";
    select2.appendChild(option);
option = document.createElement("option");
    option.text = "Fullscreen";
    select2.appendChild(option);
option = document.createElement("option");
    option.text = "Scroll";
    select2.appendChild(option);
select2.value=saved.scroll;
gsdiv.appendChild(label).appendChild(select2);


var header2 = document.createElement("H1");
header2.innerHTML="Download and scrape settings";
header2.style='padding: 15px';
downdiv.appendChild(header2);

var folder= document.createElement("H3");
folder.innerHTML="Pool download name and direction ";

var inputfol = document.createElement("input");
inputfol.value=saved.name;
downdiv.appendChild(folder).appendChild(inputfol);

var sfolder= document.createElement("H3");
sfolder.innerHTML="Set download name and direction ";

var sinputfol = document.createElement("input");
sinputfol.value=saved.sname;
downdiv.appendChild(sfolder).appendChild(sinputfol);

var orderlist=["Add order","order:id","order:random","order:score","order:score_asc","order:favcount","order:favcount_asc","order:tagcount","order:tagcount_asc","order:desclength","order:desclength_asc","order:comments","order:comments_asc","order:mpixels","order:mpixels_asc","order:filesize","order:filesize_asc","order:landscape","order:portrait","order:change","order:duration","order:duration_asc"];

label= document.createElement("H3");
label.innerHTML="Sets scrape order ";

var avvar= document.createElement("span");
avvar.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;column-count:2;padding: 15px;';
avvar.innerHTML="<strong>Static variables:</strong> <br>   %id% - id of pool  <br>%name% - name of pool <br>%category% - category of pool   <br>%pc% - post count <br><br>";
avvar.innerHTML+="<strong>Changing variables:</strong> <br>%count% - current post (index of pool post) <br>%post_id% - id of post <br><br><br> <strong>File:</strong>  <br>%md5% - The md5 of the file <br>   %width% - image width <br>   %height% - image height <br><br>  <strong> Tags of post: </strong> <br>%species% <br>%character% <br>%artist% <br>%copyright%  <br>%meta%";
downdiv.appendChild(avvar);

var select = document.createElement("select");
for (var i=0;i < orderlist.length;i++) {
option = document.createElement("option");
    option.text = orderlist[i];
    select.appendChild(option);
}
select.value=saved.scrapeo;
downdiv.appendChild(label).appendChild(select);

avvar= document.createElement("span");
avvar.style='background-color:#102545;display: block;font-size: 12px;border-radius: 8px;padding: 15px;';
avvar.innerHTML='<strong>If selected "Add order" and post count +30k it may stuck for several second. <a href="https://e621.net/help/cheatsheet#sorting">About orders</a>.</strong>';
downdiv.appendChild(avvar);

var sym= document.createElement("H3");
sym.innerHTML="Symbol to replace:  ";

var inputsym = document.createElement("input");
inputsym.value=saved.sym;
downdiv.appendChild(sym).appendChild(inputsym);

var info= document.createElement("span");
info.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;padding: 15px;';
info.innerHTML="<strong>Fill input field to replace illegal character for your OS. It make half-width to <\strong>ｆｕｌｌ－ｗｉｄｔｈ <br>For Windows - [/?<>\\:*|\\\"] <br> For Android you should use [\\[\\]\\\\:?;*+/=<|>\\\"]  <br> You can make any character full-width. Just write character in bracket [anycharacter]. Some special character write with \\ (like \\\\, it will replace backslash). For more <a href = https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words>info </a>";
downdiv.appendChild(info);

var rep = document.createElement("H3");
rep.innerHTML="Replace \"_\" in name with space:  ";

var check = document.createElement("input");
check.setAttribute("type", "checkbox");
check.checked=saved.check;
downdiv.appendChild(rep).appendChild(check);

var array= document.createElement("H3");
array.innerHTML="Connect variable with several value like tags:  ";

var join = document.createElement("input");
join.style.width = "50px";
join.value=saved.join;
downdiv.appendChild(array).appendChild(join);


var mb2= document.createElement("button");
mb2.innerHTML="Save";
div.appendChild(mb2);
mb2.addEventListener ("click", saveset);

var mb3= document.createElement("button");
mb3.innerHTML="reset";
div.appendChild(mb3);
mb3.addEventListener ("click", function() {reset();div.remove();settings();});

function saveset () {
saved.name=inputfol.value;
saved.sname=sinputfol.value;
saved.sym=inputsym.value;
saved.check=check.checked;
saved.join=join.value;
saved.res=selecte.value;
saved.step=stepin.value;
saved.slidespeed=slss.value;
saved.scroll=select2.value;
saved.subint=uis.value;
saved.scrapeo=select.value;
saved.typelist=saved.typelist;
GM_setValue("e621downByYusifx1",saved);
}
}
var mb = document.createElement("button");
mb.innerHTML = "Settings";
document.getElementsByTagName("menu")[1].appendChild(mb);
mb.style='background-color: transparent;font-weight:bold;color: #b4c7d9;cursor: pointer;';
mb.style.float="right";
mb.addEventListener ("click", settings);

var subbut = document.createElement("button");
subbut.innerHTML = "Subscriptions";
topbody.appendChild(subbut);
subbut.style=mstyle;
subbut.style.float="right";
subbut.addEventListener ("click", subscribediv);


function tab() {

    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  }

function reset () {
saved={};
saved.name="pool-%id%_%name%/%count%_%md5%";
saved.sname="set-%id%_%name%/%count%_%md5%";
saved.sym="[\\[\\]\\\\:?;*+/=<|>\\\"]";
saved.check=true;
saved.join="-";
saved.check3=false;
saved.res="Sample";
saved.step=10;
saved.slidespeed=2;
saved.scroll="Focus on image";
saved.subint=30;
saved.scrapeo="order:random";
saved.typelist="All";
GM_setValue("e621downByYusifx1",saved);
}

if (loc.match(/(\/posts|\/pools\/\d)/)) {
onepage();
}

if (loc.match(/(\/post_sets\/\d|\/pools\/\d)/)) {
var button = document.createElement("button");
topbody.appendChild(button);
button.style = mstyle;
button.addEventListener ("click", pool );
}

if (loc.match(/(\/posts|\/pools*|\/post_sets\/\d)/)) {

var gallery = document.createElement("button");
gallery.innerHTML = "Gallery";
topbody.appendChild(gallery);
gallery.style=mstyle;
gallery.style.float="right";

var button3 = document.createElement("button");
topbody.appendChild(button3);
button3.style = mstyle;
}

if ( loc.match(/\/post_sets\/\d/) ) {
gallery.addEventListener ("click", function() { galdiv("set");});

button.innerHTML = "Download Set";
button3.innerHTML = "Scrape set";
button3.addEventListener ("click",function() {scrape();});
var input = document.createElement("input");
input.placeholder="Scrape from #";
input.style.width="150px";
topbody.appendChild(input);
var input2 = document.createElement("input");
input2.placeholder="To # post";
input2.style.width="150px";
topbody.appendChild(input2);
}


if ( loc.match(/\/pools\/*/) ) {
gallery.addEventListener ("click", function() { galdiv("pool");});

button.innerHTML = "Download Pool";
if ( loc.match(/pools\/\d/) ) {
var curid=loc.slice(7);
if (subscription.pool[curid]) {
if (subscription.pool[curid].new=="yes") {
subscription.pool[curid].new="no";
subscription.pool[curid].id=subscription.pool[curid].newid;
GM_setValue( "e621subByYusifx1", subscription);
}
}

var button8 = document.createElement("button");
button8.style='color:white;border-radius: 4px;float: right;';
document.getElementsByTagName("h2")[0].appendChild(button8);
if (subscription.pool[curid]==undefined) {
button8.innerHTML = "Subscribe";
button8.style.background="green";
} else {
button8.innerHTML = "Unsubscribe";
button8.style.background="red";
}
button8.addEventListener("click", subscribe);
button8.classList.add(curid);
} else {
var categ = document.getElementsByTagName("td");
for (x=7; x<categ.length; x=x+3) {
var curid=categ[x+1].getElementsByTagName("a")[0].href.slice(23);
var button8 = document.createElement("button");
button8.style='color:white;border-radius: 4px;top:0;';
if (subscription.pool[curid]==undefined) {
button8.innerHTML = "Subscribe";
button8.style.background="green";
} else {
button8.innerHTML = "Unsubscribe";
button8.style.background="red";
}
button8.addEventListener("click", subscribe);
button8.classList.add(curid);
categ[x].appendChild(button8);
}
}
button3.innerHTML = "Scrape pool";
button3.addEventListener ("click",function() {scrape();});
var input = document.createElement("input");
input.placeholder="Scrape from #";
input.style.width="150px";
topbody.appendChild(input);
var input2 = document.createElement("input");
input2.placeholder="To # post";
input2.style.width="150px";
topbody.appendChild(input2);

}



if ( loc == "/posts" ) {

val.name=search;
button3.innerHTML = "Get all post links";
button3.addEventListener ("click", function() {
button3.style.disabled=true;
if (search.length==0){loc="?";
}else {loc=search;}
if ( window.location.pathname.match(/post_sets\/\d/) ) {
loc="?tags=set%3A";
loc+=window.location.pathname.slice(11);
}
val.name=fullw(val.name);
page=0;
plimit = prompt("Please enter page count that you want. Like 3 for 3 page or any text like yiff time for all page (page=320 posts):", "all");
if (plimit !== null) {
if (isNaN(plimit)) {
var limitpage=document.getElementsByClassName("numbered-page");
var a=limitpage.length-1;
if (a<0) {
plimit=1;
} else {
plimit=limitpage[a].getElementsByTagName("a")[0].innerHTML;
if (search.match("limit=")) {
pc= search.match(/limit=\d+/g);
pc=pc.slice(6);
} else {
pc=75;
}
plimit=Math.ceil(plimit*pc/320);
}
}
pc=320;
button3.textContent = "Scraped 0 / "+plimit+" page";
clearInterval(checkt);
allpage();
var get = setInterval(function() {
if (page>=plimit) {
clearInterval(get);
checkt=setInterval(checktime,600000);
} else {allpage();}
},650);
}
});
gallery.addEventListener ("click", function() { galdiv("post");});
}
function pool() {
if (act==0) {
scrape(dpool);
} else {
dpool();
}
}

function getid() {

if ( loc.match(/pools\/\d/) ) {
url="https://"+host+ loc + ".json?_client="+useragent;
xhr.open('GET', url, false);
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);

}else if ( loc.match(/\/post_sets\/\d/) ) {
url="https://"+host+ loc + ".json?_client="+useragent;
xhr.open('GET', url, false);
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
}
else{
loc=search;
url="https://"+host+"/pools.json";
if (loc.length>1) {
url+=loc+"&";
} else {url+="?";}
url+="_client="+useragent;
xhr.open('GET', url, false);
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
pools="Watch pools list, then write selected pool number in next screen:";
for ( x=0 ; x < json.length;x++) {
pools+="\n"+(x+1)+" )";
pools+=json[x].id+" - ";
pools+=json[x].name.replace(/_/g," ");
}
if ( json.length==1 ) {
select=1;
} else {
alert(pools);
select=prompt( "select pool number", "1");
}
if (!select) {
gallery.style.visibility ="visible";
return;
}
select=select-1;
json=json[select];
}
val.name= json.name;
if (saved.check) {
val.name= val.name.replace(/_/gi, " ");
}
val.category = json.category;

id=json.id;
val.id=id;
pc=json.post_count;
val.pc=pc;
max=input2.value;
min=input.value-1;
topbody.removeChild(input);
topbody.removeChild(input2);
act=1;
if (max=="") {max=pc;}
if (min=="-1") {min=0;}
pac=Math.ceil(pc/320);
ids= json.post_ids;
ids=ids.slice(min,max);
}

function getpl (run) {
url="https://"+host+"/posts.json?tags=status:any+";
if ( ids.length <=100) {
url = url+"id:"+ids+"&limit=101";
pac=1;
}else{
if (loc.match(/\/post_sets\/\d/) ) {
url+="set:"+id+"+";
if (saved.scrapeo!=="Add order") {
url+=saved.scrapeo;
}
url+="&limit=320&page="+page;
} else {
url+="pool:"+id+"&limit=320&page="+page;
}
}
url+="&_client="+useragent;
let xhr=new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.onload=function (e) {
finished++;
button3.textContent = "Scraped "+finished+" / "+pac+" page";

json=xhr.responseText ;
json=JSON.parse(json);
obj.push(...json.posts);
if (pac==finished) {
setTimeout(function() {
if (saved.scrapeo=="Add order" || !loc.match(/\/post_sets\//)) {
purl= ids.map(id => obj.find(post => post.id === id));
    purl = purl.filter(function (el) {   return el != null;
});
} else { purl=obj.filter(function (el) {   return el != null;
});}
geturl();
button3.style.visibility = 'hidden';
cleanlist();
spanal();
copyToClipboard();
save();
if (run) {
run();
}
button.style.disabled=false;
checkt=setInterval(checktime,600000);
},0);
}
};
xhr.send();
page++;
}


function geturl() {
var x;
list=[];
ext=[];
sample=[];
for (x=0 ; x < purl.length;x++) {

var e= purl[x].file.ext;
var md5= purl[x].file.md5;
var smpl=purl[x].sample.url;

var fl ="https://static1.e621.net/data/" + md5[0] + md5[1] + "/" + md5[2] + md5[3]+ "/" + md5 + "." + e;
if (purl[x].flags.deleted) {

  l=purl[x].sources.join("\n");
fl="null";

a=l.match(/.*(png|gif|jpg|webm|mp4)/);
if (a) {
fl=a[0];
e=a[1];
}

}
if (smpl==null) {
if (purl[x].sample.has==true && !purl[x].flags.deleted) {
smpl="https://static1.e621.net/data/sample/" + md5[0] + md5[1] + "/" + md5[2] + md5[3]+ "/" + md5 + ".jpg";
} else {
smpl=fl;
}
}
sample.push(smpl);
list.push(fl);
ext.push(e);
}
}

function dpool() {
var x=min+1;
pc=list.length;

var downname=saved.name;

if (loc.match(/\/post_sets\//) ) {
downname=saved.sname;
}
downname=downname.replace(/\//gi,"folderslash");
downname=downname.replace(/%id%/gi, val.id).replace(/%name%/gi, val.name).replace(/%pool%/gi, val.pool).replace(/%category%/gi, val.category).replace(/%pc%/gi, val.pc);

var j =saved.join;
for (var i=0;i<list.length;i++) {
count = x.toString(10).padStart(3, "0");
    var url=list[i];
  var file=downname.replace(/%count%/gi,count).replace(/%md5%/gi,purl[i].file.md5 ).replace(/%width%/gi,purl[i].file.width ).replace(/%height%/gi,purl[i].file.height ).replace(/%post_id%/gi, purl[i].id ).replace(/%species%/gi, purl[i].tags.species.join(j)).replace(/%character%/gi, purl[i].tags.character.join(j)).replace(/%artist%/gi, purl[i].tags.artist.join(j)).replace(/%copyright%/gi, purl[i].tags.copyright.join(j)).replace(/%meta%/gi, purl[i].tags.meta.join(j));

file=fullw(file);
file=file.replace(/folderslash/gi, "\/");

GM_download( url , file+"."+ext[i]);

x++;
}
}
function allpage() {
page++;
url="https://"+host+"/posts.json"+loc+"&limit=320&page="+page+"&_client="+useragent;
let xhr=new XMLHttpRequest();
xhr.open('GET', url, true);
xhr.onload=function (e) {
var json=JSON.parse(xhr.responseText) ;
obj.push(...json.posts);
pc=json.posts.length;
finished++;
button3.textContent = "Scraped "+finished+" / "+plimit+" page";
if (finished==plimit) {
purl= obj;
 geturl();
act=2;
button3.style.visibility = 'hidden';
cleanlist();
spanal();
copyToClipboard();
save();
}
};
xhr.send();
}


function onepage() {
var button2 = document.createElement("button");
button2.innerHTML = "Get page post links";
topbody.appendChild(button2);
button2.style = mstyle;
button2.addEventListener ("click", function() {
var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' );
span.style=sstyle;
if ( post !==null ) {
for ( x = 0; x < post.length; x++ ) {
src = post[x].getAttribute ('data-file-url');
	var btn=document.createElement("a");
var link=document.createTextNode(src);
btn.href=src;
btn.onclick=spanclick;
btn.appendChild(link);
span.appendChild(btn);
var linebreak = document.createElement("br");
span.appendChild(linebreak);
}
 button2.style.visibility = 'hidden';
topbody.appendChild(span);
}
});
}

function copyToClipboard() {
var button4= document.createElement("button");
button4.innerHTML = "Copy to clipboard";
topbody.appendChild(button4);
button4.style = fncstyle;
button4.addEventListener ("click", function() {
 var dummy = document.createElement("textarea");
    body.appendChild(dummy);
    dummy.value += clist;
    dummy.select();
    document.execCommand("copy");
    body.removeChild(dummy);
});
}
function scrape (run) {
clearInterval(checkt);
getid();
page=1;
button3.style.disabled=true;
button.style.disabled=true;
button3.textContent = "Scraped 0 / "+pac+" page";
getpl(run);
var get = setInterval(function() {
if (page>=pac+1) {
clearInterval(get);
} else {
getpl(run);}},650);
}
function cleanlist() {
clist= list.toString();
clist=clist.replace(/,/gi, "\n");
}
function spanal() {
var button7= document.createElement("button");
button7.innerHTML = "Show links ";
topbody.appendChild(button7);
button7.style = fncstyle;
button7. addEventListener ("click", function() {
var span = document.createElement ( 'span' );
for (x=0;x<list.length;x++){
var btn=document.createElement("a");
var link=document.createTextNode(list[x]);
btn.href=list[x];
btn.onclick=spanclick;
btn.appendChild(link);
span.appendChild(btn);
var linebreak = document.createElement("br");
span.appendChild(linebreak);
}
span.style = sstyle;
topbody.appendChild ( span );
button7.style.visibility = 'hidden';
});
}

function save() {
var button6= document.createElement("button");
button6.innerHTML = "Save links to file";
topbody.appendChild(button6);
button6.style = 'background-color: green;color:white;font-size: 14px;border-radius: 8px;';
button6.addEventListener ("click", function() {
var hiddenElement = document.createElement('a');
hiddenElement.href = 'data:attachment/text,' + encodeURI(clist);
hiddenElement.target = '_blank';
hiddenElement.download = val.name+".txt";
hiddenElement.click();
});
}

function spanclick() {

var div=document.createElement("span");
div.style='width:100%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0, 0.8);position: fixed; top: 0; left: 0;';
div.style.zIndex = "97";
var mb1 = document.createElement("button");
mb1.innerHTML="x";
div.appendChild(mb1);
mb1.style="right:0;position:fixed;background-color: transparent;color:#465254;font-size : 100px;";
mb1.style.zIndex = "98";
mb1.addEventListener ("click", function () {div.remove();});
var Aaa=this.href;
if (Aaa.match(/.*(webm|mp4)/)) {
 img=document.createElement("video");
 img.setAttribute("controls","controls");
var poster =this.href.replace(/\/data/g,"\/data\/sample").replace(/.webm/g,".jpg");
img.poster=poster;
}else {
img=document.createElement("img");
}
img.src=this;
img.style='position:absolute;object-fit:contain;width: 100%;height: 100%;';
div.appendChild(img);
body.appendChild(div);
return false;}

function fullw(aa) {
var re = new RegExp(saved.sym ,"g");
return aa.replace(re,s =>   String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));
}


function galdiv (cpos) {
gallery.style.visibility ="hidden";
if (act!==0) {
watch();
}
if (act==0 && cpos=="pool") {
scrape(watch);
}
if (act==0 && cpos=="set") {
scrape(watch);
}
if (cpos=="post" && act ==0) {
var ps=document.querySelectorAll ( '.post-preview' );
if ( ps !== null ) {
for ( x = 0; x < ps.length; x++ ) {
src = ps[x].getAttribute('data-file-url');
var ssmp=ps[x].getAttribute('data-large-file-url');
list.push(src);
sample.push(ssmp);
act=3;
}}
watch();
}

function watch () {

var gallerydiv = document.createElement("div");
body.appendChild(gallerydiv);
gallerydiv.style='overflow-y: auto;overflow-x: hidden;width:80%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0, 0.8);position: fixed; top: 0; left: 10vw;';
gallerydiv.style.zIndex = "98";

var n=0;
gallerydiv.innerHTML="";
var imgsrc=list;

if ( saved.res=="Sample" ) {
imgsrc= sample;
}

var galc = document.createElement("button");
galc.innerHTML="x";
body.appendChild(galc);
galc.style="color:#465254;background-color: transparent;position:fixed;right: 1vw;top:0;font-size : 10vw;";
galc.style.zIndex = "98";
galc.addEventListener ("click", function () {
galc.remove();
slide.remove();
if (slide.innerHTML=="❙❙") {clearInterval(scrolldelay);}
gallerydiv.remove();
gallery.style.visibility ="visible";
right.remove();
left.remove();
cgp=null;
});

var step=saved.step;
var len=imgsrc.length;
var pagec=Math.floor(len/step);
if (pagec*step==len) {pagec--;}
var page=0;
var nextpost=step;
if (len<step) {nextpost=len;}

var left = document.createElement("button");
left.style='font-size:20vw;width:10vw; height:100vh;top:0vh;background-color: rgba(0, 0, 0, 0.8);color:#465254;position: fixed; left: 0;text-align: center;';
left.style.zIndex = "97";
left.innerHTML="‹";
body.appendChild(left);
left.addEventListener ("click", galnavleft);

var right= document.createElement("button");
right.style='font-size:20vw;width:10vw; height:100vh;top:0vh;background-color: rgba(0, 0, 0, 0.8);color:#465254;position: fixed; right: 0;text-align: center;';
right.style.zIndex = "97";
right.innerHTML="›";
body.appendChild(right);
right.addEventListener ("click", galnavright);

var slide= document.createElement("button");
slide.innerHTML="▶";
body.appendChild(slide);
slide.style="color:#465254;background-color: transparent;position: fixed;left:1vw;bottom:0;font-size : 10vw;";
slide.style.zIndex = "98";
slide.addEventListener ("click", sslide);

function  sslide  () {
if (slide.innerHTML=="❙❙") {
slide.innerHTML="▶";
clearInterval(scrolldelay);
} else {

slide.innerHTML="❙❙";
if (saved.scroll== "Fullscreen") {
cgp=cgp-1 || page;
var backdiv= document.createElement("div");
body.appendChild(backdiv);
backdiv.style='width:100%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0);position: absolute;';

if (backdiv.requestFullscreen) {
    backdiv.requestFullscreen();
backdiv.addEventListener("fullscreenchange", function() {
if ( !document.fullscreenElement ) {sslide();backdiv.remove();}
});
  } else if (backdiv.mozRequestFullScreen) {
    backdiv.mozRequestFullScreen();
backdiv.addEventListener("mozfullscreenchange", function() {
if (!document.mozFullScreenElement) {sslide();backdiv.remove();}
});
  } else if (backdiv.webkitRequestFullscreen) {
    backdiv.webkitRequestFullscreen();
backdiv.addEventListener("webkitfullscreenchange", function() {
if (!document.webkitFullscreenElement) {sslide();backdiv.remove();}
});
  }

var cna = function () {
if (cgp==list.length) {cgp=0;}
var imag;
if (list[cgp].match(/.*(webm|mp4)/)) {
imag=document.createElement("video");
imag.setAttribute("controls","controls");
imag.poster=imgsrc[cgp];
imag.src=list[cgp];
} else {
imag=document.createElement("img");
imag.src=imgsrc[cgp];}
imag.classList.add("imagelist");
imag.style='transition:ease-in 500ms;width: 100%;height: 100%;object-fit:contain; opacity:0;position: absolute;';
backdiv.appendChild(imag);
cgp++;
};

cna();
cna();

backdiv.getElementsByClassName("imagelist")[0].style.opacity=1;

scrolldelay = setInterval(function() {
cna();
if (backdiv.getElementsByClassName("remove").length > 0) {
backdiv.getElementsByClassName("remove")[0].remove();
}
var imaglist= backdiv.getElementsByClassName("imagelist");
imaglist[1].style.opacity=1;
imaglist[0].style.opacity=0;
imaglist[0].classList.add("remove");

},saved.slidespeed*1000+500);

} else if ( step == 1 ) {
scrolldelay = setInterval(function() {galnavright();}, saved.slidespeed*1000+300);
} else if (saved.scroll== "Scroll") {
scrolldelay = setInterval(function() {
gallerydiv.scroll(0,gallerydiv.scrollTop+4);
if(gallerydiv.scrollHeight - gallerydiv.scrollTop <= gallerydiv.clientHeight+30) {
sslide();
setTimeout(function() {galnavright();gallerydiv.scrollTo(0,0);},1000);
setTimeout(sslide,2500);
   }
},saved.slidespeed);
} else {
cgp=cgp || 0;
    scrolldelay = setInterval(function () {
var images = gallerydiv.querySelectorAll("video,img");
if (cgp==images.length) {
cgp=0;
sslide();
galnavright();
gallerydiv.scrollTo(0,0);
setTimeout(sslide,1000);
} else {
var topPos =images[cgp].offsetTop-30-(gallerydiv.clientHeight-images[cgp].height)/2;

gallerydiv.scrollTo({
  top: topPos,
  behavior: 'smooth'
});
cgp++;
}
},saved.slidespeed*1000);

}
}
}

function galnavleft () {
n--;
cgp=null;
gallerydiv.innerHTML="";
 page=n*step;
nextpost=(n+1)*step;
if (page<0) {
n=pagec;
page=n*step;
nextpost=len;
if (page==len) {page=page-step;}
}
if (nextpost>len) {nextpost=len;}
append();
}

function galnavright () {
n++;
cgp=null;
gallerydiv.innerHTML="";
 page=n*step;
nextpost=(n+1)*step;
if (page>=len) {
n=0;
page=0;
nextpost=step;
}
if (nextpost>len) {nextpost=len;}
append();
}


append();
function append () {
var navbar = document.createElement("select");
navbar.style='background-color:#00549e;font-size: 7vmin;bottom: 0;left:50%;position:fixed;';
navbar.style.zIndex=98;
for (x=0;x<pagec+1;x++) {
  var option = document.createElement("option");
  option.text = x+1;
  navbar.add(option);
}
gallerydiv.appendChild(navbar);
navbar.style.marginLeft='-'+navbar.offsetWidth/2+'px';
navbar.value=n+1;
navbar.addEventListener ("change", function() {
n=navbar.value-1;
page=n*step;
nextpost=(n+1)*step;
if (nextpost>len) {nextpost=len;}
gallerydiv.innerHTML="";
append();
});
for (x=page;x<nextpost;x++) {
if (list[x].match(/.*(webm|mp4)/)) {
 img=document.createElement("video");
 img.setAttribute("controls","controls");
img.poster=imgsrc[x];
img.src=list[x];

} else {img=document.createElement("img");
img.src=imgsrc[x];}
gallerydiv.appendChild(img);
if (step==1) {
img.style='position:absolute;object-fit:contain;width: 100%;height:100%;';
} else {img.style='width: 100%;';
var numdiv = document.createElement("div");
numdiv.style='text-align: center;background-color: #222;line-height:25px;font-size:25px;';
numdiv.textContent=x+1;
gallerydiv.appendChild(numdiv);}
}
}
}
}

function checktime() {
var date= new Date();
ctime=GM_getValue( "e621checktime");
if (!ctime) {
ctime=date.getTime()-600000;
}
var interval=(date.getTime()-ctime)/60000;
if (saved.subint <= interval) {
setTimeout(checkSubscription, 0);
}
}

function checkSubscription() {
if (Object.keys(subscription.pool).length>0) {
var suburl='https://e621.net/pools.json?search[order]=updated_at&search[id]='+Object.keys(subscription.pool)+"&_client="+useragent;
let xhr=new XMLHttpRequest();
xhr.open('GET', suburl, true);
xhr.onload=function (e) {
var cjson=xhr.responseText;
cjson=JSON.parse(cjson);
for (x=0 ; x < cjson.length;x++) {

if(cjson[x].post_ids.length!==subscription.pool[cjson[x].id].id.length) {
subscription.pool[cjson[x].id].newid=cjson[x].post_ids;
subscription.pool[cjson[x].id].new="yes";
}
if (x==cjson.length-1) {
var date= new Date();
GM_setValue( "e621checktime",date.getTime());
GM_setValue( "e621subByYusifx1", subscription);
checkpreview();
}
  }
};
xhr.send();
 }
}

function subscribe () {
var aaid=this.classList;
if (this.innerHTML=="Subscribe") {
let color=this;
color.style.background="#ccc";
this.innerHTML="Unsubscribe";
var surl="https://"+host+"/pools/"+aaid+".json?_client="+useragent;
let xhr=new XMLHttpRequest();
xhr.open('GET', surl, true);
xhr.onload=function (e) {
var sjson=xhr.responseText ;
sjson=JSON.parse(sjson);
subscription.pool[aaid]={};
subscription.pool[aaid].id=sjson.post_ids;
subscription.pool[aaid].newid=[];
subscription.pool[aaid].name=sjson.name.replace(/_/gi, " ");
GM_setValue( "e621subByYusifx1", subscription);
color.style.background="red";
};
xhr.send();
} else {
this.innerHTML="Subscribe";
this.style.background="green";
delete subscription.pool[aaid];
GM_setValue( "e621subByYusifx1", subscription);
}
}

function checkpreview () {
var gurl=[];
for (var poolid in subscription.pool) {
if (!subscription.pool[poolid].url) {
var preid=subscription.pool[poolid].id[0];
subscription.pool[poolid].preid=preid;
gurl.push(preid);
}
}
if (gurl.length>0) {
var ggurl="https://"+host+"/posts.json?tags=id%3A"+gurl.toString()+"&_client="+useragent;
let xhr=new XMLHttpRequest();
xhr.open('GET', ggurl, true);
xhr.onload=function (e) {
var pjson=xhr.responseText ;
pjson=JSON.parse(pjson);

var order =pjson.posts.map(a =>  Object.keys(subscription.pool).find( b => a.id===subscription.pool[b].preid));

for (x=0; x<pjson.posts.length;x++) {
subscription.pool[order[x]].url=pjson.posts[x].preview.url;
subscription.pool[order[x]].surl="/images/blacklisted-preview.png";
subscription.pool[order[x]].rating=pjson.posts[x].rating;
}
GM_setValue("e621subByYusifx1",subscription);
if (subbut.disabled==true) {
subdiv.remove();
subscribediv();

}
};
xhr.send();
}
}
checktime();
var checkt=setInterval(checktime,600000);


