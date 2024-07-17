let idTemporizador = 0;
let temporizadores = [];

document.addEventListener("DOMContentLoaded", function() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const overlay = document.getElementById("overlay");
  const darkModeToggle = document.querySelector('.btn-dark-mode');

  function toggleSidebar() {
    sidebar.classList.toggle("collapsed");
  }

  function checkWindowSize() {
    if (window.innerWidth < 992) {
      sidebar.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
    }
  }

  sidebarToggle.addEventListener("click", toggleSidebar);
  window.addEventListener("resize", checkWindowSize);

  // Verifica o tamanho da janela ao carregar a página
  checkWindowSize();

  darkModeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    document.querySelector('.content').classList.toggle('dark-mode');
    const icon = darkModeToggle.querySelector("i");
    const cards = document.querySelectorAll('.card');
    const sidebars = document.querySelectorAll('.sidebar');
    cards.forEach(function(card) {
      card.classList.toggle('dark-mode');
    });
    sidebars.forEach(function(sidebar) {
      sidebar.classList.toggle('dark-mode');
    });
    if (document.body.classList.contains("dark-mode")) {
      icon.classList.remove("ri-moon-line");
      icon.classList.add("ri-sun-line");
    } else {
      icon.classList.remove("ri-sun-line");
      icon.classList.add("ri-moon-line");
    }
  });
});

$(document).ready(function() {
$('#add-temporizador').on("click", function () {
  idTemporizador++;
  let html = `
        <div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 p-1" id="card-${idTemporizador}"  data-id="${idTemporizador}">
          <div class="card p-1 pb-3">
            <div class="input-group mt-1 mb-2 border-bottom">
              <button class="btn border-0 btn-sm mr-1 ml-1 btndelete" id="btndelete-${idTemporizador}"><i class="ri-close-large-line"></i></button>
              <input type="text" id="nome-${idTemporizador}" value="" placeholder="Nome da sua vila" class="font-weight-bold form-control form-control-sm nome-input">
              <div class="input-group-append">
                <button class="btn btn-secondary btn-sm lock mr-2" data-id="${idTemporizador}"><i class="ri-lock-unlock-line"></i></button>
              </div>
            </div>
            
          <p class="m-0 p-0">Vila principal</p>
            ${createTimerHTML(idTemporizador, 1)}
          <p class="m-0 mt-1  p-0">Laboratório</p>
            ${createTimerHTML(idTemporizador, 2)}
          <p class="m-0 mt-1  p-0">Casa de Animais</p>
            ${createTimerHTML(idTemporizador, 3)}
          <p class="m-0 mt-1  p-0">Base do Construtor</p>
            ${createTimerHTML(idTemporizador, 4)}

          </div>
        </div>
  `;
  $('#temporizadores').append(html);
});

function createTimerHTML(id, timerId) {
  return `
    <div class="row text-dark mx-auto justify-content-center align-items-center">
      <div class="agrupar">
        <div class="form-group">
          <input type="number" id="dias-${id}-${timerId}" value="0" min="0" placeholder="DD" class="form-control tempo-input larger-input" oninput="validateInput(this, 30)">
        </div>
      </div>

      <div class="agrupar">
        <div class="form-group">
          <input type="number" id="horas-${id}-${timerId}" value="0" min="0" max="23" placeholder="HH" class="form-control tempo-input larger-input" oninput="validateInput(this, 24)">
        </div>
      </div>

      <div class="agrupar">
        <div class="form-group">
          <input type="number" id="minutos-${id}-${timerId}" value="0" min="0" max="59" placeholder="MM" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
        </div>
      </div>

      <div class="agrupar">
        <div class="form-group">
          <input type="number" id="segundos-${id}-${timerId}" value="0" min="0" max="59" placeholder="SS" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
        </div>
      </div>

      <div class="agrupar-botao btn-group justify-content-center">
        <div class="form-group" id="iniciar-${id}-${timerId}">
          <button class="font-weight-bold btn btn-warning btn-sm rounded-circle"><i class="ri-play-fill"></i></button>
        </div>

        <div class="form-group" id="parar-${id}-${timerId}" style="display: none;">
          <button class="font-weight-bold btn btn-danger btn-sm rounded-circle"><i class="ri-stop-fill"></i></button>
        </div>
      </div>
    </div>
  `;
}
$('#add-temporizador').trigger("click");


  $('.dropdown-item').on('click', function() {
    let filterId = $(this).data('filter');
    filterCards(filterId);
  });

  function filterCards(filterId) {
    let cardsArray = [];

    $('.card').each(function() {
      let card = $(this);
      let cardId = card.closest('.col-xl-3, .col-lg-4, .col-md-4, .col-sm-6').attr('data-id');
      let dias = parseInt(card.find(`#dias-${cardId}-${filterId}`).val()) || 0;
      let horas = parseInt(card.find(`#horas-${cardId}-${filterId}`).val()) || 0;
      let minutos = parseInt(card.find(`#minutos-${cardId}-${filterId}`).val()) || 0;
      let segundos = parseInt(card.find(`#segundos-${cardId}-${filterId}`).val()) || 0;

      let totalSeconds = (dias * 86400) + (horas * 3600) + (minutos * 60) + segundos;

      cardsArray.push({ card: card.parent(), totalSeconds: totalSeconds });
    });

    cardsArray.sort((a, b) => a.totalSeconds - b.totalSeconds);

    $('#temporizadores').html('');
    cardsArray.forEach(item => {
      $('#temporizadores').append(item.card);
    });
  }
});

$(document).on('click', '.lock', function() {
  const id = $(this).data('id');
  const nomeInput = $(`#nome-${id}`);
  this.classList.toggle('active');
  nomeInput.prop('readonly', !nomeInput.prop('readonly'));
  $(this).find('i').toggleClass('ri-lock-unlock-line ri-lock-line');
});

function validateInput(input, maxValue) {
  if (input.value > maxValue) {
    input.value = maxValue;
  }
}

$(document).on('click', '.tempo-input', function() {
  $(this).val('');
  $('.tempo-input').on('blur', function() {
    if ($(this).val() === '') {
      $(this).val(0);
    }
  });
});

$(document).on('click', '[id^="iniciar-"]', function() {
  let ids = $(this).attr('id').split('-');
  let id = ids[1];
  let timerId = ids[2];

  $(`#dias-${id}-${timerId}, #horas-${id}-${timerId}, #minutos-${id}-${timerId}, #segundos-${id}-${timerId}`).prop('readonly', true);

  const dias = parseInt($(`#dias-${id}-${timerId}`).val());
  const horas = parseInt($(`#horas-${id}-${timerId}`).val());
  const minutos = parseInt($(`#minutos-${id}-${timerId}`).val());
  const segundos = parseInt($(`#segundos-${id}-${timerId}`).val());

  const totalTimeInSeconds = dias * 86400 + horas * 3600 + minutos * 60 + segundos;
  const startTime = Date.now();

  temporizadores[`${id}-${timerId}`] = setInterval(function() {
    const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
    const remainingTimeInSeconds = totalTimeInSeconds - elapsedTimeInSeconds;

    if (remainingTimeInSeconds <= 0) {
      clearInterval(temporizadores[`${id}-${timerId}`]);
      $(`#dias-${id}-${timerId}, #horas-${id}-${timerId}, #minutos-${id}-${timerId}, #segundos-${id}-${timerId}`).prop('readonly', false).val(0);
      $(`#iniciar-${id}-${timerId}`).show();
      $(`#parar-${id}-${timerId}`).hide();
    } else {
      const remainingDias = Math.floor(remainingTimeInSeconds / 86400);
      const remainingHrs = Math.floor((remainingTimeInSeconds % 86400) / 3600);
      const remainingMins = Math.floor((remainingTimeInSeconds % 3600) / 60);
      const remainingSecs = remainingTimeInSeconds % 60;

      $(`#dias-${id}-${timerId}`).val(remainingDias);
      $(`#horas-${id}-${timerId}`).val(remainingHrs);
      $(`#minutos-${id}-${timerId}`).val(remainingMins);
      $(`#segundos-${id}-${timerId}`).val(remainingSecs);
    }
  }, 1000);

  $(this).hide();
  $(`#parar-${id}-${timerId}`).show();
});

$(document).on('click', '[id^="parar-"]', function() {
  let ids = $(this).attr('id').split('-');
  let id = ids[1];
  let timerId = ids[2];

  clearInterval(temporizadores[`${id}-${timerId}`]);
  $(`#dias-${id}-${timerId}, #horas-${id}-${timerId}, #minutos-${id}-${timerId}, #segundos-${id}-${timerId}`).prop('readonly', false);
  $(`#dias-${id}-${timerId}`).val(0);
  $(`#horas-${id}-${timerId}`).val(0);
  $(`#minutos-${id}-${timerId}`).val(0);
  $(`#segundos-${id}-${timerId}`).val(0);
  $(`#iniciar-${id}-${timerId}`).show();
  $(`#parar-${id}-${timerId}`).hide();
});


$(document).on('click', '.btndelete', function() {
  $(this).closest('.col-xl-3').remove();
});
/*
$('#ordenar-tempo').on('click', function() {
  const temporizadores = [];
  $('#temporizadores .col-lg-4').each(function() {
    const id = $(this).find('input[type="text"]').attr('id').replace('nome-', '');
    const dias = parseInt($(`#dias-${id}`).val());
    const horas = parseInt($(`#horas-${id}`).val());
    const minutos = parseInt($(`#minutos-${id}`).val());
    const segundos = parseInt($(`#segundos-${id}`).val());
    const tempoTotal = dias * 86400 + horas * 3600 + minutos * 60 + segundos;
    temporizadores.push({ id, tempoTotal, element: $(this) });
  });

  temporizadores.sort((a, b) => a.tempoTotal - b.tempoTotal);

  $('#temporizadores').empty();
  temporizadores.forEach((temporizador) => {
    $('#temporizadores').append(temporizador.element);
  });
});
*/