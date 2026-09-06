(function(){
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  function initMobileNav(){
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileLinks');
    if(!toggle || !menu) return;

    toggle.addEventListener('click', function(){
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Copy contract address ---------- */
  function initClipboard(){
    var btn = document.getElementById('copyBtn');
    var value = document.getElementById('caValue');
    if(!btn || !value) return;

    btn.addEventListener('click', function(){
      var text = value.textContent.trim();

      function onSuccess(){
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(function(){
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      }

      function fallbackCopy(){
        var temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        try{
          document.execCommand('copy');
          onSuccess();
        }catch(err){
          btn.textContent = 'Copy failed';
          setTimeout(function(){ btn.textContent = 'Copy'; }, 1800);
        }
        document.body.removeChild(temp);
      }

      if(navigator.clipboard && window.isSecureContext){
        navigator.clipboard.writeText(text).then(onSuccess).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }

  /* ---------- Reveal sections once on scroll ---------- */
  function initReveal(){
    var items = document.querySelectorAll('.reveal');
    if(!items.length) return;

    if(!('IntersectionObserver' in window) || prefersReducedMotion){
      items.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function(el){ observer.observe(el); });
  }

  /* ---------- Footer year ---------- */
  function setYear(){
    var el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', function(){
    initMobileNav();
    initClipboard();
    initReveal();
    setYear();
  });
})();