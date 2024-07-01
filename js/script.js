let idTemporizador = 0;
let temporizadores = [];
let timerValues = {};

$('#add-temporizador').on('click', function() {
  idTemporizador++;
  let html = `
    <tr>
          <td class="nome-temp mx-auto col-12">
            <div class="input-group">
              <input type="text" id="nome-${idTemporizador}" value="" placeholder="Nome da sua vila" class="form-control nome-input">
              <div class="input-group-append ">
                <button class="btn btn-secondary lock" data-id="${idTemporizador}"><i class="ri-lock-unlock-line"></i></button>
              </div>
            </div>
          </td>
          <td class="agrupar">
            <div  class="min-md-th-show text-dark dica-dd">
              <p class="font-weight-bold m-0"> Dias</p>
            </div>
            <input type="number" id="dias-${idTemporizador}" value="0" min="0" placeholder="DD" class="form-control tempo-input" oninput="validateInput(this, 30)">
          </td>
          <td  class="agrupar">
            <div  class="min-md-th-show text-dark dica-dd">
              <p class="font-weight-bold m-0"> Hrs</p>
            </div>
            <input type="number" id="horas-${idTemporizador}" value="0" min="0" max="23" placeholder="HH" class="form-control tempo-input" oninput="validateInput(this, 24)">
          </td>
          <td class="agrupar">
            <div  class="min-md-th-show text-dark dica-dd">
              <p class="font-weight-bold m-0"> Mins</p>
            </div>
            <input type="number" id="minutos-${idTemporizador}" value="0" min="0" max="59" placeholder="MM" class="form-control tempo-input" oninput="validateInput(this, 60)">
            </div>
          </td>
          <td class="agrupar">
            <div  class="min-md-th-show text-dark dica-dd">
              <p class="font-weight-bold m-0"> Segs</p>
            </div>
            <input type="number" id="segundos-${idTemporizador}" value="0" min="0" max="59" placeholder="SS" class="form-control tempo-input" oninput="validateInput(this, 60)">
          </td>
          <td  class="agrupar-botao">
            <div class="btn-group">
              <button class="btn btn-warning rounded-circle" id="iniciar-${idTemporizador}"><i class="ri-play-fill"></i></button>
              <button class="btn btn-danger rounded-circle" id="parar-${idTemporizador}"  style="display: none;"><i class="ri-stop-fill"></i></button>
            </div>
          </td>
        </tr>
  `;
  $('#temporizadores').append(html);
});

$(document).on('click', '.lock', function() {
  let id = $(this).data('id');
  let nomeInput = $(`#nome-${id}`);
  this.classList.toggle('active');
  if (nomeInput.prop('readonly')) {
    nomeInput.prop('readonly', false);
    $(this).html('<i class="ri-lock-unlock-line"></i>');
  } else {
    nomeInput.prop('readonly', true);
    $(this).html('<i class="ri-lock-line"></i>');
  }
});

      function validateInput(input, maxValue) {
  if (input.value > maxValue) {
      input.value = maxValue;
  }
  }

$(document).on('click', '[id^="iniciar-"]', function() {
let id = $(this).attr('id').replace('iniciar-', '');
$(`#dias-${id}`).prop('readonly', true);
$(`#horas-${id}`).prop('readonly', true);
$(`#minutos-${id}`).prop('readonly', true);
$(`#segundos-${id}`).prop('readonly', true);

timerValues[id] = {
dias: parseInt($(`#dias-${id}`).val()),
horas: parseInt($(`#horas-${id}`).val()),
minutos: parseInt($(`#minutos-${id}`).val()),
segundos: parseInt($(`#segundos-${id}`).val())
};

temporizadores[id] = setInterval(function() {
timerValues[id].segundos--;
if (timerValues[id].segundos < 0) {
timerValues[id].segundos = 59;
timerValues[id].minutos--;
if (timerValues[id].minutos < 0) {
  timerValues[id].minutos = 59;
  timerValues[id].horas--;
  if (timerValues[id].horas < 0) {
    timerValues[id].horas = 23;
    timerValues[id].dias--;
    if (timerValues[id].dias < 0) {
      clearInterval(temporizadores[id]);
      $(`#dias-${id}`).prop('readonly', false);
      $(`#horas-${id}`).prop('readonly', false);
      $(`#minutos-${id}`).prop('readonly', false);
      $(`#segundos-${id}`).prop('readonly', false);
      $(`#dias-${id}`).val(0);
      $(`#horas-${id}`).val(0);
      $(`#minutos-${id}`).val(0);
      $(`#segundos-${id}`).val(0);
      timerValues[id] = {
          dias: 0,
          horas: 0,
          minutos: 0,
          segundos: 0
      };
      $(`#iniciar-${id}`).removeClass('btn-danger').addClass('btn-warning');
    }
  }
}
}
$(`#segundos-${id}`).val(timerValues[id].segundos);
$(`#minutos-${id}`).val(timerValues[id].minutos);
$(`#horas-${id}`).val(timerValues[id].horas);
$(`#dias-${id}`).val(timerValues[id].dias);

if (timerValues[id].segundos > 0 || timerValues[id].minutos > 0  || timerValues[id].horas > 0  || timerValues[id].dias > 0) {
  $(`#iniciar-${id}`).hide();
  $(`#parar-${id}`).show();
} else {
  $(`#iniciar-${id}`).show();
  $(`#parar-${id}`).hide();
}
}, 1000);
});

$(document).on('click', '[id^="parar-"]', function() {
let id = $(this).attr('id').replace('parar-', '');
$(`#dias-${id}`).prop('readonly', false);
$(`#horas-${id}`).prop('readonly', false);
$(`#minutos-${id}`).prop('readonly', false);
$(`#segundos-${id}`).prop('readonly', false);
$(`#dias-${id}`).val(0);
$(`#horas-${id}`).val(0);
$(`#minutos-${id}`).val(0);
$(`#segundos-${id}`).val(0);
timerValues[id] = {
dias: 0,
horas: 0,
minutos: 0,
segundos: 0
};

$(`#iniciar-${id}`).removeClass('btn-danger').addClass('btn-warning');
});

$('#ordenar-tempo').on('click', function() {
const temporizadores = [];
$('#temporizadores tr').each(function() {
const id = $(this).find('td:eq(0) input').attr('id').replace('nome-', '');
const dias = parseInt($(`#dias-${id}`).val());
const horas = parseInt($(`#horas-${id}`).val());
const minutos = parseInt($(`#minutos-${id}`).val());
const segundos = parseInt($(`#segundos-${id}`).val());
const tempoTotal = dias * 86400 + horas * 3600 + minutos * 60 + segundos;
temporizadores.push({ id, tempoTotal, tr: $(this) });
});

temporizadores.sort((a, b) => a.tempoTotal - b.tempoTotal);

const tbody = $('#temporizadores');
tbody.html('');
temporizadores.forEach((temporizador) => {
tbody.append(temporizador.tr);
});
});