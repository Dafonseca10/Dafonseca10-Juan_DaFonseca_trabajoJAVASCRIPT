const form = document.getElementById('form');
const totalEl = document.getElementById('presupuestoTotal');

// Validaciones
function onlyLetters(v){ return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/.test(v) }
function onlyDigits(v){ return /^\d+$/.test(v) }
function emailOk(v){ return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(v) }

// --- Sumatorio de camisetas (varias) ---
function precioCamisetas() {
  const fields = ['qty_fan','qty_player','qty_retro','qty_especial'];
  return fields.reduce((sum, name) => {
    const input = form[name];
    const qty   = Number(input?.value || 0);
    const price = Number(input?.dataset.price || 0);
    return sum + qty * price;
  }, 0);
}

// Total de unidades (para multiplicar extras por camiseta)
function totalCamisetas() {
  return ['qty_fan','qty_player','qty_retro','qty_especial']
    .reduce((s,n)=> s + Number(form[n]?.value || 0), 0);
}

// --- Extras por camiseta (manga larga y parches) ---
function precioExtrasCamiseta() {
  const extrasUnitarios = Array.from(
    form.querySelectorAll('input[name="extrasCamiseta"]:checked')
  ).reduce((a, e) => a + Number(e.dataset.price || 0), 0);

  return totalCamisetas() * extrasUnitarios;
}

// --- Extras por pedido (envío urgente) ---
function precioExtrasPedido() {
  return Array.from(
    form.querySelectorAll('input[name="extrasPedido"]:checked')
  ).reduce((a, e) => a + Number(e.dataset.price || 0), 0);
}

// Recargo por financiación (plazo de pago)
function recargo(plazo) {
  if (plazo >= 12) return 0.10; // +10%
  if (plazo >= 6)  return 0.05; // +5%
  return 0;
}

// Cálculo total
function calc() {
  const base =
    precioCamisetas() +
    precioExtrasCamiseta() +
    precioExtrasPedido();

  const p = Number(form.plazo.value || 0);
  const r = recargo(p);

  const total = Math.max(0, base * (1 + r));
  totalEl.textContent = (total.toFixed(2) + ' €').replace('.', ',');
}


// Eventos
['input','change'].forEach(ev => form.addEventListener(ev, calc));
calc();

// Mensajes de error UI
function msg(id, t=''){ const el = document.getElementById(id); if (el) el.textContent = t; }

// Validación del formulario
function validate(){
  let ok = true;
  const nombre  = form.nombre.value.trim();
  const apellidos = form.apellidos.value.trim();
  const tel     = form.telefono.value.trim();
  const correo  = form.email.value.trim();

  if (!onlyLetters(nombre)   || nombre.length > 15) { ok = false; msg('errNombre',   'Solo letras (máx. 15).') } else msg('errNombre')
  if (!onlyLetters(apellidos)|| apellidos.length > 40){ ok = false; msg('errApellidos','Solo letras (máx. 40).') } else msg('errApellidos')
  if (!onlyDigits(tel)       || tel.length > 9)    { ok = false; msg('errTelefono', 'Solo números (máx. 9).') } else msg('errTelefono')
  if (!emailOk(correo))                             { ok = false; msg('errEmail',    'Correo no válido.') } else msg('errEmail')

  // Al menos 1 camiseta
  const totalUnidades = ['qty_fan','qty_player','qty_retro','qty_especial']
    .reduce((s,n)=> s + Number(form[n]?.value || 0), 0);
  if (totalUnidades === 0) {
    ok = false;
    alert('Selecciona al menos 1 camiseta.');
  }

  // Acepto condiciones
  if (!form.cond.checked) { ok = false; msg('errCond','Debes aceptar las condiciones.') } else msg('errCond')

  return ok;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validate()) {
    alert('Formulario enviado ✅');
    form.reset();
    calc();
  } else {
    // Los mensajes/alert ya se muestran arriba
  }
});
