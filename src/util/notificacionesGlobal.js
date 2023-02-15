import Swal from "sweetalert2";

export function notificaciones (){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const mensaje = (tipo, encabezado, msg) => Toast.fire({
        title: encabezado,
        icon: tipo,
        html: `<strong>${msg}</strong>`
    })

    const notificacion = (tipo, titulo, msg, textoConfirmacion) => Swal.fire({
        title: titulo,
        text: msg,
        icon: tipo,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        cancelButtonText: 'No',
        confirmButtonText: textoConfirmacion
    })

    return {mensaje, notificacion}
}

