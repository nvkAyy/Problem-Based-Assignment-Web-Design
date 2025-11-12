// Two movie objects for Netflix-style showcase
const movies = [
  {
    id: 'm1',
    title: 'Jujutsu Kaisen: Hidden Inventory',
    year: 2025,
    genre: 'Anime · Action',
    runtime: '120m',
    rating: '8.0',
    poster: 'images/Poster.jpg',
    backdrop: 'images/jujutsu-kaisen-1920x1080-24389.png',
    overview: `In a world where cursed spirits lurk in the shadows, the responsibility of protecting humanity falls on the shoulders of powerful Jujutsu sorcerers. Jujutsu Kaisen: Hidden Inventory / Premature Death – The Movie takes audiences back to the past, revealing the untold story of Satoru Gojo and Suguru Geto during their days as students at Tokyo Jujutsu High.

    Assigned with a dangerous mission, Gojo and Geto must guard a young girl named Riko Amanai, who is destined to become the Star Plasma Vessel. Their task: safely escort her to Master Tengen before assassins and curse users can claim her life. But as enemies close in and ideals are tested, the bond between Gojo and Geto begins to fracture, setting the stage for the tragic downfall of a friendship that would shape the fate of the Jujutsu world.

    With breathtaking animation, intense battles, and emotional storytelling, this film explores the roots of one of anime’s most powerful sorcerers and the origins of a villain who would later change everything.`,
    trailer: 'Trailer1.mp4'
  },
  {
    id: 'm2',
    title: 'F1: The Movie',
    year: 2025,
    genre: 'Sport · Drama',
    runtime: '130m',
    rating: '8.2',
    poster: 'images/s-l1200.jpg',
    backdrop: 'images/Brad-Pitt-F1-Poster-070524-fe9add0efa85450297b5f1d208ca9b79.jpg',
    overview: `Former Formula One prodigy whose career was derailed by a devastating crash at the 1993 Spanish Grand Prix. Thirty years later, Sonny is drawn back into the world of F1 when his old teammate Rubén Cervantes asks him to help save the struggling Expensify APXGP Mercedes team. With only nine races left in the season, Sonny must mentor a cocky rookie, Joshua Pearce, and confront his own past to secure a win that could save the team.`,
    trailer: 'F1® The Movie ｜ Main Trailer.mp4'
  },
  {
    id: 'm3',
    title: 'Boboiboy The Movie 2',
    year: 2019,
    genre: 'Animation · Adventure · Family',
    runtime: '100m',
    rating: '7.4',
    poster: 'images/3650bb9d24b9a8588618bf368ba7e312.png',
    backdrop: 'images/wp4607061.png',
    overview: `This story follows a boy named Boboiboy who can control natural elements — light, leaves, fire, water, earth, wind, and lightning. Together with his friends, each gifted with their own elemental powers, Boboiboy must stop alien forces plotting to steal those powers for evil purposes. As the threat grows, the team learns to combine their strengths, face personal doubts, and protect their world from destruction.`,
    trailer: 'BoBoiBoy_Movie_2_OFFICIAL_TRAILER_In_Cinemas_August_8!.mp4'
  }
];

// DOM refs
const heroBackdrop = $('#heroBackdrop')[0];
const heroPoster = $('#heroPoster')[0];
const heroTitle = $('#heroTitle')[0];
const heroMeta = $('#heroMeta')[0];
const heroOverview = $('#heroOverview')[0];
const heroReadMore = $('#heroReadMore')[0];
const playBtn = $('#playBtn')[0];
const moreBtn = $('#moreBtn')[0];
const carouselRow = $('#carouselRow')[0];

const infoModalEl = $('#infoModal')[0];
const infoModal = new bootstrap.Modal(infoModalEl);
const modalTitle = $('#modalTitle')[0];
const modalBody = $('#modalBody')[0];
const modalPlay = $('#modalPlay')[0];

// ✅ Trailer modal refs
const trailerModalEl = $('#trailerModal')[0];
const trailerModal = new bootstrap.Modal(trailerModalEl);
const trailerContainer = document.querySelector('#trailerModal .modal-body .ratio');

// Track the currently active hero movie
let currentHeroMovie = null;

// Render cards
function renderCards(list){
  if (!carouselRow) return;
  $(carouselRow).empty();

  list.forEach(m => {
    const col = $(`
      <div class="col-12 col-sm-6 col-md-4 mb-3">
        <div class="movie-card">
          <img class="movie-thumb" src="${m.poster}" alt="${m.title}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div>
                <div class="card-title">${m.title}</div>
                <div class="card-sub">${m.year} • ${m.genre}</div>
              </div>
              <div class="text-warning fw-bold">${m.rating}</div>
            </div>

            <p class="card-overview" id="overview-${m.id}">${m.overview}</p>
            <button class="read-more btn-read-card" data-id="${m.id}">Read more</button>

            <div class="mt-2">
              <button class="btn btn-sm btn-light btn-play me-2">▶ Play</button>
              <button class="btn btn-sm btn-outline-light btn-info">More</button>
            </div>
          </div>
        </div>
      </div>
    `);

    // attach events
    col.find('.movie-card').on('click', () => setHero(m));
    col.find('.btn-info').on('click', e => {
      e.stopPropagation();
      openInfo(m);
    });
    col.find('.btn-play').on('click', e => {
      e.stopPropagation();
      openTrailer(m);
    });

    $(carouselRow).append(col);
  });

  // wire up read-more buttons
  $('.btn-read-card').off('click').on('click', readMoreHandler);
}

function readMoreHandler(e){
  const btn = e.currentTarget;
  const id = $(btn).data('id');
  const p = $(`#overview-${id}`);
  if (!p.length) return;
  const expanded = p.toggleClass('expanded').hasClass('expanded');
  $(btn).text(expanded ? 'Read less' : 'Read more');
  if (expanded) p[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Set hero content
function setHero(movie){
  currentHeroMovie = movie;
  if (movie.backdrop) heroBackdrop.src = movie.backdrop;
  if (movie.poster) heroPoster.src = movie.poster;
  heroTitle.textContent = movie.title || '';
  heroMeta.textContent = `${movie.year || ''} • ${movie.genre || ''} • ${movie.runtime || ''} • ${movie.rating || ''}/10`;
  heroOverview.textContent = movie.overview || '';
  if (movie.overview && movie.overview.length > 300) {
    $(heroReadMore).show().text('Read more');
    $(heroOverview).removeClass('expanded');
  } else {
    $(heroReadMore).hide();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hero read more toggle
$(heroReadMore).on('click', () => {
  const expanded = $(heroOverview).toggleClass('expanded').hasClass('expanded');
  $(heroReadMore).text(expanded ? 'Read less' : 'Read more');
  if (expanded) heroOverview.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Hero buttons
$(moreBtn).on('click', e => {
  e.preventDefault();
  if (currentHeroMovie) openInfo(currentHeroMovie);
});

$(playBtn).on('click', e => {
  e.preventDefault();
  if (currentHeroMovie) openTrailer(currentHeroMovie);
});

// Info modal
function openInfo(movie){
  modalTitle.textContent = movie.title;
  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-4">
        <img src="${movie.poster}" alt="${movie.title}" class="img-fluid rounded">
      </div>
      <div class="col-md-8">
        <p class="mb-1"><strong>Year:</strong> ${movie.year}</p>
        <p class="mb-1"><strong>Genre:</strong> ${movie.genre}</p>
        <p class="mb-1"><strong>Runtime:</strong> ${movie.runtime}</p>
        <p class="mb-1"><strong>Rating:</strong> ${movie.rating}/10</p>
        <p class="mt-2">${movie.overview}</p>
      </div>
    </div>
  `;

  modalPlay.onclick = () => openTrailer(movie);

  infoModal.show();
}

// ✅ Trailer modal logic
function openTrailer(movie){
  if (!movie.trailer) return;

  trailerContainer.innerHTML = ''; // clear previous

  if (movie.trailer.includes('youtube.com')) {
    trailerContainer.innerHTML = `
      <iframe src="${movie.trailer}?autoplay=1"
              title="Trailer video" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;
  } else {
    trailerContainer.innerHTML = `
      <video width="100%" controls autoplay>
        <source src="${movie.trailer}" type="video/mp4">
      </video>
    `;
  }

  trailerModal.show();
}

// Reset trailer when closed
trailerModalEl.addEventListener('hidden.bs.modal', () => {
  trailerContainer.innerHTML = '';
});

// Initialize
renderCards(movies);
setHero(movies[0]);

// Contact modal logic
(function() {
  const contactModalEl = $('#contactModal')[0];
  if (!contactModalEl) return;

  const contactModal = new bootstrap.Modal(contactModalEl);
  const openContactNav = $('#openContactNav');
  const contactForm = $('#contactForm');
  const contactError = $('#contactError');
  const contactName = $('#contactName');
  const contactEmail = $('#contactEmail');
  const contactMessage = $('#contactMessage');
  const contactConsent = $('#contactConsent');

  openContactNav.on('click', () => {
    contactError.hide().text('');
    contactForm[0].reset();
    contactModal.show();
    contactName.focus();
  });

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  contactForm.on('submit', function(e) {
    e.preventDefault();
    contactError.hide().text('');

    const name = contactName.val().trim();
    const email = contactEmail.val().trim();
    const message = contactMessage.val().trim();
    const consent = contactConsent.is(':checked');

    if (!name || !email || !message) {
      contactError.text('Please fill in your name, email and message.').show();
      return;
    }

    if (!isValidEmail(email)) {
      contactError.text('Please enter a valid email address.').show();
      contactEmail.focus();
      return;
    }

    if (!consent) {
      contactError.text('You must give consent before submitting.').show();
      return;
    }

    const originalFooter = contactForm.find('.modal-footer').html();
    contactForm.find('.modal-footer').html(
      '<div class="w-100 text-center text-success">Message sent. Thank you.</div>'
    );
    setTimeout(() => {
      contactModal.hide();
      contactForm.find('.modal-footer').html(originalFooter);
      contactForm[0].reset();
    }, 900);
  });
})();