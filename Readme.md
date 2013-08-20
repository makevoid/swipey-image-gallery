# UP Gallery (UPGal for friends...)
### create tablet reading/image viewing webapp in minutes!

*live demo: <http://upgal.mkvd.net>*


### Works in webkit browsers and more

- Chrome
- Safari
- MobileSafari (iPad)
- Android browser
- Firefox (no animations and scale at the moment, but it's an easy patch to add moz prefixed transitions)


### Features

*Browsing:*
use arrows button on the screen, keyboard arrows, swipe on tablet (future implementation)


*Zooming*
the zoom button is on the top-left corner, press it then swipe (drag) to move the zoomed view

you need to click and drag if you are not using a touch device (tablet)


---

uses CSS3 Transitions (webkitTransition) to animate the sliding / zooming

*no third party libraries used*, it's lighter, cleaner and more flexible! plain JS, yay!


[toadd: showterm + screenshots on how to use it]


to run it:

- clone/download the repo
- run: `python -m SimpleHTTPServer 3000` (or use a server like apache/nginx etc)
- visit <http://localhost:3000>


easily "deployable" online and included into a webview to create an iPad / Android reading or photo-viewing app!


see also other open source projects that use UP Gallery:

- <http://github.com/makevoid/upandcoming>


note: when you package the app for a device (for example with phonegap or just using a WebView) the image loading time will be few milliseconds, so there will be no flickering when switching to a not already loaded image

### Make it yours! Change the images!

The images are loaded from the *images* directory, you need to create thumbs as well (located in images/thumbs) I used symlinks (the same images) but for production you should create appropriate thumbs [*thumbs width* is now *80px*]

note: make sure they are JPGs wich names are zero-padded 01, 02, 03 ... 99

if you need more than 100 images look at the pad function in the coffee

that's it!

### Tinker more with it

for example: extract it in your own existing app!

1) go to index.html

2) search and replace "images" with your dir where are you going to put images

3) copy the CSS and the JS, make sure they are in the right order


and...

you can remove buttons (refresh, arrows, zoom) just removing the html code or a big `display: none` into Sass / CSS will do!

### Change Sass / Coffee and have your assets recompiled

Have it recompiled automatically via guard (guard watches when the source files for changes and automatically generates the css/javascript)

run:

    guard

if you don't have guard (or one of the others guard-plugin) install it/them with all the dependencies issuing:

    bundle install

guard-livereload is an optional dependency, you can remove it from the Gemfile (but it's nice to try and use!)

tip: guard-concat ensures your app will do only one request for all the js as they will be concatenated in one file (all.js)

### more infos:

The images are named like this so they can be easily sorted automatically by any server


### TODO:

- add swipe (when browsing) for tablets
- add mozTransitions for FireFox
- add oTransitions for Opera
- keep the images centered like in <http://shampy.it/foto_tagli/donna> - <https://github.com/makevoid/shampy> (needs fixing, test in browser)


have fun!
