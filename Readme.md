# UP Gallery (UPGal for friends...)
### create tablet reading/image viewing webapp in minutes!

*live demo: <http://upgal.mkvd.net>*

[toadd: showterm + screenshots on how to use it]


to run it:

- clone/download the repo
- cd into public
- run: `python -m SimpleHTTPServer 3000` (or use a server like apache/nginx etc)
- visit <http://localhost:3000>


easily "deployable" online and included into a webview to create an iPad / Android reading or photo-viewing app!


see also other open source projects that use UP Gallery:

- <http://github.com/makevoid/upandcoming>

### Make it yours! Change the images!

The images are loaded from the *images* directory, you need to create thumbs as well (located in images/thumbs) I used symlinks (the same images) but for production you should create appropriate thumbs [*thumbs width* is now *80px*]

note: make sure they are JPGs wich names are zero-padded 01, 02, 03 ... 99

if you need more than 100 images look at the pad function in the coffee

that's it!

### Tinker more with it

for example: extract it in your own existing app!

1) go to public/index.html

2) search and replace "images" with your dir where are you going to put images

3) copy the CSS and the JS, make sure they are in the right order


and...

you can remove buttons (refresh, arrows, zoom) just removing the html code or a big `display: none` into Sass / CSS will do!

### more infos:

The images are named like this so they can be easily sorted automatically by any server


have fun!