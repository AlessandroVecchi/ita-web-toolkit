import $ from 'jquery'
import Headroom from 'headroom.js'
import debounce from 'throttle-debounce/throttle'

// Headroom for fixed sticky header

const myElement = document.querySelector('header')

const opts = {
  // vertical offset in px before element is first unpinned
  offset: 0,
  // you can specify tolerance individually for up/down scroll
  tolerance: {
    up: 20,
    down: 10
  },
  // css classes to apply
  classes: {
    // when element is initialised
    initial: 'Headroom',
    // when scrolling up
    pinned: 'Headroom--pinned',
    // when scrolling down
    unpinned: 'Headroom--unpinned',
    // when above offset
    top: 'Headroom--top',
    // when below offset
    notTop: 'Headroom--not-top',
    // when at bottom of scoll area
    bottom: 'Headroom--bottom',
    // when not at bottom of scroll area
    notBottom: 'Headroom--not-bottom'
  },
  // element to listen to scroll events on, defaults to `window`
  scroller: window,
  // callback when pinned, `this` is headroom object
  onPin: function() {},
  // callback when unpinned, `this` is headroom object
  onUnpin: function() {},
  // callback when above offset, `this` is headroom object
  onTop: function() {},
  // callback when below offset, `this` is headroom object
  onNotTop: function() {},
  // callback when at bottom of page, `this` is headroom object
  onBottom: function() {},
  // callback when moving away from bottom of page, `this` is headroom object
  onNotBottom: function() {}
}

let headroom = null

if (myElement) {
  headroom = new Headroom(myElement, opts)
  headroom.init()
}

/*
 *	Make space when using fixed header.
 *
 *		The no-js alternative is to set up body padding inside CSS
 *	 	assuming you know the exact header height in pixel
 *	 	(expanded and minimized for all viewport width)
 */
const headroomFixed = '.Headroom--fixed'

if ($('.' + opts.classes.initial).is(headroomFixed)) {
  const INTERVAL = 250

  let windowWidth = $(window).width()

  // Needs to be here due to CSS transition (see on Safari)
  let headerHeight = $(headroomFixed).height()

  const _adjustPadding = function() {
    const paddingTop = headerHeight

    $('body').css({
      paddingTop: paddingTop + 'px'
    })
  }

  // Set up padding on page load
  $(document).ready(() => {
    $(headroomFixed).css({
      position: 'fixed',
      top: 0
    })
    _adjustPadding()
  })

  // Make padding respond to window resize
  $(window).resize(debounce(INTERVAL, function() {
    const newWindowWidth = $(window).width()
    const height = $(headroomFixed).height()
    // Android browser triggers a resize event on scroll to top
    // so we check for changes in window width
    if (newWindowWidth !== windowWidth) {
      windowWidth = newWindowWidth
      headerHeight = height
      setTimeout(_adjustPadding, INTERVAL)
    }
  }))

  $(headroomFixed).on('transitionend', debounce(INTERVAL, function() {
    const height = $(this).height()
    if (headerHeight < height) {
      // This happens *only* after a resize
      // _and_ when scrolling to top
      headerHeight = height
      _adjustPadding()
    }
  }))

}

/*
 *  Toggle search-form visibility for mobile
 */
$('.js-Header-search-trigger').click((e) => {
  $('.js-Header-search-trigger').each((i, el) => {
    const $el = $(el)
    if ('true' === $el.attr('aria-hidden')) {
      $el.attr('aria-hidden', 'false')
      $el.removeClass('u-hiddenVisually')
    } else {
      $el.attr('aria-hidden', 'true')
      $el.addClass('u-hiddenVisually')
    }
  })
  $($(e.target).attr('aria-controls')).toggleClass('is-active')
})

export default {
  Headroom,
  headroom
}
