<template>
    <div style="width: 100%; height: 100%;">
        <br>
        <div class="row " v-if="!loading">

             <div class="col-md-6">
                <apexchart  type="bar" :options="chartOptions2" :series="series2"></apexchart>
            </div>

            <div class="col-md-6">
                <apexchart type="bar" :options="chartOptions1" :series="series1"></apexchart>
            </div>
            <!-- <div class="col-md-6">
                <apexchart  type="bar" :options="chartOptions" :series="series"></apexchart>
            </div>
            <div class="col-md-6">

            </div>
            <div class="col-md-6">
                <apexchart  type="bar" :options="chartOptions" :series="series"></apexchart>
            </div> -->
        </div>
            
        <div class="text-center" v-if="loading">
            <div class="spinner-grow"  style="width: 10rem; height: 10rem;" role="status">
                
            </div>
            <div>
                <h1>Obteniendo Datos...</h1>
            </div>
        </div>
        
    </div>
    
    
</template>

<script>

    import io from 'socket.io-client';
    import axios from 'axios'

    export default {

        data() {
            return {
                user: '',
                message: '',
                messages: [],
                // socket : io('localhost:3001'),
                loading: false,
                chartOptions1:{
                    chart: {
                        id: 'grafica2',
                        background: '#000'
                    },
                    xaxis: {
                        categories: []
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
                        text: "DETALLE DE LO COBRADO ACUMULADO AL 7 DE AGOSTO", 
                        align: 'center',
                        style: {
                            fontSize: '18px'
                        }
                    },
                    legend: {
                        show: false
                    },
                    yaxis: {
                        show: false
                    },
                    plotOptions: {
                        bar: {
                            dataLabels: {
                                position: 'top'
                            }
                        },
                    },
                },
                series1: [],
                chartOptions2:{
                    chart: {
                        id: 'grafica1',
                        background: '#000'
                    },
                    xaxis: {
                        categories: []
                    },
                    theme: {
                        mode: 'dark'
                    },
                    title: {
                        text: "Grafica 1", 
                        align: 'center',
                        style: {
                            fontSize: '30px'
                        }
                    },
                    legend: {
                        show: false
                    },
                    yaxis: {
                        show: false
                    }
                },
                series2: [],
                chartOptions3:{

                },
                chartOptions: {
                    chart: {
                        id: 'vuechart-example'
                    },
                    xaxis: {
                        categories: []
                    },
                    theme: {
                        mode: 'dark'
                    },
                    title: {
                        text: "Grafica 1", 
                        align: 'center',
                        style: {
                            fontSize: '30px'
                        }
                    }
                },
                
                
            }
        },
        methods: {
            
            getData(){
                
                let data = {
                    "name": "ingresos",
                    "param": {
                        "fecha_inicio" :  "20190801",
                        "fecha_fin": "20190807"
                    }
                }

                console.log(data)

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
				})
				.catch(error => {
					console.log(error)
				})
            }
        },
        mounted() {

            // Obtener los datos iniciales

            // this.socket.on('MESSAGE', (data) => {
            //     this.messages = [...this.messages, data];
            //     this.loading = !data.status

            //     if (!this.loading) {
                    
            //         console.log('agregar datos graficas')

            //         this.chartOptions.xaxis.categories = data.data.response.result.ITEMS.GRAFICA_DETALLE.CATEGORIES

            //         this.series[0].data = data.data.response.result.ITEMS.GRAFICA_DETALLE.DATA
            //     }

            //     console.log(data)
            // });

            this.getData()
        }

    }
</script>
