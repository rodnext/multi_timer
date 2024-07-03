let idTemporizador = 0;
let temporizadores = [];
let timerValues = {};
let timerStartTimes = {};

$('#add-temporizador').on("click", function () {
  idTemporizador++;
  let html = `
        <div class="col-lg-4 col-sm-6">
          <div class="card mt-0 mb-3">
            <div class="input-group mb-3">
              <input type="text" id="nome-${idTemporizador}" value="" placeholder="Nome da sua vila" class="form-control nome-input">
              <div class="input-group-append">
                <button class="btn btn-secondary lock" data-id="${idTemporizador}"><i class="ri-lock-unlock-line"></i></button>
              </div>
            </div>
            <div class="row align-items-center text-dark">
              <div class="agrupar col-lg-2 col-sm-6 col-2">
                <div class="form-group">
                  <p class="font-weight-bold m-1 small-text">Dias</p>
                  <input type="number" id="dias-${idTemporizador}" value="0" min="0" placeholder="DD" class="form-control tempo-input larger-input" oninput="validateInput(this, 30)">
                </div>
              </div>
              <div class="agrupar col-lg-2 col-sm-6 col-2">
                <div class="form-group">
                  <p class="font-weight-bold m-1 small-text">Hrs</p>
                  <input type="number" id="horas-${idTemporizador}" value="0" min="0" max="23" placeholder="HH" class="form-control tempo-input larger-input" oninput="validateInput(this, 24)">
                </div>
              </div>
              <div class="agrupar col-lg-2 col-sm-6 col-2">
                <div class="form-group">
                  <p class="font-weight-bold m-1 small-text">Mins</p>
                  <input type="number" id="minutos-${idTemporizador}" value="0" min="0" max="59" placeholder="MM" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
                </div>
              </div>
              <div class="agrupar col-lg-2 col-sm-6 col-2">
                <div class="form-group">
                  <p class="font-weight-bold m-1 small-text">Segs</p>
                  <input type="number" id="segundos-${idTemporizador}" value="0" min="0" max="59" placeholder="SS" class="form-control tempo-input larger-input" oninput="validateInput(this, 60)">
                </div>
              </div>
              <div class="agrupar-botao btn-group mt-1 col-lg-2 col-md col-sm col-2 justify-content-center">
                <div class="form-group" id="iniciar-${idTemporizador}">
                  <p class="font-weight-bold mb-1 small-text">Iniciar</p>
                  <button class="font-weight-bold btn btn-warning btn-lg rounded-circle"><i class="ri-play-fill"></i></button>
                </div>
                <div class="form-group" id="parar-${idTemporizador}" style="display: none;">
                  <p class="font-weight-bold mb-1 small-text">Parar</p>
                  <button class="font-weight-bold btn btn-danger btn-lg rounded-circle"><i class="ri-stop-fill"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
  `;
  $('#temporizadores').append(html);
});

$(document).on('click', '.lock', function() {
  let id = $(this).data('id');
  let nomeInput = $(`#nome-${id}`);
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
  let id = $(this).attr('id').replace('iniciar-', '');
  $(`#dias-${id}, #horas-${id}, #minutos-${id}, #segundos-${id}`).prop('readonly', true);

  timerValues[id] = {
    dias: parseInt($(`#dias-${id}`).val()),
    horas: parseInt($(`#horas-${id}`).val()),
    minutos: parseInt($(`#minutos-${id}`).val()),
    segundos: parseInt($(`#segundos-${id}`).val())
  };

  timerStartTimes[id] = performance.now();
  temporizadores[id] = requestAnimationFrame(updateTimer.bind(null, id));

  $(this).hide();
  $(`#parar-${id}`).show();
  storeTimerValues();
});

$(document).on('click', '[id^="parar-"]', function() {
  let id = $(this).attr('id').replace('parar-', '');
  cancelAnimationFrame(temporizadores[id]);
  $(`#dias-${id}`).prop('readonly', false);
  $(`#horas-${id}`).prop('readonly', false);
  $(`#minutos-${id}`).prop('readonly', false);
  $(`#segundos-${id}`).prop('readonly', false);
  $(`#dias-${id}`).val(0);
  $(`#horas-${id}`).val(0);
  $(`#minutos-${id}`).val(0);
  $(`#segundos-${id}`).val(0);
  $(`#iniciar-${id}`).show();
  $(`#parar-${id}`).hide();
  storeTimerValues();
});

function updateTimer(id) {
  let elapsed = Math.floor((performance.now() - timerStartTimes[id]) / 1000);
  let totalSeconds = timerValues[id].dias * 86400 + timerValues[id].horas * 3600 + timerValues[id].minutos * 60 + timerValues[id].segundos - elapsed;

  if (totalSeconds <= 0) {
    $(`#dias-${id}, #horas-${id}, #minutos-${id}, #segundos-${id}`).prop('readonly', false).val(0);
    $(`#iniciar-${id}`).show();
    $(`#parar-${id}`).hide();
    cancelAnimationFrame(temporizadores[id]);
    return;
  }

  timerValues[id].dias = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  timerValues[id].horas = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  timerValues[id].minutos = Math.floor(totalSeconds / 60);
  timerValues[id].segundos = totalSeconds % 60;

  $(`#dias-${id}`).val(timerValues[id].dias);
  $(`#horas-${id}`).val(timerValues[id].horas);
  $(`#minutos-${id}`).val(timerValues[id].minutos);
  $(`#segundos-${id}`).val(timerValues[id].segundos);

  temporizadores[id] = requestAnimationFrame(updateTimer.bind(null, id));
}

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

document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'hidden') {
    storeTimerValues();
  }
});

const cookieOptions = {
  expires: 30, // store the cookie for 30 days
};

function storeTimerValues() {
  Cookies.set('timerValues', JSON.stringify(timerValues), cookieOptions);
  Cookies.set('timerStartTimes', JSON.stringify(timerStartTimes), cookieOptions);
}

function retrieveTimerValues() {
  const storedTimerValues = Cookies.get('timerValues');
  const storedTimerStartTimes = Cookies.get('timerStartTimes');

  if (storedTimerValues && storedTimerStartTimes) {
    timerValues = JSON.parse(storedTimerValues);
    timerStartTimes = JSON.parse(storedTimerStartTimes);

    Object.keys(timerValues).forEach((id) => {
      $(`#dias-${id}`).val(timerValues[id].dias);
      $(`#horas-${id}`).val(timerValues[id].horas);
      $(`#minutos-${id}`).val(timerValues[id].minutos);
      $(`#segundos-${id}`).val(timerValues[id].segundos);
      $(`#iniciar-${id}`).hide();
      $(`#parar-${id}`).show();
      temporizadores[id] = requestAnimationFrame(updateTimer.bind(null, id));
    });
  }
}

$(document).ready(function() {
  retrieveTimerValues();
});
