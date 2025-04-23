/*!functions*/
function checkDarkMode() {
  let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let storedMode = localStorage.getItem('darkMode');
  if ('enabled' === storedMode || (storedMode === null && prefersDark)) {
    document.documentElement.setAttribute('prefers-color-scheme', 'dark');
    localStorage.setItem('darkMode', 'enabled');
    return true;
  } else {
    document.documentElement.removeAttribute('prefers-color-scheme');
    localStorage.setItem('darkMode', 'disabled');
    return false;
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function updateImageWidths() {
  let imgWrappers = document.querySelectorAll('.fiu-galleryItem__img-wrapper');
  imgWrappers.forEach(item => {
    let picture = item.querySelector('picture');
    let width = picture.getBoundingClientRect().width;
    item.style.width = width + 'px';

    let parent = item.parentElement;
    let siblings = parent.children;

    Array.from(siblings).forEach(sibling => {
      sibling.style.width = width + 'px';
    });
  });
}

function loadMedia(mediaTag) {
  let selector, mediaEls;
  selector = selectors[mediaTag];
  mediaEls = document.querySelectorAll(selector);

  mediaEls.forEach(function(media) {
    function mediaOnLoad() {
      setTimeout(function () {
        media.style.opacity = '1';
      }, 150);
    }

    if (media.localName === 'video') {
      media.onloadeddata = () => {
        mediaOnLoad()
      };
    } else {
      if (media.complete) {
        mediaOnLoad()
      } else {
        media.onload = mediaOnLoad
      }
    }
  });
}

function monitorImageInsertion() {
  const intervalId = setInterval(function() {
    const imageLinks = document.querySelectorAll('.fiu-galleryAd__imageLink');
    imageLinks.forEach(function(media) {
      const img = media.querySelector('img');
      if (img) {
        loadMedia('img');
        clearInterval(intervalId);
      }
    });
  }, 3);
}

/*!ini*/
let visits = localStorage.getItem('pageVisits') ? parseInt(localStorage.getItem('pageVisits')) + 1 : 1;
let el, scheme, isDarkMode;

if (visits == 1) {
  localStorage.setItem('pageVisits', '2');
  location.reload();
} else {
  localStorage.setItem('pageVisits', visits++);
}

if (visits === 1) {
  localStorage.setItem('darkMode', 'disabled');
  document.documentElement.removeAttribute('prefers-color-scheme');
}

isDarkMode = checkDarkMode();

document.addEventListener('DOMContentLoaded', function () {
  selectors = {
    img: 'img',
    video: 'video'
  };

  loadMedia('img');
  loadMedia('video');

  monitorImageInsertion();

  if (!getCookie('settings_gallery_layout_type')) {
    setCookie('settings_gallery_layout_type', 'stack', 365);
  }

  let interval = setInterval(() => {
    let galleryCell = document.querySelector('.fiu-gallery__cell');

    if (galleryCell.classList.contains('fiu-gallery__cell--ready')) {
      let galleryMasonry = document.querySelector('.fiu-gallery--masonry');
      let computedStyle = getComputedStyle(galleryMasonry);
      let currentHeight = computedStyle.height;
      let currentHeightValue = parseFloat(currentHeight);
      galleryMasonry.style.setProperty('--height', `${currentHeightValue}px`);
      setTimeout(function () {
        galleryMasonry.style.height = '';
        clearInterval(interval);
      }, 100)

      updateImageWidths();

      let sampleLists = document.querySelectorAll('.fiu-gallery--masonry .fiu-sampleList');

      setTimeout(function() {
        sampleLists.forEach(function (element) {
          element.style.display = 'block';
          element.style.visibility = 'hidden';
          element.style.height = `max-content`;
          let height = element.offsetHeight;
          element.style.height = `${height}px`;
          element.style.display = '';
          element.style.visibility = '';

          let container = document.createElement('div');
          container.classList.add('fiu-sampleList__container');

          while (element.firstChild) {
            container.appendChild(element.firstChild);
            container.dataset.height = height;
          }

          element.appendChild(container);
        });
      }, 100);

      let galleryCells = document.querySelectorAll('.fiu-gallery__cell');

      galleryCells.forEach(function(cell) {
        cell.addEventListener('mouseenter', function() {
          let sampleList = cell.querySelector('.fiu-sampleList__container');
          if (sampleList) {
            let dataHeight = sampleList.getAttribute('data-height');
            sampleList.style.height = `${dataHeight}px`;
          }
        });
      
        cell.addEventListener('mouseleave', function() {
          let sampleList = cell.querySelector('.fiu-sampleList__container');
          if (sampleList) { 
            sampleList.style.height = '0';
          }
        });
      });

      clearInterval(interval);
    }
  }, 1);

  let showUse__core = document.querySelector('.fiu-showUse');

  if (showUse__core) {
    let showUse__text = showUse__core.querySelector('.fiu-showUse__text');
    let showUse__content = showUse__core.querySelector('.fiu-content');
    showUse__content.appendChild(showUse__text);
    setTimeout(function() {
      showUse__text.style.opacity = '1'
    }, 1)
  }

    let branding = document.querySelector('.fiu-header__branding');
    let branding_img = document.querySelector('.fiu-header__branding img');

    if (branding_img) {
      let svg = `<svg style="width: 140px" viewBox="0 0 140 110"><path style="fill: rgba(var(--color-text) / 1)" d="M.375002.932h21.458v9.072999h-12.025v14.184999h9.504999v9.000999h-9.504999v18.504997H.375002V.932ZM24.079002,26.35C24.079002,6.908001,30.416002.5,38.552.5c8.137001,0,14.473999,6.408,14.473999,25.85,0,19.370001-6.336998,25.778002-14.473999,25.778002-8.135998-.000004-14.472998-6.408001-14.472998-25.778002ZM43.521002,26.421999c0-9.359999-1.223999-16.417-4.969002-16.417-3.672001,0-4.967999,7.057001-4.967999,16.417,0,9.361002,1.296001,16.778002,4.967999,16.778002,3.745003,0,4.969002-7.417,4.969002-16.778002ZM65.872,25.558001v26.138002h-8.497002V.932h4.969002l13.537003,23.545999V.932h8.497002v50.763999h-4.104004l-14.402-26.137999ZM88.071005,10.005V.932h25.922005v9.072999h-8.064003v41.691004h-9.648003V10.005h-8.209999ZM114.927,49.464001l2.880997-7.993c1.728996.863998,5.255997,1.944,8.064003,1.944s4.176003-1.439999,4.176003-3.599998c0-6.480999-13.895996-15.625-13.895996-27.002001,0-9.721,6.625-12.313,12.673996-12.313,3.744003,0,7.199005,1.08,8.712997,1.8l-2.809006,8.425c-1.729004-.648-3.960999-1.08-5.544998-1.08-2.160004,0-3.600998,1.08-3.600998,3.168,0,6.192,14.041,15.912999,14.041,27.002,0,8.208-5.184998,12.241001-13.609001,12.241001-4.031998-.000004-8.065994-1.008003-11.088997-2.592003ZM.591002,57.728996h9.505v50.764H.591002v-50.764ZM24.872001,82.353996v26.139h-8.497v-50.764h4.969l13.537001,23.544998v-23.544998h8.497002v50.764h-4.104l-14.402002-26.139ZM57.192003,89.050995v-31.321999h9.505001v32.474998c0,7.127998.431999,10.513,4.032997,10.513,3.599998,0,4.030998-3.384003,4.030998-10.513v-32.474998h9.217003v31.320999c0,14.187004-3.097,20.450005-13.393997,20.450005-10.369003.000992-13.392002-6.119003-13.392002-20.449005ZM86.886999,106.260994l2.881996-7.991997c1.726997.862999,5.255997,1.943001,8.063004,1.943001s4.176003-1.439003,4.176003-3.599998c0-6.481003-13.896004-15.625-13.896004-27.001999,0-9.721001,6.623001-12.313004,12.671997-12.313004,3.744003,0,7.201004,1.080002,8.713997,1.800003l-2.809998,8.426003c-1.728996-.648003-3.959-1.080002-5.542999-1.080002-2.160004,0-3.601997,1.080002-3.601997,3.167999,0,6.191002,14.041,15.912003,14.041,27.001999,0,8.207001-5.185997,12.239998-13.609001,12.239998-4.030991-.000008-8.063995-1.008003-11.087997-2.592003ZM115.335005,57.728996h21.457993v9.071999h-12.024002v11.520996h9.072006v9.071999h-9.071999v12.457001h12.456001v8.641998h-21.889999v-50.763992Z"/></svg>`;
      let tempDiv = document.createElement("div");
      tempDiv.innerHTML = svg;
      let svgElement = tempDiv.firstChild;
      branding_img.replaceWith(svgElement);
      branding.style.opacity = '1';

    }
});