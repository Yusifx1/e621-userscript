var host=window.location.hostname,
loc= window.location.pathname,
topbody = document.querySelector ( '#top' ),
body=document.body,
ids,scrolldelay,cgp,url,select,a,l,img,span,count,json,pac,pools,page,id,p,x,src,pc,purl,max,min;
var clist ="";
var xhr = new XMLHttpRequest();
var useragent="\"User-Agent\",\"e621byYusifx1/1.2.1 userscript\"";
var list=[];
var sample=[];
var ext=[];
var act=0;
var val={};
var mstyle='background-color: #00549e;color:white;font-size: 18px;cursor: pointer;border-radius: 8px;';	
var sstyle = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;max-height: 150px; overflow: auto;column-count:2;color:blue;cursor:pointer'; 		
var fncstyle='background-color: #9e5a00;color:white;font-size: 14px;cursor: pointer;border-radius: 8px;';	
var saved={};
if (window.localStorage.getItem("e621downByYusifx1")) {
saved=JSON.parse(window.localStorage.getItem("e621downByYusifx1"));
if (!saved.name) {saved.name="pool-%id%_%name%/%count%_%md5%";}
if (!saved.sname) {saved.sname="set-%id%_%name%/%count%_%md5%";}
if (!saved.sym) {saved.sym="[\\[\\]\\\\:?;*+/=<|>\\\"]";}
if (!saved.check) {saved.check="true";}
if (!saved.join) {saved.join="-";}
if (!saved.check2) {saved.check2="false";}
if (!saved.check3) {saved.check3="false";}
if (!saved.res) {saved.res="Sample";}
if (!saved.step) {saved.step=10;}
if (!saved.slidespeed) {saved.slidespeed=2;}
if (!saved.scroll) {saved.scroll="Focus on image";}
} else {
reset();
}

function settings () {
mb.disabled=true;

var div = document.createElement("div");
div.style='background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;position: absolute;left: 20vw;width: 60vw;top: 10vh;padding: 15px;';
body.appendChild(div);
div.style.zIndex = "99";

var head=document.createElement("p");
head.innerHTML="E621 downloader (1.2.1)";
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

var downset = document.createElement("H3");
downset.innerHTML="Auto check if file installed and exist (for current browser)  ";

var check1 = document.createElement("input");
check1.setAttribute("type", "checkbox");
check1.checked=saved.check2;
downdiv.appendChild(downset).appendChild(check1);

var downset1 = document.createElement("H3");
downset1.innerHTML="Try find source from FA if file deleted (for tags use status:any)";

var check2 = document.createElement("input");
check2.setAttribute("type", "checkbox");
check2.checked=saved.check3;
downdiv.appendChild(downset1).appendChild(check2);

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
saved.sname=sinputfol.value;
saved.sym=inputsym.value;
saved.check=check.checked;
saved.join=join.value;
saved.check2=check1.checked;
saved.check3=check2.checked;
saved.res=selecte.value;
saved.step=stepin.value;
saved.slidespeed=slss.value;
saved.scroll=select2.value;
window.localStorage.setItem("e621downByYusifx1",JSON.stringify(saved));
}
}
var mb = document.createElement("button");
mb.innerHTML = "Settings";
document.getElementsByTagName("menu")[1].appendChild(mb);
mb.style='background-color: transparent;font-weight:bold;color: #b4c7d9;cursor: pointer;';
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
saved.sname="set-%id%_%name%/%count%_%md5%";
saved.sym="[\\[\\]\\\\:?;*+/=<|>\\\"]";
saved.check=true;
saved.join="-";
saved.check2=false;
saved.check3=false;
saved.res="Sample";
saved.step=10;
saved.slidespeed=2;
saved.scroll="Focus on image";
window.localStorage.setItem("e621downByYusifx1",JSON.stringify(saved));
}


if ( loc.match(/\/post_sets\/\d/) ) {
var gallery = document.createElement("button");
gallery.innerHTML = "Gallery";
topbody.appendChild(gallery);
gallery.style=mstyle;
gallery.style.float="right";
gallery.addEventListener ("click", function() { galdiv("set");});

var button = document.createElement("button");
button.innerHTML = "Download Set";
topbody.appendChild(button);
button.style = mstyle;
button.addEventListener ("click", pool );
var button5 = document.createElement("button");
button5.innerHTML = "Scrape set";
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


if ( loc.match(/\/pools\/*/) ) {
var gallery = document.createElement("button");
gallery.innerHTML = "Gallery";
topbody.appendChild(gallery);
gallery.style=mstyle;
gallery.style.float="right";
gallery.addEventListener ("click", function() { galdiv("pool");});

var button = document.createElement("button");
button.innerHTML = "Download Pool";
topbody.appendChild(button);
button.style = mstyle;
button.addEventListener ("click", pool );
if ( loc.match(/pools\/\d/) ) {
onepage();
}
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
gallery.addEventListener ("click", function() { galdiv("post");});
}
function pool() {
if (act==0) {
scrape();
}   
dpool();
}

function getid() {

if ( loc.match(/pools\/\d/) ) {
url="https://"+host+ loc + ".json";
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/1.2.1 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);

}else if ( loc.match(/\/post_sets\/\d/) ) {
url="https://"+host+ loc + ".json";
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/1.2.1 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
}
else{
loc=window.location.search;
url="https://"+host+"/pools.json"+loc;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/1.2.1 userscript");
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
function getpl() {
var obj = [];
url="https://"+host+"/posts.json?tags=status:any+";

  for (page=1;page<pac+1;page++) {
if ( ids.length <=100) {
url = url+"id:"+ids+"&limit=101";
pac=1;
}else{
if (loc.match(/\/post_sets\/\d/) ) {
url=url+"set:"+id+"&limit=320&page="+page;
} else {
url=url+"pool:"+id+"&limit=320&page="+page;
}
}
button5.textContent = "Scraping page "+page;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/1.2.1 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);  
obj.push(...json.posts);  }
purl= ids.map(id => obj.find(post => post.id === id));
    purl = purl.filter(function (el) {   return el != null;
});
   
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

if ( fl == "null" && saved.check3 ) {
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
if (smpl==null) {
if (purl[x].sample.has==true) {
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

var param = {active: saved.check2,
url : url,
  filename : file+"."+ext[i]};
  if(chrome) { chrome.runtime.sendMessage(param);} 
	 else {  browser.runtime.sendMessage(param); }
 
x++;
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
if (window.location.search.length==0){loc="?";
}else {loc=window.location.search;}
if ( window.location.pathname.match(/post_sets\/\d/) ) {
loc="?tags=set%3A";
loc+=window.location.pathname.slice(11);
}
val.name=fullw(val.name);
page=1;
var plimit = prompt("Please enter page count that you want. Like 3 for 3 page or any text like yiff time for all page (page=320 posts):", "all");
if (plimit !== null) {
pc=320;
while (pc==320) {
button3.textContent = "Scraping page "+page+"...";

url="https://"+host+"/posts.json"+loc+"&limit=320&page="+page;

xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/1.2.1 userscript");
xhr.send();

var json=JSON.parse(xhr.responseText) ;
obj.push(...json.posts);
pc=json.posts.length;

if (page==plimit) {pc="what you are doing here?";}
page++;  }

purl= obj;

 geturl();
act=2;
button3.style.visibility = 'hidden';
cleanlist();
spanal();
copyToClipboard();
save();
}});}


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
for (x=0;x<list.length;x++){ clist=list.join("\n"); }
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
div.style='width:100%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0, 0.8);position: fixed; top: 0; left: 0;vertical-align: middle;text-align: center;';
div.style.zIndex = "97";
var mb1 = document.createElement("button");
mb1.innerHTML="x";
div.appendChild(mb1);
mb1.style="right:0;position:fixed;background-color: transparent;color:#465254;font-size : 100px;";
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
var gallerydiv = document.createElement("div");
body.appendChild(gallerydiv);
watch();
gallerydiv.style='text-align: center;overflow-y: auto;overflow-x: hidden;width:80%; height:100%;background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: rgba(0, 0, 0, 0.8);position: fixed; top: 0; left: 10vw;';
gallerydiv.style.zIndex = "98";

function watch () {
var n=0;
gallerydiv.innerHTML="";
if (act==0 && cpos=="pool") {
scrape();
}
if (act==0 && cpos=="set") {
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
act=3;
}}}

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
setTimeout(function() {sslide();},2500);
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
setTimeout(function(){sslide();},1000);
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

if (step==1) {
img.style='position:absolute;object-fit:contain;width: 100%;height:100%;';
} else {img.style='width: 100%;';}
gallerydiv.appendChild(img);
}
}
}
}

