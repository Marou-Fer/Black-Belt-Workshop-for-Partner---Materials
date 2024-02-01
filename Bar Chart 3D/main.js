var getScriptPromisify = (src) => {
    return new Promise((resolve) => {
        $.getScript(src, resolve);
    });
};

var ROOT_PATH = 'https://marou-fer.github.io/Black-Belt-Workshop-for-Partner---Materials/Gantt%20Chart';

var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;



(function () {

    $.get(
        ROOT_PATH + '/data',
        function (data) {
            option = {
                grid3D: {},
                tooltip: {},
                xAxis3D: {
                    type: 'category'
                },
                yAxis3D: {
                    type: 'category'
                },
                zAxis3D: {},
                visualMap: {
                    max: 1e8,
                    dimension: 'Population'
                },
                dataset: {
                    dimensions: [
                        'Income',
                        'Life Expectancy',
                        'Population',
                        'Country',
                        { name: 'Year', type: 'ordinal' }
                    ],
                    source: data
                },
                series: [
                    {
                        type: 'bar3D',
                        // symbolSize: symbolSize,
                        shading: 'lambert',
                        encode: {
                            x: 'Year',
                            y: 'Country',
                            z: 'Life Expectancy',
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    );


    option && myChart.setOption(option);


    const template = document.createElement('template')
    template.innerHTML = `
    <style>
        #chart {
            width: 100%;
            height: 100%;
        }
    </style>
    <div id="root" style="width: 100%; height: 100%;">
        <div id="chart"></div>
    </div>
    `
    class Main extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: 'open' })
            this._shadowRoot.appendChild(template.content.cloneNode(true))
            this._root = this._shadowRoot.getElementById('root')
            this._props = {}
            this._renderer = new Renderer(this._root)
        }

        // Lifecycle Functions  //
        async onCustomWidgetBeforeUpdate(changedProps) {
            this._props = { ...this._props, ...changedProps };
        }

        async onCustomWidgetAfterUpdate(changedProps) {
            this.render()
        }

        async onCustomWidgetResize(width, height) {
            this.render()
        }

        async onCustomWidgetDestroy() {
            this.dispose()
        }
        render() {
            if (!document.contains(this)) {
                // Delay the render to assure the custom widget is appended on dom
                setTimeout(this.render.bind(this), 0)
                return
            }

            this._renderer.render(this.dataBinding, this._props)
        }

        dispose() {
            this._renderer.dispose()
        }
    }
    customElements.define('com-sap-sac-sample-echarts-bar3d', Main)
})()