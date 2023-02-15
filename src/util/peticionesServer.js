import axios from "axios";

import {ref} from "vue";
import {notificaciones} from '@/util/notificacionesGlobal'

const {mensaje, notificacion} = notificaciones()
const indiceActualizado = ref(-1)
const expandirActualizado = ref(true)

const POST_PUT = async (url, dataPost, indice) => {
    console.log(dataPost, url, indice)
    try {
        if (indice == -1) {
            let response = await axios.post(url, dataPost)
            if (response.status == 201) {
                mensaje('success','Exito', response.data.message)
                expandirActualizado.value = true
            }
        } else {
            let urlEditar = url + dataPost.pk + "/"
            let response = await axios.put(urlEditar, dataPost)
            if (response.status == 200) {
                mensaje('success','Exito', response.data.message)
                indiceActualizado.value = -1
                expandirActualizado.value = true
            }
        }

    } catch (error) {
        console.log("error: ", error)
        if (error.response.status == 400) {
            let dataError = error.response.data
            let claves = Object.keys(dataError)
            claves.forEach(item => {
                mensaje('error',`Error en ${item}`, dataError[item][0])
            })
        } else if (error.response.status == 500) {
            mensaje('error','Error', "Ha ocurrido un error interno en el servidor.")
        }
    }


}
const GET = async (url, lista) => {
    try {
        let response = await axios.get(url)
        lista.value = response.data
        if (response.status == 200) {
            return lista
        }
    } catch (error) {
        console.log("error: ", error)
        mensaje('error','Error', error)
    }
}
const DELETE = (url) => {
    notificacion('question','Atencion','Estas seguro de querer eliminar este registro?', 'Si, eliminar')
    .then((result) => {
        if (result.isConfirmed) {
            axios.delete(url).then((response) => {
                if (response.status == 200) {
                    mensaje('success','Exito', response.data.message)
                }
            }).catch((error) => {
                mensaje('error','Error', error)
            })

        }
    })
}

export {GET, POST_PUT, DELETE, indiceActualizado, expandirActualizado}
