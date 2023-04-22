const CHOICES = [
    {
        UTILIZADOR: [
            {value: 1, descripcion: 'Estatal'},
            {value: 2, descripcion: 'No estatal'},
        ]
    },
    {
        RESOLUCION: [
            {value: 71, descripcion: 'Resolucion 71'},
            {value: 72, descripcion: 'Resolucion 72'},
        ]
    },
    {
        DERECHOS: [
            {value: 'Musica', descripcion: 'Musica'},
            {value: 'Dramatico', descripcion: 'Dramatico'},
            {value: 'AudioVisual', descripcion: 'AudioVisual'}
        ]
    },
    {
        UTILIZADOR_NO_ESTATAL: [
            {value: 'PN', descripcion: 'Persona Natural'},
            {value: 'PJ', descripcion: 'Persona Juridica'},
        ]
    },
    {
        NIVEL_ESCOLARIDAD: [
            {value: 1, descripcion: 'Tecnico Medio'},
            {value: 2, descripcion: '12 Grado'},
            {value: 3, descripcion: 'Universitario'},
            {value: 4, descripcion: 'Master'},
            {value: 5, descripcion: 'Doctor'},
        ]
    },
    {
        ESTADO: [
            {value: 'Firmado', descripcion: 'Firmado'},
            {value: 'Pendiente', descripcion: 'Pendiente'},
        ]
    },
    {
        ACTIVIDAD: [
            {value: 1, descripcion: 'Gestor de cobro y pago de derecho de autor'},
            {value: 2, descripcion: 'Cobrador pagador del derecho de autor'},
        ]
    },
    {
        PROVINCIA: [
            {value: 'PR', descripcion: 'Pinar del Rio'},
            {value: 'ART', descripcion: 'Artemisa'},
            {value: 'HAB', descripcion: 'La Habana'},
            {value: 'MAY', descripcion: 'Mayabeque'},
            {value: 'MAT', descripcion: 'Matanzas'},
            {value: 'VCL', descripcion: 'Villa Clara'},
            {value: 'CFG', descripcion: 'Cienfuegos'},
            {value: 'SS', descripcion: 'Santi Spiritu'},
            {value: 'CAV', descripcion: 'Ciego de Avila'},
            {value: 'CMG', descripcion: 'Camaguey'},
            {value: 'TUN', descripcion: 'Las Tunas'},
            {value: 'HOL', descripcion: 'Holguin'},
            {value: 'GRM', descripcion: 'Granma'},
            {value: 'STG', descripcion: 'Santiago de Cuba'},
            {value: 'GTM', descripcion: 'Guantanamo'},
            {value: 'IJV', descripcion: 'Isla de la Juventud'},
        ]
    },
    {
        PERIOCIDAD_PAGO: [
            {value: 'Trimestral', descripcion: 'Trimestral'},
            {value: 'Mensual', descripcion: 'Mensual'},
            {value: 'Anual', descripcion: 'Anual'},
        ]
    },
    {
        PERIOCIDAD_ENTREGA: [
            {value: 1, descripcion: 'Trimestral musica viva'},
            {value: 2, descripcion: 'Bianual musica grabada'},
        ]
    },
    {
        TIPO_JURIDICO: [
            {value: 'MIPYME', descripcion: 'MIPYME'},
            {value: 'CNA', descripcion: 'CNA'},
        ]
    },
    {
        TIPO_OBRA_COMERCIAL: [
            {value: 'Vivo', descripcion: 'Vivo'},
            {value: 'Grabada', descripcion: 'Grabada'},
        ]
    },
    {
        ANEXOS_71: [
            {value: 1, descripcion: 'Anexo Musica'},
            {value: 2, descripcion: 'Anexo Audiovisual'},
            {value: 3, descripcion: 'Anexo Cultura'},
        ]
    },
    {
        ANEXOS_72: [
            {value: 4, descripcion: 'Anexo CIMEX'},
            {value: 5, descripcion: 'Anexo Gaviota'},
            {value: 6, descripcion: 'Anexo Tiendas Caribe'},
        ]
    },
    {
        TIPO_CATEGORIA_AUDIOVISUAL: [
            {value: '1', descripcion: 'Sala de Cine'},
            {value: '2', descripcion: 'Sala de Video'},
        ],

        TIPO_CATEGORIA_HOTELES: [
            {value: '2estrellas', descripcion: '2 Estrellas'},
            {value: '3estrellas', descripcion: '3 Estrellas'},
            {value: '4estrellas', descripcion: '4 Estrellas'},
            {value: '5estrellas', descripcion: '5 Estrellas'},
        ]
    },
    {
        CHOICE_TIPO_PROFORMA: [
            {value: 1, descripcion: 'Estatal'},
            {value: 2, descripcion: 'No estatal persona juridica (Contrato MIPYME)'},
            {value: 3, descripcion: 'No estatal persona natural (Contrato Ejecucion Publica)'},
            {value: 4, descripcion: 'No estatal persona natural (Contrato Comprador Vendedor de Disco)'},
            {value: 5, descripcion: 'Representante'},
        ]
    },
]
export default CHOICES