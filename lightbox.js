(function(){
    var tags='tulane';
    var script=document.createElement('script');
    script.src = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=cb&tags='+tags;
    document.head.appendChild(script);
})();

// callback
function cb(data){
    if (data.stat == "fail"){
        document.getElementById('container').innerHTML += '<p>error: '+data.code+'</p>';
    } else {
        console.log(data);
        for (var i=0; i<data.items.length; i++){
            var imgUrl = data.items[i].media.m,
                imgAlt = data.items[i].title,
                img = '<img src="'+imgUrl+'" alt="'+imgAlt+'">';
            var imgWrapper = document.createElement('div');
            imgWrapper.className = "image";
            imgWrapper.innerHTML += img;
            document.getElementById('container').appendChild(imgWrapper);
        }
    }
}



function rmClass(el, cNm){
    el.className = el.className.replace(new RegExp('(^|\\b)' + cNm.split(' ').join('|') + '(\\b|$)', 'gi'), ' ').trim();
}

// when image is clicked
var parent = document.querySelector('#container');
parent.addEventListener('click', function (e) {
    e.preventDefault();
    var target = e.target;
    while (target != parent) {
        if (target && target.className == "image") {
            var img = target.getElementsByTagName('img')[0],
                src = img.getAttribute('src') || "",
                alt = img.getAttribute('alt') || "";
            openLightbox(img, src, alt);
        }
        target = target.parentNode;
    }
});

document.body.addEventListener('click', function(e){
    var t = e.target;
    if (!t) return false;

    if (t.className === 'lightbox-close') {
        closeLightbox();
    }

    if (t.className === 'lightbox-next') {
        next();
    }

    if (t.className === 'lightbox-prev') {
        prev();
    }
});

// display selected image in lightbox view
function openLightbox(el, src, alt, cls) {
    cls = cls || "";
    var lastFocus = '';

    if (!document.getElementById('lightbox')) {
        var o = document.createElement('figure');
        o.setAttribute('id', 'lightbox');
        o.setAttribute('index', '0');
        document.body.appendChild(o);
    }

    var overlay = document.getElementById('lightbox');

    if (lastFocus === "") {
        this.lastFocus = document.activeElement;
    }

    var curr = document.getElementsByClassName('lightbox-curr');
    for (var i = 0; i < curr.length; i++) {
        rmClass(curr[i], 'lightbox-curr');
    }

    el.className += " " + 'lightbox-curr';

    var img = '<img class="' + cls + '" src="' + src + '" alt="' + alt + '">',
        cap = '<div class="lightbox-caption">' + alt + '</div>',
        closeB = '<button role="close" class="lightbox-close">' + 'Close' + '</button>',
        nextB = '<button rel="next" class="lightbox-next">' + 'Next' + '</button>',
        prevB = '<button rel="prev" class="lightbox-prev">' + 'Prev' + '</button>',
        ctrls = '<div class="lightbox-ctrl">' + nextB + prevB + closeB + '</div>';

    overlay.innerHTML = img + cap + ctrls;

    rmClass(overlay, 'lightbox-hidden');
    overlay.setAttribute("index", "0");
    overlay.focus();

    rmClass(overlay.getElementsByTagName('img')[0], cls);
}

// close the lightbox view and return to the grid view
function closeLightbox() {
    document.getElementById('lightbox').className += 'lightbox-hidden';
    document.body.style.top = "";
    document.body.style.left = "";
    this.lastFocus.focus();
    this.lastFocus = "";
}

// show next image
function next() {
    var curr = document.getElementsByClassName('lightbox-curr')[0] || document.getElementsByClassName('container')[0].getElementsByTagName('img')[0];

    if (!curr.parentNode.nextElementSibling) { return false; }
    var nextEl = curr.parentNode.nextElementSibling.getElementsByTagName('img')[0];

    var nextSrc = nextEl.getAttribute('src'),
        nextAlt = nextEl.getAttribute('alt');
    openLightbox(nextEl, nextSrc, nextAlt, 'lightbox-to-next');
}

// show previous image
function prev() {
    var container = document.getElementsByClassName('container')[0],
        curr = document.getElementsByClassName('lightbox-curr')[0] || container.getElementsByTagName('IMG')[container.getElementsByTagName('img').length - 1];

    if(!curr.parentNode.previousElementSibling){ return false; }
    var prevEl = curr.parentNode.previousElementSibling.getElementsByTagName('img')[0];

    var prevSrc = prevEl.getAttribute('src'),
        prevAlt = prevEl.getAttribute('alt');
    openLightbox(prevEl, prevSrc, prevAlt, 'lightbox-to-prev');
}