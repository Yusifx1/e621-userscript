
var cpu = window.location.href,
loc= window.location.pathname,
body = document.querySelector ( '#top' ),
ids,name,url,a,l,span,count,json,pac,pools,page,id,p,fl,x,src,pc,purl,max,min,result;
var clist =""
var xhr = new XMLHttpRequest();
var useragent="\"User-Agent\",\"e621byYusifx1/0.95 userscript\""
var list=[]
var ext=[]
var act=0
var val={}
var mstyle='background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
var sstyle = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;max-height: 150px; overflow: auto;column-count:2;'; 	
var fncstyle='background-color: #9e5a00;color:white;font-size: 14px;border-radius: 8px;';
var saved
if (window.localStorage.getItem("main1")) {
saved=JSON.parse(window.localStorage.getItem("main1"))
} else {
saved =["pool-%id%_%name%/%count%_%md5%","[\\[\\]\\\\:?;*+/=<|>\"]",true,"-",true,false]
}

var div = document.createElement("div");
div.style='background-image: url("/packs/media/src/styles/images/hexagon/background-ea57599555451c53af1db0db4f5b2664.png");background-color: #102545; border-radius: 8px;;position: absolute;left: 20vw;width: 60vw;top: 10vh;visibility: hidden;zIndex: -1;'
body.appendChild(div);

var mb1 = document.createElement("span");
mb1.innerHTML="X"
div.appendChild(mb1);
mb1.style="float:right;display:inline-block;padding:2px 5px;"
mb1.addEventListener ("click", hide)

var header = document.createElement("H1")
header.innerHTML="Download and scrape settings"
header.style='padding: 15px'
div.appendChild(header);

var folder= document.createElement("H3");
folder.style='padding: 15px'
folder.innerHTML="Pool download name and direction "
div.appendChild(folder)

var inputfol = document.createElement("input");
inputfol.value=saved[0]
folder.appendChild(inputfol)

var avvar= document.createElement("span");
avvar.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;column-count:2;padding: 15px;';
avvar.style.padding="15px"
avvar.innerHTML="<strong>Static variables:</strong> <br>   %id% - id of pool  <br>%name% - name of pool <br>%creatorid% - creator id  <br>%category% - category of pool  <br>%creatorname% - name of creator  <br>%pc% - post count <br><br><br><br><br><br><br>"
avvar.innerHTML+="<strong>Changing variables:</strong> <br>%count% - current post (index of pool post) <br>%post_id% - id of post <br> <strong>File:</strong>  <br>%md5% - The md5 of the file <br>   %width% - image width <br>   %height% - image height <br>  <strong> Tags of post: <\strong> <br>%species% <br>%character% <br>%artist% <br>%copyright%  <br>%meta%"
div.appendChild(avvar)

var sym= document.createElement("H3");
sym.style='padding: 15px'
sym.innerHTML="Symbol to replace:  "
div.appendChild(sym)

var info= document.createElement("span");
info.style='background-color:#102545;display: block; font-size: 12px;border-radius: 8px;;padding: 15px;';
info.style.padding="15px"
info.innerHTML="<strong>Fill input field to replace illegal character for your OS. It make half-width to <\strong>ｆｕｌｌ－ｗｉｄｔｈ <br>For Windows - [/?<>\\:*|\\\"] <br> For Android is only [/], but if you use Firefox in android you should use [\\[\\]\\\\:?;*+/=<|>\\\"]  <br> You can make any character full-width. Just write character in bracket [anycharacter]. Some special character write with \\ (like \\ it will replace backslash). For more <a href = https://en.wikipedia.org/wiki/Filename#Reserved_characters_and_words>info </a>"
div.appendChild(info)

var inputsym = document.createElement("input");
inputsym.value=saved[1]
sym.appendChild(inputsym)

var rep = document.createElement("H3");
rep.style='padding: 15px'
rep.innerHTML="Replace \"_\" in name with space:  "
div.appendChild(rep)

var check = document.createElement("INPUT");
check.setAttribute("type", "checkbox");
check.checked=saved[2]
rep.appendChild(check)

var array= document.createElement("H3");
array.style='padding: 15px'
array.innerHTML="Connect variable with several value like tags:  "
div.appendChild(array)

var join = document.createElement("input");
join.value=saved[3]
array.appendChild(join)

var downset = document.createElement("H3");
downset.style='padding: 15px'
downset.innerHTML="Auto check if file installed and exist (for current browser)  "
div.appendChild(downset)

var check1 = document.createElement("INPUT");
check1.setAttribute("type", "checkbox");
check1.checked=saved[4]
downset.appendChild(check1)

var downset1 = document.createElement("H3");
downset1.style='padding: 15px'
downset1.innerHTML="Try find source from FA if file deleted (for tags use status:any or deleted)"
div.appendChild(downset1)

var check2 = document.createElement("INPUT");
check2.setAttribute("type", "checkbox");
check2.checked=saved[5]
downset1.appendChild(check2)


var mb = document.createElement("button");
mb.innerHTML = "settings";
body.appendChild(mb);
mb.style=mstyle
mb.style.float="right"
mb.addEventListener ("click", show)


var mb2= document.createElement("button");
mb2.innerHTML="Save"
div.appendChild(mb2);
mb2.addEventListener ("click", saveset)

var mb3= document.createElement("button");
mb3.innerHTML="default"
div.appendChild(mb3);
mb3.addEventListener ("click", reset)

function show () {
    div.style.visibility ="visible"
    div.style.zIndex = "99";

}

function hide () {
    div.style.visibility ="hidden"
    div.style.zIndex = "-1";

}

function saveset () {
saved=[]
saved[0]=inputfol.value
saved[1]=inputsym.value
saved[2]=check.checked
saved[3]=join.value
saved[4]=check1.checked
saved[5]=check2.checked
 window.localStorage.setItem("main1",JSON.stringify(saved))
}

function reset () {
saved=["pool-%id% %name%/%count%_%md5%","[\\[\\]\\\\:?;*+/=<|>\"]",true,"-",true,false]
window.localStorage.setItem("main1",JSON.stringify(saved))
}



if ( loc.match(/\/pools\/*/) ) {
var button = document.createElement("button");
button.innerHTML = "Download Pool";
body.appendChild(button);
button.style = mstyle
button.addEventListener ("click", pool )
onepage()
var button5 = document.createElement("button");
button5.innerHTML = "Scrape pool";
body.appendChild(button5);
button5.style = mstyle
button5.addEventListener ("click", scrape)
var input = document.createElement("input");
input.placeholder="Scrape/down from # post"
body.appendChild(input);
var input2 = document.createElement("input");
input2.placeholder="To # post"
body.appendChild(input2);
}
if ( loc == "/posts" ) {
onepage()
allpage()
}
function pool() {
if (window.confirm("Download pool?")) {
if (act==0) {
scrape()
}   
dpool()
}
}
function getid() {
if (  loc.match(/pools\/\d/)  ) {
url="https://e621.net" + loc + ".json";
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);

}
else{
loc=window.location.search
url="https://e621.net/pools.json"+loc
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
pools="Watch pools list, then write selected pool number in next screen:"
for ( x=0 ; x < json.length;x++) {
pools+="\n"+(x+1)+" )"
pools+=json[x].id+" - "
pools+=json[x].name.replace(/_/g,"")
}
if ( json.length==1 ) {
var select=1
} else {
alert(pools)
select=prompt( "select pool number", "1");
}
select=select-1
json=json[select]
}
val.name= json.name
if (saved[2]) {
val.name= val.name.replace(/_/gi, " ")
}
val.creatorid =json.creator_id
val.category = json.category
val.creatorname = json.creator_name

id=json.id;
val.id=id
pc=json.post_count
val.pc=pc
max=input2.value
min=input.value-1
body.removeChild(input)
body.removeChild(input2)
act=1
if (max=="") {max=pc}
if (min=="-1") {min=0}
pac=Math.ceil(pc/320)
ids= json.post_ids;
ids=ids.slice(min,max)
}
function getpl() {
var obj = []

if (cpu.includes("e926")) {
url="https://e621.net/posts.json?tags=rating:s+status:any+"
} else {url="https://e621.net/posts.json?tags=status:any+"}

  for (page=1;page<pac+1;page++) {
if ( ids.length <=100) {
url = url+"id:"+ids+"&limit=101";
pac=1
}else{
url = url+"pool:"+id+"&limit=320&page="+page;
}

button5.innerHTML = "Scraping page "+page;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);  
obj.push(...json.posts)   }
purl= ids.map(id => obj.find(post => post.id === id))
    purl = purl.filter(function (el) {   return el != null;
});
   
}

 
function geturl() {
	var x
for ( x=0 ; x < purl.length;x++) {

var e= purl[x].file.ext
var md5= purl[x].file.md5
var fl ="https://static1.e621.net/data/" + md5[0] + md5[1] + "/" + md5[2] + md5[3]+ "/" + md5 + "." + e
if (purl[x].flags.deleted) {

  l=purl[x].sources.join("\n")
fl="null"

a=l.match(/.*(png|gif|jpg|webm)/)
if (a) {

fl=a[0]
e=a[1]
}

//it not work in tampermonkey
if ( saved[5] =="true" && fl == "null" && l.match(/.*www.furaffinity.net\/view\/.*/)) {
var fa=l.match(/.*www.furaffinity.net\/view\/.*/)
xhr.open('GET', fa,false)
xhr.send()
  if (xhr.status != 200) { 
     
  } else { 
    
var page=xhr.responseText
if (page.match(new RegExp(/href="(.*)">Download<\/a>/))){
fl='https:' + page.match(new RegExp(/href="(.*)">Download<\/a>/))[1]
}
}; 
}

}
list.push(fl);
ext.push(e);
}
}

function dpool() {
var x=min+1
pc=list.length

var downname=saved[0]
downname=downname.replace(/\//gi,"folderslash")
downname=downname.replace(/%id%/gi, val.id).replace(/%name%/gi, val.name).replace(/%pool%/gi, val.pool).replace(/%creatorid%/gi, val.creatorid).replace(/%category%/gi, val.category).replace(/%creatorname%/gi, val.creatorname).replace(/%pc%/gi, val.pc)

var j =saved[3]
for (var i=0;i<list.length;i++) {
count = x.toString(10).padStart(3, "0")
    var url=list[i]
  var file=downname.replace(/%count%/gi,count).replace(/%md5%/gi,purl[i].file.md5 ).replace(/%width%/gi,purl[i].file.width ).replace(/%height%/gi,purl[i].file.height ).replace(/%post_id%/gi, purl[i].id ).replace(/%species%/gi, purl[i].tags.species.join(j)).replace(/%character%/gi, purl[i].tags.character.join(j)).replace(/%artist%/gi, purl[i].tags.artist.join(j)).replace(/%copyright%/gi, purl[i].tags.copyright.join(j)).replace(/%meta%/gi, purl[i].tags.meta.join(j))


file=fullw(file)
file=file.replace(/folderslash/gi, "\/")

var param = {active: saved[4],
url : url,
  filename : file+"."+ext[i]};
  if(chrome) { chrome.runtime.sendMessage(param);} 
	 else {  browser.runtime.sendMessage(param); }
    
x++
}
}


function allpage() {
    var obj=[]

val.name=window.location.search
var button3 = document.createElement("button");
button3.innerHTML = "Get all post links";
body.appendChild(button3);
button3.style = mstyle
button3.addEventListener ("click", function() {
if (window.location.search.length==0){var loc="?"
}else {loc=window.location.search};
page=1
var plimit = prompt("Please enter page count that you want. Like 3 for 3 page or any text like yiff time for all page (page=320 posts):", "all");
pc=320
while (pc==320) {
button3.innerHTML = "Scraping page "+page+"..."

if (cpu.includes("e926")) {
	
url="https://e926.net/posts.json"+loc+"&limit=320&page="+page
} else {
	url="https://e621.net/posts.json"+loc+"&limit=320&page="+page}


xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();

var json=JSON.parse(xhr.responseText) ;

obj.push(json.posts)
pc=json.posts.length

if (page==plimit) {pc="what you are doing here?"}
page++   }

purl= obj[0]



 geturl()
button3.style.visibility = 'hidden';
cleanlist()
spanal()
copyToClipboard()
save()
})}


function onepage() {
var button2 = document.createElement("button");
button2.innerHTML = "Get page post links";
body.appendChild(button2);
button2.style = mstyle
button2.addEventListener ("click", function() {
var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' )
if ( post != null ) { 	for ( x = 0; x < post.length; x++ ) {  	src = post [ x ].getAttribute ( 'data-file-url' );   	span.innerHTML += '<a href = "' + src + '">' + src + '</a><br>'; 	} 	
span.style = sstyle
body.appendChild ( span );
}   button2.style.visibility = 'hidden';
})}
function copyToClipboard() {
var button4= document.createElement("button");
button4.innerHTML = "Copy to clipboard";
body.appendChild(button4);
button4.style = fncstyle
button4.addEventListener ("click", function() {     
 var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value += clist;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
})
}
function scrape () {
getid()
getpl()
geturl()
button5.style.visibility = 'hidden';
cleanlist()
spanal()
copyToClipboard()
save()

}
function cleanlist() {
for (x=0;x<list.length;x++){   clist=list.join("\n")   }
}
function spanal() {
var button7= document.createElement("button");    
button7.innerHTML = "Show links ";
body.appendChild(button7);
button7.style = fncstyle
button7. addEventListener ("click", function() {
var span = document.createElement ( 'span' );
for (x=0;x<list.length;x++){
   span.innerHTML += '<a href = "' + list[x] + '">' + list[x] + '</a><br>';
}
span.style = sstyle         
body.appendChild ( span );
button7.style.visibility = 'hidden';
}) }
function save() {
var button6= document.createElement("button");    
button6.innerHTML = "Save links to file";
body.appendChild(button6);
button6.style = 'background-color: green;color:white;font-size: 14px;border-radius: 8px;';
button6.addEventListener ("click", function() {
var hiddenElement = document.createElement('a');
hiddenElement.href = 'data:attachment/text,' + encodeURI(clist);
hiddenElement.target = '_blank';
hiddenElement.download = val.name+".txt"
hiddenElement.click();
})
}

function fullw(aa) {
var re = new RegExp(saved[1] ,"g");
return aa.replace(re,s =>   String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));
}

