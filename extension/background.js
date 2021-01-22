if (chrome) {
    chrome.runtime.onMessage.addListener(function (arg, sender, sendResponse) {
        onmessage(arg, sender, sendResponse);
    });
} else {
    browser.runtime.onMessage.addListener(function (arg, sender, sendResponse) {
        onmessage(arg, sender, sendResponse);
    });
}

function onmessage(arg, sender, sendResponse) {
    if (arg.type == "xhr") {
        var xhr = new XMLHttpRequest();
        var x, list = [],
            ext = [],
            sample = [],
            purl = arg.arg,
            check = arg.fa;
        for (x = 0; x < purl.length; x++) {
            var e = purl[x].file.ext;
            var md5 = purl[x].file.md5;
            var smpl = purl[x].sample.url;
            var fl = "https://static1.e621.net/data/" + md5[0] + md5[1] + "/" + md5[2] + md5[3] + "/" + md5 + "." + e;
            if (purl[x].flags.deleted) {
                var l = purl[x].sources.join("\n");
                fl = "null";
                a = l.match(/.*(\.png|\.gif|\.jpg|\.webm|\.mp4|twimg\.com).*/);
                if (a) {
                    fl = a[0];
                    e = a[1];
                }
                if (fl == "null" && check) {
                    if (l.match(/.*www.furaffinity.net\/view\/.*/)) {
                        var fa = l.match(/.*www.furaffinity.net\/view\/.*/);
                        xhr.open('GET', fa, false);
                        xhr.send();
                        if (xhr.status !== 200) {
                            fl = "Error" + xhr.status;
                        } else {
                            var page = xhr.responseText;
                            if (page.match(new RegExp(/href="(.*)">Download<\/a>/))) {
                                fl = 'https:' + page.match(new RegExp(/href="(.*)">Download<\/a>/))[1];
                            }
                        }
                    }
                }
            }
            if (smpl == null) {
                if (purl[x].sample.has == true && !purl[x].flags.deleted) {
                    smpl = "https://static1.e621.net/data/sample/" + md5[0] + md5[1] + "/" + md5[2] + md5[3] + "/" + md5 + ".jpg";
                } else {
                    smpl = fl;
                }
            }
            sample.push(smpl);
            list.push(fl);
            ext.push(e);
        }
        sendResponse({
            file: list,
            ext: ext,
            smp: sample
        });
        return true;
    } else {
        for (let i = 0; i < arg.url.length; i++) {
            if (arg.active == false) {
                if (chrome) {
                    chrome.downloads.download({
                        url: arg.url[i],
                        filename: arg.filename[i]
                    });
                } else {
                    browser.downloads.download({
                        url: arg.url[i],
                        filename: arg.filename[i]
                    });
                }
            } else {
                if (chrome) {
                    chrome.downloads.search({
                        state: "complete",
                        exists: true,
                        query: [arg.url[i]]
                    }, function (downloadItems) {
                        if (downloadItems.length == 0) {
                            chrome.downloads.download({
                                url: arg.url[i],
                                filename: arg.filename[i]
                            });
                        }
                    });
                } else {
                    browser.downloads.search({
                        state: "complete",
                        exists: true,
                        query: [arg.url[i]]
                    }, function (downloadItems) {
                        if (downloadItems.length == 0) {
                            browser.downloads.download({
                                url: arg.url[i],
                                filename: arg.filename[i]
                            });
                        }
                    });
                }
            }
        }
    }
}