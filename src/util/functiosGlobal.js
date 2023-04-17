import html2pdf from  'html2pdf.js'

//DECLARACION DEL OBJETO DATE QUE ES UTILIZADO EN EL ULTIMO PARRAFO DEL CONTRATO (PASO 3)
const date = new Date()
const dia = date.getDate()
const mes = date.toLocaleString('default',{month:'long'})
const ano = date.getFullYear()

//FUNCION PARA GENERAR EL PDF
const PDF = (idElemento) => {
    let content = document.getElementById(`${idElemento}`)
    let options = {
        margin:       0.6,
        filename:     `${idElemento}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(content).set(options).save();
}

//FUNCION PARA GENERAR EL CODIGO DEL PLAN MENSUAL (SIEMPRE SERA EL MES ACTUAL SEGUIDO DEL AÑO; 42023)
const generarCodigo = () => {
    let fecha= new Date()
    let mes = fecha.getMonth() + 1
    let codigo = mes.toString()+fecha.getFullYear().toString()
    return parseInt(codigo)
}

export {dia, mes, ano, PDF, generarCodigo}