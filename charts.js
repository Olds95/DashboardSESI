// ==========================================================
// SESI Analytics
// Dashboard Operacional de Atendimento
// Charts.js
// ==========================================================

// Gráficos
let grafico7Dias = null;
let graficoLocalidades = null;
let graficoCausas = null;
let graficoStatus = null;

// ==========================================================
// Cores padrão
// ==========================================================

const CORES = {
    azul: "#0F62FE",
    verde: "#24A148",
    vermelho: "#DA1E28",
    amarelo: "#F1C21B",
    laranja: "#FF832B",
    roxo: "#8A3FFC",
    cinza: "#DDE1E6"
};

// ==========================================================
// Configuração padrão
// ==========================================================

Chart.defaults.font.family = "Inter";
Chart.defaults.color = "#444";
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = "#222";
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

// ==========================================================
// PLUGIN: valor no final de cada coluna (barras horizontais)
// ==========================================================

const valorNoFinalPlugin = {

    id: "valorNoFinal",

    afterDatasetsDraw(chart){

        // Só desenha nos gráficos de barra horizontal (analistas, localidades, causas)
        if(chart.config.type !== "bar" || chart.options.indexAxis !== "y") return;

        const {ctx} = chart;

        chart.data.datasets.forEach((dataset, indiceDataset)=>{

            const meta = chart.getDatasetMeta(indiceDataset);

            if(meta.hidden) return;

            meta.data.forEach((elemento, indice)=>{

                const valor = dataset.data[indice];

                if(valor === undefined || valor === null) return;

                ctx.save();

                ctx.font = "600 12px Inter";
                ctx.fillStyle = "#374151";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";

                ctx.fillText(valor, elemento.x + 8, elemento.y);

                ctx.restore();

            });

        });

    }

};

Chart.register(valorNoFinalPlugin);

// ==========================================================
// GRÁFICO CHAMADOS (ÚLTIMOS 7 DIAS) POR CAUSA
// ==========================================================
// Recebe apenas os chamados já restritos aos últimos 7 dias
// (filtro de data aplicado em script.js) e agrupa por Causa,
// mostrando quantidade x causa.

function criarGrafico7Dias(dados){

    const contador = {};

    dados.forEach(item=>{

        const causa = item.Causa;

        if(!causa) return;

        contador[causa]=(contador[causa]||0)+1;

    });

    const ordenado = Object.entries(contador)
        .sort((a,b)=>b[1]-a[1]);

    const nomes = ordenado.map(item=>item[0]);

    const valores = ordenado.map(item=>item[1]);

    const canvas = document.getElementById("chamados7dias");

    if(grafico7Dias){
        grafico7Dias.destroy();
    }

    grafico7Dias = new Chart(canvas,{

        type:"bar",

        data:{

            labels:nomes,

            datasets:[{

                data:valores,

                backgroundColor:CORES.roxo,

                borderRadius:8,

                borderSkipped:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            indexAxis:"y",

            layout:{
                padding:{
                    right:40
                }
            },

            animation:{
                duration:1000
            },

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                x:{
                    beginAtZero:true,
                    grid:{
                        display:false
                    }
                },

                y:{
                    grid:{
                        display:false
                    }
                }

            }

        }

    });

}

// ==========================================================
// GRÁFICO LOCALIDADES
// ==========================================================

function criarGraficoLocalidades(dados){

    const contador = {};

    dados.forEach(item=>{

        const localidade = item.Localidade_do_Solicitante;

        if(!localidade) return;

        contador[localidade]=(contador[localidade]||0)+1;

    });

    const ordenado = Object.entries(contador)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);

    const nomes = ordenado.map(item=>item[0]);

    const valores = ordenado.map(item=>item[1]);

    const canvas = document.getElementById("localidades");

    if(graficoLocalidades){
        graficoLocalidades.destroy();
    }

    graficoLocalidades = new Chart(canvas,{

        type:"bar",

        data:{

            labels:nomes,

            datasets:[{

                data:valores,

                backgroundColor:CORES.verde,

                borderRadius:8,

                borderSkipped:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            indexAxis:"y",

            layout:{
                padding:{
                    right:40
                }
            },

            animation:{
                duration:1000
            },

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                x:{
                    beginAtZero:true,
                    grid:{
                        display:false
                    }
                },

                y:{
                    grid:{
                        display:false
                    }
                }

            }

        }

    });

}

// ==========================================================
// GRÁFICO CAUSAS
// ==========================================================

function criarGraficoCausas(dados){

    const contador = {};

    dados.forEach(item=>{

        const causa = item.Causa;

        if(!causa) return;

        contador[causa]=(contador[causa]||0)+1;

    });

    const ordenado = Object.entries(contador)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);

    const nomes = ordenado.map(item=>item[0]);

    const valores = ordenado.map(item=>item[1]);

    const canvas = document.getElementById("causas");

    if(graficoCausas){
        graficoCausas.destroy();
    }

    graficoCausas = new Chart(canvas,{

        type:"bar",

        data:{

            labels:nomes,

            datasets:[{

                data:valores,

                backgroundColor:CORES.laranja,

                borderRadius:8,

                borderSkipped:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            indexAxis:"y",

            layout:{
                padding:{
                    right:40
                }
            },

            animation:{
                duration:1000
            },

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                x:{
                    beginAtZero:true,
                    grid:{
                        display:false
                    }
                },

                y:{
                    grid:{
                        display:false
                    }
                }

            }

        }

    });

}

// ==========================================================
// GRÁFICO STATUS
// ==========================================================

function criarGraficoStatus(dados){

    let aguardando = 0;
    let atendimento = 0;
    let finalizados = 0;
    let cancelados = 0;

    dados.forEach(item=>{

        const estado = String(item.Estado || "").trim().toUpperCase();

        switch(estado){

            case "AGUARDANDO ATENDIMENTO":
                aguardando++;
                break;

            case "EM ATENDIMENTO":
                atendimento++;
                break;

            case "CANCELADO":
                cancelados++;
                break;

            case "FECHADO":
            case "RESOLVIDO":
                finalizados++;
                break;

        }

    });

    const canvas = document.getElementById("status");

    if(graficoStatus){
        graficoStatus.destroy();
    }

    graficoStatus = new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:[
                "Finalizados",
                "Cancelados",
                "Aguardando",
                "Em Atendimento"
            ],

            datasets:[{

                data:[
                    finalizados,
                    cancelados,
                    aguardando,
                    atendimento
                ],

                backgroundColor:[
                    CORES.verde,
                    CORES.vermelho,
                    CORES.amarelo,
                    CORES.azul
                ],

                borderColor:"#ffffff",

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            cutout:"65%",

            plugins:{

                legend:{
                    display:true,
                    position:"bottom",
                    labels:{
                        padding:20
                    }

                }

            },

            animation:{
                duration:1200
            }

        }

    });

}

console.log("Charts carregado!");