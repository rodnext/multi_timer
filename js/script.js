let idTemporizador = 0;
let temporizadores = [];
let timerValues = {};

$('#add-temporizador').on('click', function() {
  idTemporizador++;
  let html = `
        <tr class="spacer-row bg-transparent bg-none">
            <td colspan="7" style="height: 20px;"></td> <!-- Colspan para ocupar todas as colunas -->
          </tr>
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

  const dias = parseInt($(`#dias-${id}`).val());
  const horas = parseInt($(`#horas-${id}`).val());
  const minutos = parseInt($(`#minutos-${id}`).val());
  const segundos = parseInt($(`#segundos-${id}`).val());

  const endTime = Date.now() + dias * 86400000 + horas * 3600000 + minutos * 60000 + segundos * 1000;

  temporizadores[id] = setInterval(function() {
    const now = Date.now();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      clearInterval(temporizadores[id]);
      $(`#dias-${id}`).val(0);
      $(`#horas-${id}`).val(0);
      $(`#minutos-${id}`).val(0);
      $(`#segundos-${id}`).val(0);
      $(`#iniciar-${id}`).show();
      $(`#parar-${id}`).hide();
      return;
    }

    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    $(`#dias-${id}`).val(days);
    $(`#horas-${id}`).val(hours);
    $(`#minutos-${id}`).val(minutes);
    $(`#segundos-${id}`).val(seconds);

    $(`#iniciar-${id}`).hide();
    $(`#parar-${id}`).show();
  }, 1000);
});

$(document).on('click', '[id^="parar-"]', function() {
  let id = $(this).attr('id').replace('parar-', '');
  clearInterval(temporizadores[id]);
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
