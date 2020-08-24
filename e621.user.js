// ==UserScript==
// @name         e621
// @version      1.0.0
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

var cpu = window.location.href,
host=window.location.hostname,
loc= window.location.pathname,
topbody = document.querySelector ( '#top' ),
body=document.body,
ids,name,url,a,l,span,count,json,pac,pools,page,id,p,fl,x,src,pc,purl,max,min,result;
var clist ="";
var xhr = new XMLHttpRequest();
var useragent="\"User-Agent\",\"e621byYusifx1/0.95 userscript\"";
var list=[];
var sample=[];
var ext=[];
var act=0;
var val={};
var mstyle='background-color: #00549e;color:white;font-size: 18px;cursor: pointer;border-radius: 8px;';	
var sstyle = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;max-height: 150px; overflow: auto;column-count:2;color:blue;cursor:pointer'; 		
var fncstyle='background-color: #9e5a00;color:white;font-size: 14px;cursor: pointer;border-radius: 8px;';	
var smstyle='background-color: #eee; color: #444; cursor: pointer; padding: 18px;width: 100%; border: none; outline: none;';
var saved =GM_getValue( "e621downByYusifx1", "null");
if (saved=="null") {
reset();}

function settings () {

var div = document.createElement("div");
div.style='background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;position: absolute;left: 20vw;width: 60vw;top: 10vh;padding: 15px;';
body.appendChild(div);

    div.style.zIndex = "99"

var head=document.createElement("p");
head.innerHTML="E621 downloader (1.0.1)"
div.appendChild(head);

var mb1 = document.createElement("button");
mb1.innerHTML="x";
div.appendChild(mb1);
mb1.style="position: absolute;color:white;background-color: transparent;top:0;right: 5px;font-size: 30px;";
mb1.addEventListener ("click", function() { div.remove();});
	
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

var header = document.createElement("H1");
header.innerHTML="Gallery settings";
header.style='padding: 15px';
gsdiv.appendChild(header);

var label= document.createElement("H3");
label.innerHTML="Image quality ";

var select = document.createElement("select");
 var option = document.createElement("option");
    option.text = "Sample";
    select.appendChild(option);
option = document.createElement("option");
    option.text = "Source";
    select.appendChild(option);
select.value=saved.res;
gsdiv.appendChild(label).appendChild(select);


var stept= document.createElement("H3");
stept.innerHTML="Post count per gallery page:  ";

var stepin= document.createElement("input");
stepin.value=saved.step;
gsdiv.appendChild(stept).appendChild(stepin);


var header2 = document.createElement("H1");
header2.innerHTML="Download and scrape settings";
header2.style='padding: 15px';
downdiv.appendChild(header2);
	
var folder= document.createElement("H3");
folder.innerHTML="Pool download name and direction ";

var inputfol = document.createElement("input");
inputfol.value=saved.name;
downdiv.appendChild(folder).appendChild(inputfol);

var avvar= document.createElement("span");
avvar.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;column-count:2;padding: 15px;';
avvar.innerHTML="<strong>Static variables:</strong> <br>   %id% - id of pool  <br>%name% - name of pool <br>%category% - category of pool   <br>%pc% - post count <br><br>";
avvar.innerHTML+="<strong>Changing variables:</strong> <br>%count% - current post (index of pool post) <br>%post_id% - id of post <br><br><br> <strong>File:</strong>  <br>%md5% - The md5 of the file <br>   %width% - image width <br>   %height% - image height <br><br>  <strong> Tags of post: </strong> <br>%species% <br>%character% <br>%artist% <br>%copyright%  <br>%meta%";
downdiv.appendChild(avvar);

var sym= document.createElement("H3");
sym.innerHTML="Symbol to replace:  ";

var inputsym = document.createElement("input");
inputsym.value=saved.sym;
downdiv.appendChild(sym).appendChild(inputsym);

var info= document.createElement("span");
info.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;;padding: 15px;';
info.innerHTML="<strong>Fill input field to replace illegal character for your OS. It make half-width to <\strong>ｆｕｌｌ－ｗｉｄｔｈ <br>For Windows - [/?<>\\:*|\\\"] <br> For Android you should use [\\[\\]\\\\:?;*+/=<|>\\\"]  <br> You can make any character full-width. Just write character in bracket [anycharacter]. Some special character write with \\ (like \\\\, it will replace backslash). For more <a href = https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words>info </a>";
downdiv.appendChild(info);

var rep = document.createElement("H3");
rep.innerHTML="Replace \"_\" in name with space:  ";

var check = document.createElement("INPUT");
check.setAttribute("type", "checkbox");
check.checked=saved.check;
downdiv.appendChild(rep).appendChild(check);

var array= document.createElement("H3");
array.innerHTML="Connect variable with several value like tags:  ";

var join = document.createElement("input");
join.value=saved.join;
downdiv.appendChild(array).appendChild(join);

var mb2= document.createElement("button");
mb2.innerHTML="Save";
div.appendChild(mb2);
mb2.addEventListener ("click", saveset);

var mb3= document.createElement("button");
mb3.innerHTML="default";
div.appendChild(mb3);
mb3.addEventListener ("click", reset);

function saveset () {
saved={};
saved.name=inputfol.value;
saved.sym=inputsym.value;
saved.check=check.checked;
saved.join=join.value;
saved.check2=false;
saved.check3=false;
saved.res=select.value;
saved.step=stepin.value;
 GM_setValue("e621downByYusifx1",saved);
}
}

var mb = document.createElement("button");
mb.innerHTML = "settings";
topbody.appendChild(mb);
mb.style=mstyle;
mb.style.float="right";
mb.addEventListener ("click", settings);

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
saved.sym="[\\[\\]\\\\:?;*+/=<|>\"]";
saved.check=true;
saved.join="-";
saved.check2=false;
saved.check3=false;
saved.res="Sample";
saved.step=10;
GM_setValue("e621downByYusifx1",saved);
}

if ( loc.match(/\/pools\/*/) ) {
var gallery = document.createElement("button");
gallery.innerHTML = "Gallery";
topbody.appendChild(gallery);
gallery.style=mstyle;
gallery.style.float="right";
gallery.addEventListener ("click", function() { galdiv("pool")});

var button = document.createElement("button");
button.innerHTML = "Download Pool";
topbody.appendChild(button);
button.style = mstyle;
button.addEventListener ("click", pool );
onepage();
var button5 = document.createElement("button");
button5.innerHTML = "Scrape pool";
topbody.appendChild(button5);
button5.style = mstyle;
button5.addEventListener ("click", scrape);
var input = document.createElement("input");
input.placeholder="Scrape/down from # post";
topbody.appendChild(input);
var input2 = document.createElement("input");
input2.placeholder="To # post";
topbody.appendChild(input2);
}
if ( loc == "/posts" ) {
onepage();
allpage();
var gallery = document.createElement("button");
gallery.innerHTML = "Gallery";
topbody.appendChild(gallery);
gallery.style=mstyle;
gallery.style.float="right";
gallery.addEventListener ("click", function() { galdiv("post")});
}
function pool() {
if (window.confirm("Download pool?")) {
if (act==0) {
scrape();
}   
dpool();
}
}
function getid() {
if ( loc.match(/pools\/\d/) ) {
url="https://"+host+ loc + ".json";
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);

}
else{
loc=window.location.search;
url="https://"+host+"/pools.json"+loc;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
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
var select=1;
} else {
alert(pools);
select=prompt( "select pool number", "1");
}
select=select-1;
json=json[select];
}
val.name= json.name;
if (saved.check) {
val.name= val.name.replace(/_/gi, " ");
}
val.creatorid =json.creator_id;
val.category = json.category;
val.creatorname = json.creator_name;

id=json.id;
val.id=id;
pc=json.post_count;
val.pc=pc;
max=input2.value;
min=input.value-1;
topbody.removeChild(input);
topbody.removeChild(input2);
act=1;
if (max=="") {max=pc}
if (min=="-1") {min=0}
pac=Math.ceil(pc/320);
ids= json.post_ids;
ids=ids.slice(min,max);
}
function getpl() {
var obj = [];
url="https://"+host+"/posts.json?tags=status:any+"

  for (page=1;page<pac+1;page++) {
if ( ids.length <=100) {
url = url+"id:"+ids+"&limit=101";
pac=1;
}else{
url = url+"pool:"+id+"&limit=320&page="+page;
}

button5.textContent = "Scraping page "+page;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);  
obj.push(...json.posts);  }
purl= ids.map(id => obj.find(post => post.id === id))
    purl = purl.filter(function (el) {   return el != null;
});
   
}

 
function geturl() {
	var x;
list=[]
ext=[]
sample=[]

for ( x=0 ; x < purl.length;x++) {


var e= purl[x].file.ext;
var md5= purl[x].file.md5;
var smpl=purl[x].sample.url;
var fl ="https://static1.e621.net/data/" + md5[0] + md5[1] + "/" + md5[2] + md5[3]+ "/" + md5 + "." + e
if (purl[x].flags.deleted) {

  l=purl[x].sources.join("\n");
fl="null";

a=l.match(/.*(png|gif|jpg|webm|mp4)/);
if (a) {
fl=a[0];
e=a[1];
}

if ( fl == "not work in userscript" && saved.check3 ) {
if (l.match(/.*www.furaffinity.net\/view\/.*/)) {
var fa=l.match(/.*www.furaffinity.net\/view\/.*/);
xhr.open('GET', fa,false);
xhr.send();
  if (xhr.status !== 200) { 

     fl="Error"+xhr.status;
  } else { 
    
var page=xhr.responseText;
if (page.match(new RegExp(/href="(.*)">Download<\/a>/))){
fl='https:' + page.match(new RegExp(/href="(.*)">Download<\/a>/))[1];
}
}
}
}

}
if (smpl=="null") {smpl=fl}
sample.push(smpl);
list.push(fl);
ext.push(e);
}
}

function dpool() {
var x=min+1;
pc=list.length;

var downname=saved.name
downname=downname.replace(/\//gi,"folderslash");
downname=downname.replace(/%id%/gi, val.id).replace(/%name%/gi, val.name).replace(/%pool%/gi, val.pool).replace(/%creatorid%/gi, val.creatorid).replace(/%category%/gi, val.category).replace(/%creatorname%/gi, val.creatorname).replace(/%pc%/gi, val.pc)

var j =saved.join
for (var i=0;i<list.length;i++) {
count = x.toString(10).padStart(3, "0");
    var url=list[i];
  var file=downname.replace(/%count%/gi,count).replace(/%md5%/gi,purl[i].file.md5 ).replace(/%width%/gi,purl[i].file.width ).replace(/%height%/gi,purl[i].file.height ).replace(/%post_id%/gi, purl[i].id ).replace(/%species%/gi, purl[i].tags.species.join(j)).replace(/%character%/gi, purl[i].tags.character.join(j)).replace(/%artist%/gi, purl[i].tags.artist.join(j)).replace(/%copyright%/gi, purl[i].tags.copyright.join(j)).replace(/%meta%/gi, purl[i].tags.meta.join(j))


file=fullw(file);
file=file.replace(/folderslash/gi, "\/");
GM_download( url , file+"."+ext[i]);
 
    
x++
}
}


function allpage() {
    var obj=[];

val.name=window.location.search;
var button3 = document.createElement("button");
button3.innerHTML = "Get all post links";
topbody.appendChild(button3);
button3.style = mstyle;
button3.addEventListener ("click", function() {
if (window.location.search.length==0){var loc="?";
}else {loc=window.location.search}
page=1;
var plimit = prompt("Please enter page count that you want. Like 3 for 3 page or any text like yiff time for all page (page=320 posts):", "all");
if (plimit !== null) {
pc=320;
while (pc==320) {
button3.textContent = "Scraping page "+page+"...";

url="https://"+host+"/posts.json"+loc+"&limit=320&page="+page

xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();

var json=JSON.parse(xhr.responseText) ;
obj.push(...json.posts);
pc=json.posts.length;

if (page==plimit) {pc="what you are doing here?"}
page++   }

purl= obj;


 geturl();
act=2
button3.style.visibility = 'hidden';
cleanlist();
spanal();
copyToClipboard();
save();
}})}


function onepage() {
var button2 = document.createElement("button");
button2.innerHTML = "Get page post links";
topbody.appendChild(button2);
button2.style = mstyle;
button2.addEventListener ("click", function() {
var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' );
span.style=sstyle;
if ( post !==null ) { 	for ( x = 0; x < post.length; x++ ) {  	
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
})
}
function scrape () {
getid();
getpl();
geturl();
button5.style.visibility = 'hidden';
cleanlist();
spanal();
copyToClipboard();
save();

}
function cleanlist() {
for (x=0;x<list.length;x++){   clist=list.join("\n")   }
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
})
}

function spanclick() {

var div=document.createElement("span");
div.style='width:100%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0, 0.8);position: fixed; top: 0; left: 0;vertical-align: middle;text-align: center;';
div.style.zIndex = "97";
var mb1 = document.createElement("button");
mb1.innerHTML="x";
div.appendChild(mb1);
mb1.style="right:0;position:fixed;background-color: transparent;color:#465254;font-size : 100px;";
mb1.addEventListener ("click", function () {div.remove()});
var Aaa=this.href;
var img;
if (Aaa.includes('webm')) {
 img=document.createElement("video");
 img.setAttribute("controls","controls");
var poster =this.href.replace(/\/data/g,"\/data\/sample").replace(/.webm/g,".jpg");
img.poster=poster
}else {
img=document.createElement("img");
}
img.src=this;
img.style='position:absolute;top:0; left:0; right:0;bottom:0;margin:auto;max-width: 100%;max-height: 100%;';
div.appendChild(img);
body.appendChild(div);
return false}

function fullw(aa) {
var re = new RegExp(saved.sym ,"g");
return aa.replace(re,s =>   String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));
}


function galdiv (cpos) {
var gallerydiv = document.createElement("div");
gallerydiv.style='text-align: center;overflow-y: auto;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;position: fixed;left: 10vw;width: 80vw;top:5vh;';
gallerydiv.style.zIndex=98;
body.appendChild(gallerydiv);
var watchpool = document.createElement("button");
if (cpos=="pool") {
watchpool.innerHTML="watch pool";
} else {watchpool.innerHTML="watch post";}
watchpool.style='background-color:#00549e; cursor: pointer;padding: 14px 16px;';
gallerydiv.appendChild(watchpool);
watchpool.addEventListener ("click", watch);
gallery.style.visibility ="hidden";

var galcl= document.createElement("button");
galcl.innerHTML="x";
gallerydiv.appendChild(galcl);
galcl.style="position: absolute;right:0;background-color: transparent;color:#465254;font-size : 30px;";
galcl.addEventListener ("click", function () {
gallery.style.visibility ="visible";
gallerydiv.remove()});

function watch () {
var n=0
gallerydiv.innerHTML="";
if (act==0 && cpos=="pool") {
scrape();
}

if (cpos=="post" && act ==0) {
var ps=document.querySelectorAll ( '.post-preview' );
if ( ps !== null ) { 	
for ( x = 0; x < ps.length; x++ ) {  	
src = ps[x].getAttribute('data-file-url');
var ssmp=ps[x].getAttribute('data-large-file-url');
list.push(src);
sample.push(ssmp);
act=3
}}}

gallerydiv.style.height="100%";
gallerydiv.style.top=0;
var imgsrc=list;
if ( saved.res=="Sample" ) {
imgsrc= sample;
}


var galc = document.createElement("button");
galc.innerHTML="x";
body.appendChild(galc);
galc.style="color:#465254;background-color: transparent;position:fixed;right: 0;top:0;font-size : 10vw;";
galc.style.zIndex = "98";
galc.addEventListener ("click", function () {
galc.remove();
gallerydiv.remove();
gallery.style.visibility ="visible";
right.remove();
left.remove();
});

var step=saved.step;
var len=imgsrc.length;
var pagec=Math.floor(len/step);
if (pagec*step==len) {pagec--}
var page=0;
var nextpost=step;
if (len<step) {nextpost=len}
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


function galnavleft () {
n--
gallerydiv.innerHTML="";
 page=n*step;
nextpost=(n+1)*step;
if (page<0) {n=pagec
page=n*step
nextpost=len;
if (page==len) {page=page-step}
}
if (nextpost>len) {nextpost=len}
append();
}

function galnavright () {
n++
gallerydiv.innerHTML="";
 page=n*step;
nextpost=(n+1)*step;
if (page>=len) {n=0;
page=0;
nextpost=step}
if (nextpost>len) {nextpost=len}
append();
}


append();
function append () {
var navbar = document.createElement("span");
navbar.style='height:30px;white-space: nowrap;position:fixed;display:block; font-size: 20px;border-radius: 6px;height: 30px; overflow:auto;color:white;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #152f56; width: 80vw;';
navbar.style.zIndex=98;
for (x=0;x<pagec+1;x++) {
var pagebut = document.createElement("button");
pagebut.textContent=x+1;
pagebut.style='width: 30px;background-color: transparent;color:#fff;'
if (n==x) {pagebut.disabled = true;
pagebut.style='background-color: #102545;'}
navbar.appendChild(pagebut);
pagebut.addEventListener ("click", function() { n=this.innerHTML-1;
page=n*step
nextpost=(n+1)*step;
if (nextpost>len) {nextpost=len}
gallerydiv.innerHTML="";
append()
});
}
gallerydiv.appendChild(navbar);
var aaaa= document.createElement("button");
aaaa.style='width: 80vw;background-color:#152f56;font-size:20px; height:30px;';
aaaa.innerHTML="loading..."
gallerydiv.appendChild(aaaa)
for (x=page;x<nextpost;x++) {
if (list[x].includes('webm')) {
 img=document.createElement("video");
 img.setAttribute("controls","controls");
img.poster=imgsrc[x]
img.src=list[x];
} else {var img=document.createElement("img");
img.src=imgsrc[x];}
img.style='width: 100%;';
if (step==1) {img.style='width: 100%;position:absolute;top:0; left:0; right:0;bottom:0;margin:auto;';}
gallerydiv.appendChild(img);
}
}
}
}
