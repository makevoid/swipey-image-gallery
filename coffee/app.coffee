# TODO:
#
# - detect double click to zoom and de-zoom

# confs (taken from ruby)

json = JSON.parse(ISSUES_JSON)

PATH = json.path
SIZE = json.size


# utils

llog = (log) ->
  debug = document.querySelector ".debug"
  debug.innerHTML += "#{log}<br>"

defer = (fn) ->
  setTimeout fn, 0

removeElement = (elem) ->
  # use .remove() when possible, will delete when Safari/MobileSafari will update the syntax?
  elem.parentNode.removeChild elem


EventFallback: (event, params) ->
  params = params || { bubbles: false, cancelable: false, detail: undefined };
  evt = document.createEvent 'EventFallback'
  evt.initCustomEven  event, params.bubbles, params.cancelable, params.detail
  evt


class Gallery
  zoomed: false
  size: SIZE

  constructor:  ->
    @idx = 0 # current index
    @images = []
    @window = new Window(this)
    this.fill_window()
    # this.bind_swipe()

  # init

  fill_window: ->


  # handlers

  handle_zmove_start: (evt) ->
    touch = evt.touches[0]
    @start_zoom_touch = evt

  handle_zmove_end: (evt) ->
    # console.log @start_zoom_touch
    end = evt.changedTouches[0]
    # console.log evt
    start = @start_zoom_touch
    x = end.pageX - start.pageX
    y = end.pageY - start.pageY
    console.log "zoom end", x, y


  handle_swipe: ->
    llog "swipe"
    this.next()

  handle_keyboard: (evt) ->
    this.prev() if evt.keyCode == 37
    this.next() if evt.keyCode == 39

  handle_thumbs_click: (evt) ->
    id = evt.target.dataset.id
    this.go_to parseInt(id)

  # actions

  # zoom

  scale_factor: "2, 2, 2"
  # percent of x and y movements (used when panning the scaled version)
  px: 0
  py: 0

  handle_zoom: ->
    if !@zoomed then this.zoom() else this.dezoom()
    @zoomed = !@zoomed

  zoom: ->
    img = document.querySelector ".main img"
    img.style.webkitTransform = "scale3d(#{this.scale_factor})"
    this.bind_movearound()

  dezoom: ->
    img = document.querySelector ".main img"
    img.style.webkitTransform = "scale3d(1, 1, 1)"
    this.unbind_movearound()
    @px = 0
    @py = 0
    this.remove_all_listeners img
    document.removeEventListener "mouseup", this.handle_mouseup

  handle_zdrag_start: (evt) ->
    # @drag_start = { x: evt.pageX, y: evt.pageY }
    @drag_start = evt

  handle_zdrag_end: (evt) ->
    return unless @drag_start
    dx = evt.x - @drag_start.x
    dy = evt.y - @drag_start.y
    px = dx / innerWidth  * 100
    py = dy / innerHeight * 100
    @px = px + @px
    @py = py + @py
    @px = Math.min 25, Math.max(-25, @px)
    @py = Math.min 25, Math.max(-25, @py)
    defer =>
      evt.target.style.webkitTransform = "scale3d(#{this.scale_factor}) translate3d(#{@px}%, #{@py}%, 0)"
    # console.log "moved", @px, @py

  create_event: (name, location) ->
    evt = new Event name
    evt.x = location.pageX
    evt.y = location.pageY
    evt

  handle_mouseup: (event) =>
    evt = this.create_event "zend", event
    img = document.querySelector ".main img"
    img.dispatchEvent evt

  bind_movearound: ->
    img = document.querySelector ".main img"
    # img.addEventListener "drag", this.movearound

    # img.addEventListener "dragstart",  this.handle_zdrag_start.bind this
    #   # evt.preventDefault() ?
    # img.addEventListener "dragend",  this.handle_zdrag_end.bind this

    # TODO: use mousedown e mousemove
    img.addEventListener "mousedown", (event) =>
      evt = this.create_event "zstart", event
      img.dispatchEvent evt

    document.addEventListener "mouseup", this.handle_mouseup

    img.addEventListener "dragstart", (event) =>
      event.preventDefault()

    # drag(ndrop) API is bugged, sorry

    # img.addEventListener "dragstart", (event) =>
    #   evt = this.create_event "zstart", event
    #   img.dispatchEvent evt
    #   # event.preventDefault() # ? # this removes the drag browser effect

    # img.addEventListener "dragend", (event) =>
    #   evt = this.create_event "zend", event
    #   img.dispatchEvent evt

    img.addEventListener "touchstart", (event) =>
      evt = this.create_event "zstart", event.touches[0]
      img.dispatchEvent evt

    img.addEventListener "touchend", (event) =>
      evt = this.create_event "zend", event.changedTouches[0]
      img.dispatchEvent evt


    img.addEventListener "zstart", this.handle_zdrag_start.bind this

    img.addEventListener "zend", this.handle_zdrag_end.bind this
    # img.r


  unbind_movearound: ->
    # removeEventListener

  movearound: (evt) ->
    # console.log "movearound", evt
    x = evt.pageX
    y = evt.pageY
    # console.log "moving", x, y
    # evt.target.style.webkitTransform = "translate3d(#{x}, #{y}, 0)"
    # evt.preventDefault()

  # move

  next: ->
    this.go_to @idx+1

  prev: ->
    this.go_to @idx-1

  go_to: (idx) ->
    return if @idx == idx
    return if idx < 0
    return if idx > @size
    @zoomed = false
    @px = 0
    @py = 0
    # console.log "switch to", idx+1
    # sanitize idx

    direction = "forward"

    if this.nearby(idx)
      @window.push_and_slide(idx)
    else
      @window.replace_window(idx)

    # async? (called inside window)
    @idx = idx

  # private

  # utils

  nearby: (idx) ->
    idx == @idx-1 || idx == @idx+1

  remove_all_listeners: (elem) ->
    copy = elem.cloneNode()
    elem.parentElement.appendChild copy
    # roperty_name duration timing_function delay;
    copy.style.opacity = 1
    removeElement elem


class Window
  images_dir: PATH

  constructor: (@gallery) ->

  # replace

  replace_window: (idx) ->
    images = document.querySelectorAll ".main img"
    for img in images
      removeElement img

    img = document.createElement "img"
    img.draggable = true
    img.dataset.id = idx
    img.src = "/#{this.images_dir}/#{this.pad idx+1}.jpg"

    this.gallery_elem().appendChild img
    img.style.opacity = 1

    img.style.webkitTransform = "translate3d(0, 0, 0)"

  # push_and_slide

  push_and_slide: (idx) ->
    this.push_image idx

  push_image: (idx) ->
    direction = this.direction idx

    img = document.createElement "img"
    img.draggable = true
    img.dataset.id = idx
    img.src = "/#{this.images_dir}/#{this.pad idx+1}.jpg"
    this.gallery_elem().appendChild img
    img.style.opacity = 1

    if direction == "next"
      # place on the right
      img.style.webkitTransform = "translate3d(100%, 0, 0)"
    else
      # place on the left
      img.style.webkitTransform = "translate3d(-100%, 0, 0)"

    this.slide direction, idx

  deferred_slide: (idx, percent) ->
    defer ->
      img = document.querySelector ".main img[data-id='#{idx}']"
      img.style.webkitTransform = "translate3d(#{percent}%, 0, 0)"

  slide: (direction, idx) ->
    next_id = if direction == "next" then idx-1 else idx+1
    position = if direction == "next" then -100 else 100
    this.deferred_slide next_id, position

    this.deferred_slide idx, 0

    this.remove_image next_id, direction

  remove_func: (idx) ->
    img = document.querySelector ".main img[data-id='#{idx}']"
    removeElement img
    # console.log "removed #{idx}", event

  remove_image: (idx) ->
    # images = document.querySelectorAll ".main img"
    # for img in images
    #   img.removeEventListener "webkitTransitionEnd", => this.remove_func(idx)
    #   console.log "remove listeners"

    # idx = @gallery.idx
    # console.log "will remove #{idx}"

    # this.delayed_remove remove_func
    img = document.querySelector ".main img"
    img.addEventListener "webkitTransitionEnd", => this.remove_func(idx)

  # private

  webkit_is_supported: ->
    true

  delayed_remove: (func) ->
    if this.webkit_is_supported()
      img = document.querySelector ".main img"
      img.addEventListener "webkitTransitionEnd", =>
        func()
    else
      setTimeout =>
         func()
      , 700

  gallery_elem: ->
    document.querySelector ".main"

  direction: (idx) ->
    if idx > @gallery.idx then "next" else "prev"

  pad: (num) ->
    s = "0" + num
    s.substr s.length-2


# main


domready ->

  gallery = new Gallery()
  window.gallery = gallery

  window.addEventListener "keydown", gallery.handle_keyboard.bind gallery

  thumbs = document.querySelectorAll ".thumbs img"
  for thumb in thumbs
    thumb.addEventListener "click", gallery.handle_thumbs_click.bind gallery
  # resize thumbs
  thumb_width = 80
  width = (thumb_width+5) * gallery.size
  thumbs_cont = document.querySelector ".thumbs"
  thumbs_cont.style.width = "#{width}px"

  prev = document.querySelector ".main .prev"
  prev.addEventListener "click", gallery.prev.bind gallery
  next = document.querySelector ".main .next"
  next.addEventListener "click", gallery.next.bind gallery
  zoom = document.querySelector ".main .zoom"
  zoom.addEventListener "click", gallery.handle_zoom.bind gallery

  #debug
  # gallery.zoom()

#

# failed attempt in using the low level api
# img = document.querySelector("img"); evt = new WebKitTransitionEvent("asd"); evt.cancelable = true; evt.currentTarget = img; evt.propertyName = "-webkit-transform"; evt.eventPhase = 2; evt.initEvent("asd"); evt