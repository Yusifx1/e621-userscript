// ==UserScript==
// @name         e621
// @version      0.9
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
ids,name,url,span,json,p,result,xhr;
if ( cpu.match(/^.*.e621.net\/pools\/*/) ) {
var button = document.createElement("button");
button.innerHTML = "Download Pool";
body.appendChild(button);
button.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button.addEventListener ("click", pool )
onepage() 
}  

if ( window.location.pathname == "/posts" ) { 
p=1

onepage() 
}

function pool() {
if (window.confirm("Download this pool?")) { 
  getid()
  dpool()
}
}


function getid() {
url="https://e621.net" + loc + ".json";
xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
name= json.name;
ids= json.post_ids;
}

function dpool() {
var i =1;
for  (var pid in ids) {
url = "https://e621.net/posts/" + ids[pid] + ".json";
xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.send();
json=xhr.responseText ;
json=JSON.parse(json);
var ext= "." + json.post.file.ext;
var durl= json.post.file.url;
var count = i + '';     while (count.length < 3) {         count = '0' + count;     }   
name = name.replace(/[*/<>?\\|&]/g, s =>
  String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));
var path= name;
GM_download(durl, path+ "/" + count + ext);
i++;
}
}


function onepage() {
var button2 = document.createElement("button");
button2.innerHTML = "Get page post links";
body.appendChild(button2);
button2.style = 'background-color: #00549e;color:white;font-size: 18px;border-radius: 8px;';
button2.addEventListener ("click", function() {
var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' ),
    x,src;

if ( post != null ) {
	for ( x = 0; x < post.length; x++ ) {
		src = post [ x ].getAttribute ( 'data-file-url' );

		span.innerHTML += '<a href = "' + src + '">' + src + '</a><br>';
	}
	span.style = 'background-color:#102545;display: block; font-size: 12px;border-radius: 8px;column-count:2;  max-height: 150px; overflow: auto;';
	body.appendChild ( span );
}
  
  });
}
 