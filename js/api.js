const URL = "http://127.0.0.1:8000/";
var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

function validar() {
  var nombre = document.getElementById('email').value;
  var contra = document.getElementById('pass').value;


  if (regex.test(nombre)) {
    if (contra) {
      let timerInterval
      Swal.fire({
        title: 'Iniciando Sesión',
        html: 'Validando datos, espere por favor.',
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 100)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {

        }
      })
      fetch(URL + 'login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          email: nombre,
          password: contra
        })
      }).then((Response) => Response.json()).then((data) => {
        if (data.message) {
          window.location.href = 'gestion.html';
        } else { alert('nop') }
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Se requiere contraseña',
        showConfirmButton: false,
        timer: 1300
      })

    }
  } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Correo inválido',
      showConfirmButton: false,
      timer: 1000
    })
  }
}

function register() {

  var name = document.getElementById('name').value;
  var pass = document.getElementById('pass').value;
  var mail = document.getElementById('email').value;
  var appat = document.getElementById('apat').value;
  var ammat = document.getElementById('amat').value;
  var pass2 = document.getElementById('confpass').value;

  if (name) {
    if (appat) {
      if (ammat) {
        if (regex.test(mail)) {
          if (pass && pass === pass2) {
            fetch(URL + 'users/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',

              },
              body: JSON.stringify({
                name: name,
                email: mail,
                password: pass,
                ap_materno: ammat,
                ap_paterno: appat
              })
            }).then((Response) => Response.json()).then((data) => {
              if (data.message === 'Hay errores en el registro') {
                Swal.fire('No se pudo registrar', data.message, 'info')
              } else { Swal.fire('Bienvenido!', '', 'success'); window.location.href = 'login.html'; }
            })
          } else {
            alert('la contraseña no coincide')
          }
        } else {
          alert('mail')
        }
      } else {
        alert('ammat')
      }
    } else {
      alert('appat')
    }
  } else {
    alert('nombre')
  }


}
function addUser() {

  var name = document.getElementById('name').value;
  var pass = document.getElementById('pass').value;
  var mail = document.getElementById('email').value;
  var appat = document.getElementById('apat').value;
  var ammat = document.getElementById('amat').value;

  if (name) {
    if (appat) {
      if (ammat) {
        if (regex.test(mail)) {
          if (pass) {
            Swal.fire({
              title: '¿Deseas guardar al usurio?',
              showDenyButton: true,
              confirmButtonText: 'Guardar',
              denyButtonText: `No guardar`,
            }).then((result) => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                fetch(URL + 'users/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',

                  },
                  body: JSON.stringify({
                    name: name,
                    email: mail,
                    password: pass,
                    ap_materno: ammat,
                    ap_paterno: appat
                  })
                }).then((Response) => Response.json()).then((data) => {
                  if (data.message === 'Hay errores en el registro') {
                    Swal.fire('No se guardaron los cambios', data.message, 'info')
                  } else { Swal.fire('Guardado!', '', 'success'); location.reload() }
                })
              } else if (result.isDenied) {
                Swal.fire('No se guardaron los cambios', '', 'info',
                )
              }
            })

          } else {
            alert('la contraseña no coincide')
          }
        } else {
          alert('mail')
        }
      } else {
        alert('ammat')
      }
    } else {
      alert('appat')
    }
  } else {
    alert('nombre')
  }


}
const tabla = document.querySelector('#tabla_editar tbody');

function listarUsu() {
  fetch(URL + 'users/').then(respuesta => respuesta.json())
    .then(usuarios => {
      usuarios.forEach(element => {
        const row = document.createElement('tr');
        row.innerHTML += `
        <th scope="row">${element.id}</th>
        <td>${element.name}</td>
        <td>${element.ap_paterno}</td>
        <td>${element.email}</td>
        <td><button type="button" class="btn btn-outline-success" onclick="Editar(${element.id})">Editar</button></td>
        <td><button type="button" class="btn btn-outline-danger" onclick="eliminar(${element.id})">Eliminar</button></td>
        `;
        tabla.appendChild(row);
      });
    })
}

function eliminar(id) {
  Swal.fire({
    title: '¿Seguro qué quieres eliminarlo? ',
    text: "No serás capaz de recuperarlo",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#00BB2B',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borralo'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL + 'users/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((Response) => Response.json()).then((data) => { })
      location.reload()
    }
  })
}
function consultarID(id) {
  fetch(URL + 'users/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((Response) => Response.json()).then((data) => { return data.name; })

}

function Editar(id) {
  fetch(URL + 'users/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then((Response) => Response.json()).then((data) => {
    Swal.fire({
      title: 'Editar usuario',
      html:
    `<div class="form-row">` +
    `<div class="form-group col-md-6">` +
    `<label for="inputEmail4">Nombre</label>` +
    `<input type="text" class="form-control" id="name" placeholder="Email" value="${data.name}">` +
    `</div>` +
    `</div>` +
    `<div class="form-row">` +
    `<div class="form-group col-md-6">` +
    `<label for="inputPassword4" >Apellido Paterno</label>` +
    `<input type="text" class="form-control" id="apat" placeholder="Apellido Paterno" value="${data.ap_paterno}">` +
    `</div>` +
    `</div>` +
    `<div class="form-row">` +
    `<div class="form-group col-md-6">` +
    `<label for="inputEmail4">Apellido Materno</label>` +
    `<input type="text" class="form-control" id="amat" placeholder="Apellido Materno" value="${data.ap_materno}">` +
    `</div>` +
    `</div>` +
    `<div class="form-group col-md-6">` +
    `<label for="inputEmail4">Correo</label>` +
    `<input type="email" class="form-control" id="email" placeholder="alguien@algo.com" value="${data.email}">` +
    `</div>` +
    `<div class="form-group col-md-6">` +
    `<label for="inputEmail4">Contraseña</label>` +
    `<input type="password" class="form-control" id="pass" placeholder="Contraseña" value="${data.password}">` +
    `</div>`,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return [fetch(URL + 'users/' + id + '/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',

          },
          body: JSON.stringify({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('pass').value,
            ap_materno: document.getElementById('amat').value,
            ap_paterno: document.getElementById('apat').value
          })
        }).then((Response) => Response.json()).then((data) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Actualizado correctamente!',
            showConfirmButton: false,
            timer: 1500
          }); location.reload();
        })
        ]
      }
    })
  })

}