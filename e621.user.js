// ==UserScript==
// @name         e621
// @version      0.8
// @homepageURL https://github.com/Yusifx1/e621-userscript/
// @downloadURL        https://github.com/Yusifx1/e621-userscript/releases/latest/download/e621.user.js
// @description  e621 pool and etc. downloader and parser
// @author        Yusifx1
// @match        https://e621.net/pools*
// @grant        GM_download
// ==/UserScript==
var button = document.createElement("button");
button.innerHTML = "Download Pool";
var body = document.querySelector ( '#top' );
body.appendChild(button);
button.addEventListener ("click", function() {
var pool= window.location.pathname ;
var url="https://e621.net" + pool + ".json";
var xhr = new XMLHttpRequest();
xhr.open('GET', url, false);
xhr.send();
var rjson=xhr.responseText ;
var json=JSON.parse(rjson);
var name= json.name;
var ids= json.post_ids;
alert(name);
var i =1;
for  (var pid in ids) {
var purl = "https://e621.net/posts/" + ids[pid] + ".json";
var pxhr = new XMLHttpRequest();
pxhr.open('GET', purl, false);
pxhr.send();
var rpjson=pxhr.responseText ;
var pjson=JSON.parse(rpjson);
var ext= "." + pjson.post.file.ext;
var durl= pjson.post.file.url;
var count = i + '';     while (count.length < 3) {         count = '0' + count;     }   
name = name.replace(/[*/<>?\\|&]/g, s =>
  String.fromCharCode(s.charCodeAt(0) + 0xFF00 - 0x20));
var path= name
GM_download(durl, path+ "/" + count + ext);
i++;
}
});
var button2 = document.createElement("button");
button2.innerHTML = "Get post links";
body.appendChild(button2);
button2.addEventListener ("click", function() {

var	post = document.querySelectorAll ( '.post-preview' ),
span = document.createElement ( 'span' ),
    x,src;



if ( post != null ) {
	for ( x = 0; x < post.length; x++ ) {
		src = post [ x ].getAttribute ( 'data-file-url' );

		span.innerHTML += '<a href = "' + src + '">' + src + '</a><br>';
	}
	span.style = 'display: inline-block; column-gap: 5px; column-count: 3; max-height: 200px; overflow: auto;';
	body.appendChild ( span );
}
  
  });