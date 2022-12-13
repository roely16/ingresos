<template>
    <div class="container-fluid h-100">

        <div class="row"  v-if="!loading">

            <div class="col-lg-12">

                <div class="card text-white bg-dark mb-2">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-5">
                                <h3 class="text-light">Datos del {{ fechas.FECHA_INICIO }} al {{ fechas.FECHA_FIN }}</h3> 
                            </div>
                            <div class="col-lg-7 text-left">
                                <div class="row">
                                    <div class="col-lg-6">
                                        <h3 class="text-light">Última Consulta: {{ horas.ultima_consulta }} hrs.</h3>
                                    </div>
                                    <div class="col-lg-6">
                                        <h3 class="text-light">Próxima Consulta: {{ horas.proxima_consulta }} hrs.</h3>
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="row" v-if="!loading">
            
             <div class="col-md-6">
                <apexchart  type="bar" height="500" :options="chartOptions2" :series="series2"></apexchart>
            </div>

            <div class="col-md-6">
                <apexchart type="bar" height="500" :options="chartOptions1" :series="series1"></apexchart>
            </div>

        </div>

        <div class="row"  v-if="!loading">
            <div class="col-md-6">
               <highcharts :options="chartOptions_Mora"></highcharts>
            </div>
            <div class="col-md-6">
                <highcharts :options="chartOptions_Vue" height="300"></highcharts>
            </div>
        </div>

        <div class="row" v-if="!loading" style="margin-top: 10px">
            <div class="col-lg-12 text-right col align-self-end">
                <button type="button" style="margin-right: 10px;" class="btn btn-dark" v-on:click="reload">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button type="button" class="btn btn-dark" v-on:click="mostrarModal">
                    <i class="fas fa-cogs"></i>
                </button>
            </div>
        </div>
        
        
            
        <div class="row  align-items-center h-100" v-if="loading">
            <div class="col-lg-12 text-center">
                <div class="spinner-grow text-light" style="width: 10rem; height: 10rem;" role="status"></div>
            <div>
                <h1 class="text-light">Obteniendo Datos...</h1>
            </div>
            </div>
            
        </div>
        
        <div class="modal" tabindex="-1" role="dialog" id="modalConfig">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Configuración</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                 <form v-on:submit.prevent="guardarConfig">
                <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12">
                                 <div class="form-group">
                                    <label for="exampleInputEmail1">Modo</label>
                                    <select required class="form-control" v-model="config.mode">
                                        <option value="1">Por defecto</option>
                                        <option value="2">Personalizado</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Rango de fechas si el modo es personalizado -->
                                <div class="col-lg-6" v-if="config.mode == 2">
                                    <div class="form-group">
                                        <label>Fecha Inicio</label>
                                        <input required type="date" v-model="config.date.fecha_inicio" class="form-control">
                                    </div>
                                </div>
                                <div class="col-lg-6" v-if="config.mode == 2">
                                    <div class="form-group">
                                        <label>Fecha Fin</label>
                                        <input required type="date" v-model="config.date.fecha_fin" class="form-control">
                                    </div>
                                </div>
                        </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
                 </form>
                </div>
            </div>
        </div>

    </div>
    
    
</template>

<script>

    import io from 'socket.io-client';
    import axios from 'axios'
    import ModalConfig from './ModalConfig'

    export default {

        data() {
            return {
                user: '',
                message: '',
                messages: [],
                socket : io('http://udicat.muniguate.com:3001'),
                loading: false,
                config: {
                    mode: 1,
                    time: 60,
                    date: {
                        fecha_inicio: '',
                        fecha_fin: ''
                    }
                },
                horas: {
                    ultima_consulta: '',
                    proxima_consulta: ''
                },
                fechas: {},
                meta_mes: 9,
                chartOptions_Vue: {
                    chart: {
                        plotBackgroundColor: '#000',
                        plotBorderWidth: 0,
                        plotShadow: true,
                        height: '300px',
                        margin: 0,
                        padding: 0
                    },
                    title: {
                        useHTML: true,
                        text: '<h5 class="text-center">Meta:</h5><h1 class="text-center">540M</h1>',
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 80,
                        style: {
                            fontSize: '50px',
                            color: 'white'
                        }
                    },
                    tooltip: {
                        pointFormat: '<b>{point.percentage}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                useHTML: true,
                                enabled: true,
                                // format: '{point.y}%',
                                formatter: function(){
                                    return "<div><h1 class='text-center' style='font-size=50px;'>"+ this.y + "%</h1><h5 class='text-center'>" + this.point.valor_total + " M</h5></div>"
                                },
                                distance: -50,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: '50px'
                                },
                                y: -15,
                                x: -10,
                                verticalAlign: "bottom",
                                align: "center"
                            },
                            startAngle: -90,
                            endAngle: 90,
                            center: ['50%', '95%'],
                            size: '180%',
                        }
                    },
                    series: [{
                        type: 'pie',
                        innerSize: '50%',
                        data: null
                    }],
                    credits: {
                        enabled: false
                    }
                },
                // Grafica DETALLE
                chartOptions1:{
                    chart: {
                        id: 'grafica2',
                        background: '#000',
                        height: '100%',
                        toolbar: {
                            show: false
                        }
                    },
                    grid: {
                        show: false
                    },
                    xaxis: {
                        categories: [],
                        labels: {
                            style: {
                                fontSize: '25px'
                            }
                        }
                    },
                    theme: {
                        mode: 'dark', 
                        palette: 'palette1', 
                        monochrome: {
                            enabled: false,
                            color: '#255aee',
                            shadeTo: 'light',
                            shadeIntensity: 0.65
                        },
                    },
                    title: {
                        text: "DETALLE DE LO COBRADO ACUMULADO", 
                        align: 'center',
                        style: {
                            fontSize: '24px'
                        }
                    },
                    legend: {
                        show: false
                    },
                    yaxis: {
                        show: false,
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                position: 'top'
                            },
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val, opts) {
                            return val
                        },
                        style: {
                            colors: ['#fff'],
                            fontSize: '30px'
                        },
                        offsetY: -40
                    },
                    colors: ['#3b6dc4', '#c92828', '#546E7A', '#E91E63', '#FF9800'],
                    stroke: {
                        show: true,
                        width: 5,
                        colors: ['#000']
                    },
                },
                series1: [],
                // Grafica COMPARATIVO
                chartOptions2:{
                    chart: {
                        id: 'grafica1',
                        background: '#000',
                        height: '100%',
                        width: '100%',
                        toolbar: {
                            show: false
                        }
                    },
                    grid: {
                        show: false
                    },
                    xaxis: {
                        categories: ['2018', '2019'],
                        labels: {
                            style: {
                                fontSize: '25px'
                            }
                        }
                    },
                    theme: {
                        mode: 'dark'
                    },
                    title: {
                        text: "COMPARATIVO ACUMULADO", 
                        align: 'center',
                        style: {
                            fontSize: '25px'
                        }
                    },
                    legend: {
                        show: false
                    },
                    yaxis: {
                        show: false,
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                position: 'top',
                            },
                            colors: {
                                backgroundBarColor: ['yellow', 'green']
                            },
                            distributed: true
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val, opts) {
                            return val
                        },
                        style: {
                            colors: ['#fff'],
                            fontSize: '50px'
                        },
                        offsetY: -60
                    },
                    colors: ['#3b6dc4', '#c92828', '#546E7A', '#E91E63', '#FF9800']
                },
                series2: [
                    {
                        "name": "IUSI",
                        "data": [200, 500]
                    },
                ],
                chartOptions_Mora: {
                    chart: {
                        height: '300px',
                        type: 'bar',
                        backgroundColor: '#000'
                    },
                    title: {
                        text: "",
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '20px'
                        },
                        useHTML: true
                    },
                    colors: ['green', 'red'],
                    xAxis: {
                        categories: ['Solventes', 'Morosas'],
                        title: {
                            text: null,
                        },
                        gridLineColor: '#000',
                        labels: {
                            style: {
                                fontWeight: 'bold',
                                color: 'white',
                                fontSize: '20px'
                            }
                        }
                    },
                    series: null,
                    credits: {
                        enabled: false
                    },
                    legend: {
                        reversed: false,
                        style: {
                            fontWeight: 'bold',
                            color: 'white',
                            fontSize: '20px'
                        },
                        itemStyle: {
                            fontSize:'20px',
                            color: 'white'
                        },
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                    },
                    yAxis: {
                        gridLineColor: '#000',
                        visible: false,
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                enabled: true,
                                crop: false,
                                overflow: 'none',
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: '16px'
                                },
                            }
                        }
                    },
                }
            }
        },
        methods: {
            getData(){
                
                var d = new Date();
                this.horas.ultima_consulta = d.getHours() + ':00'
                this.horas.proxima_consulta = d.getHours() + 1  + ':00'

                let data = {
                    "name": "ingresos",
                    "param": {}
                }

                this.loading = true

                axios({
					method: 'POST',
                    url: 'http://172.23.25.36/apps/api_ingresos/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data,
				})
				.then(data => {
                    console.log(data)

                    this.loading = false

                    this.chartOptions1.xaxis.categories = data.data.response.result.ITEMS.GRAFICA_DETALLE.CATEGORIES
                    this.series1 = data.data.response.result.ITEMS.GRAFICA_DETALLE.SERIES

                    // Grafica COMPARATIVO
                    this.chartOptions2.xaxis.categories = data.data.response.result.ITEMS.GRAFICA_COMPARATIVO.CATEGORIES
                    this.series2 = data.data.response.result.ITEMS.GRAFICA_COMPARATIVO.SERIES

                    // Fechas del reporte
                    this.fechas = data.data.response.result.FECHAS

                    // Grafica META
                    // this.series3 = data.data.response.result.ITEMS.GRAFICA_TOTAL
                    this.chartOptions_Vue.series[0].data = data.data.response.result.ITEMS.GRAFICA_TOTAL.data

                    // MORA
                    this.chartOptions_Mora.series = data.data.response.result.ITEMS.MORA.SERIES
                    this.chartOptions_Mora.title.text = "<h4 class='text-center'>CUENTAS MOROSAS</h4><h4 class='text-center'><strong>META DEL MES: " + data.data.response.result.ITEMS.MORA.META_MES + "M</strong></h4>"

                    console.log(this.chartOptions_Vue)
				})
				.catch(error => {
                    this.loading = false

                    alert(error)
				})
            },
            mostrarModal(){

                // Obtener la configuración
                let data = {
                    "name": "obtener_configuracion",
                    "param": {}
                }

                axios({
					method: 'POST',
                    url: 'http://172.23.25.36/apps/api_ingresos/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data,
				})
				.then(data => {
                    console.log(data)

                    this.config = data.data.response.result.config
                    $('#modalConfig').modal('show')

				})
				.catch(error => {
					console.log(error)
				})


            },
            guardarConfig(){

                let data = {
                    "name": "registrar_configuracion",
                    "param": {
                        "mode": this.config.mode,
                        "fecha_inicio": this.config.date.fecha_inicio,
                        "fecha_fin": this.config.date.fecha_fin
                    }
                }

                axios({
					method: 'POST',
                    url: 'http://172.23.25.36/apps/api_ingresos/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data,
				})
				.then(data => {
                    
                    Swal.fire({
                        title: 'Excelente!',
                        text: 'La configuración ha sigo guardada!',
                        type: 'success'
                    }).then((result) => {
                        
                        $('#modalConfig').modal('hide')

                        this.getData()

                    })

                    
				})
				.catch(error => {
					console.log(error)
				})

            },
            reload(){
                this.getData()
            }
        },
        mounted() {
            
            // Obtener los datos iniciales

            this.socket.on('MESSAGE', (data) => {
                this.messages = [...this.messages, data];
                this.loading = !data.status

                if (!this.loading) {
                    
                    var d = new Date();
                    this.horas.ultima_consulta = d.getHours() + ':00'
                    this.horas.proxima_consulta = d.getHours() + 1  + ':00'

                    this.loading = false

                    this.chartOptions1.xaxis.categories = data.data.response.result.ITEMS.GRAFICA_DETALLE.CATEGORIES
                    this.series1 = data.data.response.result.ITEMS.GRAFICA_DETALLE.SERIES

                    // Grafica COMPARATIVO
                    this.chartOptions2.xaxis.categories = data.data.response.result.ITEMS.GRAFICA_COMPARATIVO.CATEGORIES
                    this.series2 = data.data.response.result.ITEMS.GRAFICA_COMPARATIVO.SERIES

                    // Fechas del reporte
                    this.fechas = data.data.response.result.FECHAS

                    // Grafica META
                    this.chartOptions_Vue.series[0].data = data.data.response.result.ITEMS.GRAFICA_TOTAL.data

                    // MORA
                    this.chartOptions_Mora.series = data.data.response.result.ITEMS.MORA.SERIES
                }

            });

            this.getData()
        }

    }
</script>
