(function($) {
  'use strict';

  function init() {

    // make sure scrolling is re-enabled after .navbar-menu closes
    toggleDocumentScrolling('on');

    FastClick.attach(document.body);
    var bLazy = new Blazy({});

    if ($(window).scrollTop() > 10) {
      $('.Navbar').addClass('is-opaque');
      $('.scroll-indicator').addClass('is-hidden');
    }

    // show scroll indicator
    setTimeout(function() {
      if ($(window).scrollTop() < 10) {
        $('.scroll-indicator').removeClass('is-hidden');
      }
    }, 5000);

    if (window.location.href.indexOf("careers") > -1) {
      renderJobBoard();
    }
  }

  // smoothscroll anchor links (need to replace w/ lib that uses requestAnimationFrame API for better perf)
  $(document).on('click', 'a[href*="#"]:not([href="#"])', function(e) {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        e.preventDefault();
      }
    }
  });

  // bypass iOS Safari's double-tap requirement on hidden links
  $(document).on('click touchend', '.Navbar-menu a', function(e) {
    var el = $(this);
    var link = el.attr('href');

    // check if blacklisted by Smoothstate, else load link normally
    if (!el.hasClass('no-smoothState')) {
      smoothState.load(link);
    } else {
      window.location = link;
    }
  });

  $(document).on('click', '.Navbar-toggle-menu', function(e) {
    e.preventDefault();
    toggleNavMenu();
  });

  // Apply opaque style to primary nav container when scrolling down
  $(window).on('scroll', $.throttle(150, function() {
    if ($(window).scrollTop() < 10) {
      $('.Navbar').removeClass('is-opaque');
    } else {
      $('.Navbar').addClass('is-opaque');
      $('.scroll-indicator').addClass('is-hidden');
    }
  }));

  function canSubmitContactForm() {
    var $inputs = $("[data-role='contact-form-inputs']");
    var contactFormInputs = {};
    var validForm = true;

    $inputs.each(function(input) {
      var $input = $(this);
      var property = $input.data('contact-form-input');
      var value = $input.val();
      if (($input.attr("required")) && (value.length === 0)) {
        validForm = false;
      }
      contactFormInputs[property] = value;
    });

    return (validForm) ? contactFormInputs : false;
  }

  function submitContactForm(formInputs) {
//    var $status = $("<p></p>");
//    var $form = $("[data-role='contact-form']");

    $.ajax({
      type: 'POST',
      url: '/contact_virta',
      data: formInputs,
      success: function(data) {

        if(data == "success"){
          contactFormSuccessfullySubmitted();
        }

        contactFormErroredOut();

//        $status.text(
//          'Thank you so much for your information. The email is on its way and someone will be in touch with you soon.'
//        );
//        $form.replaceWith($status);
      },
      error: function() {
          contactFormErroredOut();
//        $status.text(
//          'Sorry, something went wrong. Please try sending the form again.'
//        );
//        $form.replaceWith($status);
      }
    });
  }

  function bindEvents() {
    // Submit contact form and replace
    var submitBtn = $("button[data-role='contact-virta-submit']");
    submitBtn.on("click", function(event) {
      event.preventDefault();
      var submittedInputs = canSubmitContactForm();
      if (submittedInputs) {
        submitContactForm(submittedInputs);
      }
    });
  }

  function unbindEvents() {
    var submitBtn = $("button[data-role='contact-virta-submit']");
    submitBtn.off("click");
  }

  function contactFormSuccessfullySubmitted(){
    var $status = $("<p></p>");
    var $form = $("[data-role='contact-form']");
    $status.text('Thank you so much for your information. The email is on its way and someone will be in touch with you soon.');
    $form.replaceWith($status);
  }

  function contactFormErroredOut(){
    var $status = $("<p></p>");
    var $form = $("[data-role='contact-form']");
    $status.text('Sorry, something went wrong. Please try sending the form again.');
    $form.replaceWith($status);
  }

  function toggleNavMenu() {
    var $Navbar = $('.Navbar'),
      $NavbarToggle = $('.Navbar-toggle-menu'),
      $NavbarMenu = $('.Navbar-menu'),
      $Hamburger = $('.MenuButton');

    if ($NavbarMenu.hasClass('is-hidden')) {
      $NavbarMenu.removeClass('is-hidden');
      $Navbar.addClass('menu-is-visible');
      $Hamburger.addClass('is-active');
      toggleDocumentScrolling('off');

    } else {
      toggleDocumentScrolling('on');
      $NavbarMenu.addClass('is-hidden');
      $Navbar.removeClass('menu-is-visible');
      $Hamburger.removeClass('is-active');
    }
  }

  function toggleDocumentScrolling(state) {
    if (state == 'off') {
      $(document).on('scroll mousewheel touchmove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    } else {
      $(document).unbind('scroll mousewheel touchmove');
    }
  }

  // Rendering Job Board for career pages
  function renderJobBoard() {
    var jobs_json_url = 'https://api.greenhouse.io/v1/boards/virtahealth/embed/jobs';

    function renderJob(job) {
      var html = '<a class="no-smoothState u-flex-aligner-center" href=' + job.absolute_url + '><div>';
      html += '<div class="job-title">' + job.title + '</div>';
      html += '<div class="job-location">' + job.location.name + '</div>';
      html += '</div></a>';
      return html;
    }

    // Worker
    $.ajax({
      url: jobs_json_url,
    }).then(function(response) {
      var html = '';
      for (var i = 0; i < response.jobs.length; i++) {
        html += renderJob(response.jobs[i]);
      }
      $('#greenhouse_jobs_container').html(html);
    });
  }

  // Smoothstate config
  var smoothState = $('#page').smoothState({
    blacklist: '.no-smoothState',
    repeatDelay: 1000,
    onStart: {
      duration: 250, // Duration of our animation
      render: function($container) {
        // Add your CSS animation reversing class
        $container.addClass('is-exiting');

        // Restart your animation
        smoothState.restartCSSAnimations();
      }
    },
    onBefore: function() {
      unbindEvents();
    },
    onAfter: function() {
      // re-run init() after new page loads
      init();
      bindEvents();
    },
    onReady: {
      duration: 0,
      render: function($container, $newContent) {
        $container.removeClass('is-exiting');
        $container.html($newContent);
      }
    }
  }).data('smoothState');

  // Secret hiring message in browser console
  var consoleStyles = [
    'text-rendering: optimizeLegibility', 'font-smoothing: antialiased', 'padding: 0.3rem',
    'color: #ff5a5a', 'display: block', 'line-height: 1.6', 'text-align: center', 'font-size: 1rem'
  ].join(';');

  console.log(
    "%cExcited by the possibility of working alongside other passionate makers to help millions of people overcome chronic disease? You should join us: ",
    consoleStyles);

  console.log(
    "%chttp://virtahealth.com/careers", 'background: #2f3e49; color: #FFF; padding: 0.3rem; font-size: 1rem');

  init();
})(jQuery);
