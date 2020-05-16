// ==UserScript==
// @name         e621
// @version      0.95
// @homepageURL https://github.com/Yusifx1/e621-userscript/
// @downloadURL        https://github.com/Yusifx1/e621-userscript/releases/latest/download/e621.user.js
// @description  e621 pool and etc. downloader and parser
// @author        Yusifx1
// @match        https://e621.net/*
// @exclude   https://e621.net/pools
// @grant        GM_download
// ==/UserScript==

var cpu = window.location.href,
loc= window.location.pathname,
body = document.querySelector ( '#top' ),
ids,name,url,span,json,pac,page,id,p,fl,x,src,count,pc,purl,max,min,result;
var clist =""
var xhr = new XMLHttpRequest();
var useragent="\"User-Agent\",\"e621byYusifx1/0.95 userscript\""
var list=[]
var ext=[]
var act=0
if ( cpu.match(/^.*.e621.net\/pools\/*/) ) {
var button = document.createElement("button");
button.innerHTML = "Download Pool";
body.appendChild(button);
button.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button.addEventListener ("click", pool )
onepage()
var button5 = document.createElement("button");
button5.innerHTML = "Scrape pool";
body.appendChild(button5);
button5.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button5.addEventListener ("click", scrape) 

var input = document.createElement("input");
input.placeholder="Scrape/down from # post"
body.appendChild(input); 
var input2 = document.createElement("input");
input2.placeholder="To # post"
body.appendChild(input2); 
}  

if ( window.location.pathname == "/posts" ) { 
onepage()
allpage()
}

function pool() {
if (window.confirm("Download this pool?")) {
if (act==0) {
scrape()
}
  dpool()
}
}

function getid() {
url="https://e621.net" + loc + ".json";
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
name= json.name;
id=json.id;
pc=json.post_count;
pac=Math.ceil(pc/320) 
ids= json.post_ids;
}

function getpl() {
var obj = []
  for (page=1;page<pac+1;page++) {
button5.innerHTML = "Scraping page "+page;
url = "https://e621.net/posts.json?tags=pool:"+id+"&limit=320&page="+page;
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
 obj.push(...json.posts)
  }

purl= ids.map(id => obj.find(post => post.id === id))
    purl = purl.filter(function (el) {
  return el != null;
});
    
    var x
for ( x=0 ; x < purl.length;x++) {
if (x >= min && x <= max) {
var fl = purl[x].file.url
var e= purl[x].file.ext
list.push(fl);
ext.push(e);
}
}
}


function dpool() {
var i=0
pc=1+pc
name= name.replace(/_/gi, " ")
name = name.replace(/[*/<>:?\\|&]/g, s =>
  String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));

for (x=1;x<pc;x++) {
count = x.toString(10).padStart(3, "0")

   var url=list[i]
GM_download( url , name+ "/" + count +"."+ ext[i]);

    i++
}
}

function allpage() {
name=window.location.search
var button3 = document.createElement("button");
button3.innerHTML = "Get all post links";
body.appendChild(button3);
button3.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button3.addEventListener ("click", function() {
if (window.location.search.length==0){var loc="?"

}else {loc=window.location.search};
page=1
var plimit = prompt("Please enter page count that you want. Like 3 for 3 page or any text like yiff time for all page (page=320 posts):", "all");
pc=320

while (pc==320) {
button3.innerHTML = "Scraping page "+page+"..."

url="https://e621.net/posts.json"+loc+"&limit=320&page="+page
var xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.setRequestHeader("User-Agent","e621byYusifx1/0.95 userscript");
xhr.send();
var json=xhr.responseText ;
json=JSON.parse(json);

var vurl = json.posts.map(posts => posts.file.url);
list=vurl.concat(list)
pc=vurl.length
if (page==plimit) {pc="what you are doing here?"} 
page++
  }
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
button2.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button2.addEventListener ("click", function() {
var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' )
    

if ( post != null ) {
	for ( x = 0; x < post.length; x++ ) {
		src = post [ x ].getAttribute ( 'data-file-url' );

		span.innerHTML += '<a href = "' + src + '">' + src + '</a><br>';
	}
	span.style = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;column-count:2;  max-height: 150px; overflow: auto;';
	body.appendChild ( span );
}
  button2.style.visibility = 'hidden';
})}

function copyToClipboard() {
var button4= document.createElement("button");
button4.innerHTML = "Copy to clipboard";
body.appendChild(button4);
button4.style = 'background-color: #9e5a00;color:white;font-size: 14px;border-radius: 8px;';
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
max=input2.value-1
min=input.value-1
body.removeChild(input)
body.removeChild(input2)
act=1
if (max=="-1") {max=9999}

getid()
getpl()
button5.style.visibility = 'hidden';
cleanlist()
spanal()
copyToClipboard()
save()
}

function cleanlist() {
for (x=0;x<list.length;x++){
  clist+="\n"+list[x]
  }
}

function spanal() {
var button7= document.createElement("button");
   button7.innerHTML = "Show links ";
body.appendChild(button7);
button7.style = 'background-color: #9e5a00;color:white;font-size: 14px;border-radius: 8px;';
button7. addEventListener ("click", function() {
var span = document.createElement ( 'span' );
for (x=0;x<list.length;x++){
   span.innerHTML += '<a href = "' + list[x] + '">' + list[x] + '</a><br>';
} 
    span.style = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;max-height: 150px; overflow: auto;column-count:2;'
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
hiddenElement.download = name+".txt"
hiddenElement.click();
})
}