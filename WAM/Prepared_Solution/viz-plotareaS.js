const OverlayContainerTemplate = document.createElement('template');
OverlayContainerTemplate.innerHTML = `
    <style>
        .chart-overlay-container {
            position: relative;
            pointer-events: none;
            overflow: hidden;
        }
        .series-bar-column-container {
            background-color: transparent;
        }
        .series-bar-column {
            width: 100%;
            height: 100%;
        }
        .axis-label-container {
            position: absolute;
            display: flex;
            height: 18px;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: flex-end;
            background-color: transparent;
        }
        .axis-label {
            text-overflow: ellipsis;
        }
        .axis-label-icon {
            padding-left: 4px;
        }
        .common-label {
            position: absolute;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }
    </style>
    <div class="chart-overlay-container"/>
`;

const BarColumnTemplate = document.createElement('template');
BarColumnTemplate.innerHTML = `<div class="series-bar-column-container">
</div>`;

const AxisLabelTemplate = document.createElement('template');
AxisLabelTemplate.innerHTML = `
    <span class="axis-label-container">
        <span class="axis-label"></span>
        <img class="axis-label-icon"
            width="22"
            height="22"
        >
    </span>
`;

const iconMap = {
    'Austria': 'https://www.iconpacks.net/icons/5/free-icon-austria-flag-circular-17783.png',
    'Denmark': 'https://www.iconpacks.net/icons/5/free-icon-denmark-flag-circular-17776.png',
    'France': 'https://www.iconpacks.net/icons/5/free-icon-france-flag-circular-17753.png',
    'Germany': 'https://www.iconpacks.net/icons/5/free-icon-germany-flag-circular-17755.png',
    'Italy': 'https://www.iconpacks.net/icons/5/free-icon-italy-flag-circular-17751.png',
    'Netherlands': 'https://www.iconpacks.net/icons/5/free-icon-netherlands-flag-circular-17752.png',
    'Spain': 'https://www.iconpacks.net/icons/5/free-icon-spain-flag-circular-17884.png',
    'Switzerland': 'https://www.iconpacks.net/icons/5/free-icon-switzerland-flag-circular-17768.png',
    'United Kingdom': 'https://www.iconpacks.net/icons/5/free-icon-uk-flag-circular-17883.png',
    'Current GPD': 'https://www.iconpacks.net/icons/3/free-icon-gold-coins-6373.png',
    'Previous GPD': 'https://www.iconpacks.net/icons/3/free-icon-gold-coins-6373.png',
    'Info': 'https://www.iconpacks.net/icons/3/free-icon-gold-coins-6373.png',
};


class ChartOverlayComponent extends HTMLElement {

    constructor() {
        super();
        // Set default values for user settings
        this._rounded = true;
        this._sizeIncrement = 0;
        this._axisLabelColor = '#1D2D3E';

        // Initialize shadow root and container element
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const container = OverlayContainerTemplate.content.cloneNode(true);
        this._containerElement = container.querySelector('.chart-overlay-container');
        this._shadowRoot.appendChild(container);
    }

    /**
     * Render the plotarea of chart 
     **/
    render() {
        this._containerElement.innerHTML = '';

        const supportedChartTypes = [
            'barcolumn',
            'stackedbar',
            'line',
            'area',
        ];

        if (!supportedChartTypes.includes(this._chartType)) {
            return;
        }

        const { width: chartWidth, height: chartHeight } = this._size;
        // Clip-path is used to prevent the chart elements are displayed out of viewing range
        const { y: clipPathY, height: clipPathHeight } = this._clipPath;
        this._containerElement.setAttribute(
            'style',
            `position: relative; pointer-events: none; overflow: hidden; width: ${chartWidth}px; height: ${chartHeight}px; clip-path: inset(${clipPathY}px 0 ${chartHeight - clipPathY - clipPathHeight}px 0);`
        );

        this._series.forEach((singleSeries, index) => {
            const options = {
                color: singleSeries.color,
                showAsTriangle: singleSeries.showAsTriangle,
                isLast: index === 0,
            };
            // Render a single sesries
            this.renderASeries(singleSeries, options);
        });
        // Render x-axis labels
        this.renderAxisLabels(this._xAxisLabels);

        // Render y-axis labels
        this.renderAxisLabels(this._yAxisLabels);

        // Render x-axis stacked labels
        this.renderAxisStackLabels(this._xAxisStackLabels);

        // Render y-axys stacked labels
        this.renderAxisStackLabels(this._yAxisStackLabels);

    }

    /**
     * Render a single series
     **/
    renderASeries(singleSeries, options) {
        singleSeries.dataPoints.forEach((dataPoint) => {
            const { dataInfo, labelInfo } = dataPoint;
            // Render the data marker for current data point
            this.renderData(dataInfo, options);
            // Render the data label for current data point
            this.renderLabel(labelInfo, options);
        });
    }
    /**
     * Render the data marker with given data marker info
     **/
    renderData(dataInfo, options) {
        if (!dataInfo) {
            return;
        }
        let { x, y, width, height } = dataInfo;

        // Clone the data marker template
        const dataElement = BarColumnTemplate.content.cloneNode(true);
        const barColumnContainer = dataElement.querySelector('.series-bar-column-container');

        // Calculate the increment of data marker based on user settings
        const increment = this._sizeIncrement / 100;
        let roundedStyle = '';
        if (options?.showAsTriangle) {
            // Handle the "Show As" case selected on chart builder panel
            const originalWidth = width;
            const originalHeight = height;
            width = height = (Math.min(originalWidth, originalHeight) / 2) * (1 + increment);
            x = width === originalWidth ? x : x + (originalWidth - width) / 2;
            y = height === originalHeight ? y : y + (originalHeight - height) / 2;
            roundedStyle = `border-radius: ${height/2 + 3}px;`;
        } else {
            switch(this._chartType) {
            case 'barcolumn':
            case 'stackedbar':
                if (this._isHorizontal) {
                    height = height * (1 + increment);
                    y = y - height * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        // For stacked bar chart, only the last data marker in a series
                        // should be rounded
                        break;
                    }
                    roundedStyle = `border-radius: 0 ${height / 2}px ${height / 2}px 0;`;
                } else {
                    width = width * (1 + increment);
                    x = x - width * increment / 2;
                    if (this._chartType === 'stackedbar' && !options.isLast) {
                        // For stacked column chart, only the last data marker in a series
                        // should be rounded
                        break;
                    }
                    roundedStyle = `border-radius: ${width / 2}px ${width / 2}px 0 0;`;
                }
                break;
            case 'line':
            case 'area':
                width = width * (1 + increment);
                height = height * (1 + increment);
                x = x - width * increment / 2;
                y = y - height * increment / 2;
                // For line chart and area chart, data markers will be displayed as circles
                roundedStyle = `border-radius: ${height/2}px;`;
                break;
            }
        }

        const color = dataInfo.color || options.color;
        // Set data marker color
        const backgroundStyle = options?.showAsTriangle ?
            `border: ${color} solid 3px;` :
            `background-color: ${color};`;
        // If rounded is false, don't use the roundedStyle
        const barStyle = this._rounded ? `${backgroundStyle} ${roundedStyle}` : backgroundStyle;
        barColumnContainer.setAttribute(
            'style',
            `${barStyle} position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px;${dataInfo.opacity !== undefined ? `opacity: ${dataInfo.opacity};` : ''}`
        );
        this._containerElement.appendChild(dataElement);
    }

    /**
     * Render the data label with given data label info
     **/
    renderLabel(labelInfo, options) {
        if (!labelInfo) {
            return;
        }
        if (Array.isArray(labelInfo)) {
            // If labelInfo is an array, then render it recursively
            labelInfo.forEach((label) => {
                this.renderLabel(label, options);
            });
            return;
        }
        const { x, y, width, height, varianceLabelType, color, fontSize } = labelInfo;
        const labelSpan = document.createElement('span');
        const bgColor = 'transparent';
        // Set data label font color
        let labelColor = this._chartType.startsWith('stacked') ? '#666' : options.color;
        if (varianceLabelType !== undefined) {
            // Use the original variance label color
            labelColor = color;
        }
        labelSpan.classList.add('common-label');
        labelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; color: ${labelColor}; font-size: ${fontSize};`
        );
        labelSpan.innerHTML = labelInfo.formattedValue;

        this._containerElement.appendChild(labelSpan);
    }

    /**
     * Render a single axis label
     **/
    _renderAxisLabel(label) {
        if (!label) {
            return;
        }
        const { x, y, width, height, pointValue, formattedValue, fontSize } = label;
        const labelEl = AxisLabelTemplate.content.cloneNode(true);
        const labelContainer = labelEl.querySelector('.axis-label-container');
        const bgColor = 'transparent';
        labelContainer.setAttribute('style', `background-color: ${bgColor}; width: ${width + 36}px; left: ${x - 30}px; top: ${y - 2}px; font-size: ${fontSize};`);
        this._containerElement.appendChild(labelEl);

        const labelSpan = labelContainer.querySelector('.axis-label');
        const _axisLabelColor = this._axisLabelColor;
        labelSpan.setAttribute('style', `color: ${_axisLabelColor}`);
        labelSpan.innerHTML = formattedValue;

        const iconImg = labelContainer.querySelector('img');
        iconImg.setAttribute('src', iconMap[pointValue] || iconMap.City || iconMap.Info);
    };

    /**
     * Render axis labels with given axis label array
     **/
    renderAxisLabels(axisLabels) {
        if (axisLabels && !Array.isArray(axisLabels)) {
            this._renderAxisLabel(axisLabels);
        } else {
            axisLabels.forEach((labels) => this.renderAxisLabels(labels));
        }
    }

    /**
     * Render a stacked label with given stackedLabelInfo
     **/
    renderAxisStackLabel(stackLabelInfo) {
        if (!stackLabelInfo) {
            return;
        }
        const stackLabelSpan = document.createElement('span');
        stackLabelSpan.classList.add('common-label');
        const axisLabelColor = this._axisLabelColor;
        const bgColor = 'transparent';
        const {
            x, y, width, height, formattedValue, fontSize
        } = stackLabelInfo;
        stackLabelSpan.setAttribute(
            'style',
            `background-color: ${bgColor}; color: ${axisLabelColor}; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px; font-size: ${fontSize};`
        );
        stackLabelSpan.textContent = formattedValue;
        this._containerElement.appendChild(stackLabelSpan);
    }

    /**
     * Render stacked labels with given stack label array
     **/
    renderAxisStackLabels(axisStackLabels) {
        if (!axisStackLabels) {
            return;
        }
        if (axisStackLabels && !Array.isArray(axisStackLabels)) {
            this.renderAxisStackLabel(axisStackLabels);
        } else {
            axisStackLabels.forEach((stackLabels) => {
                this.renderAxisStackLabels(stackLabels);
            });
        }
    }

     /**
     * Set the extensionData to this web component.
     * Called by SAP Analytics Cloud widget add-on extension framework to pass the formatted
     * widget extension data to this web component.
     **/
    setExtensionData(extensionData) {
        const {
            chartType,
            isHorizontal,
            chartSize,
            clipPath,
            series,
            xAxisLabels,
            xAxisStackLabels,
            yAxisLabels,
            yAxisStackLabels,
        } = extensionData;
        this._size = chartSize;
        this._clipPath = clipPath;
        this._series = series;
        this._xAxisLabels = xAxisLabels;
        this._yAxisLabels = yAxisLabels;
        this._xAxisStackLabels = xAxisStackLabels;
        this._yAxisStackLabels = yAxisStackLabels;
        this._chartType = chartType;
        this._isHorizontal = isHorizontal;
        this.render();
    }

    /**
     * User settings to set if data marker should be rounded
     */
    set rounded(value) {
        this._rounded = value;
        this.render();
    }

    set sizeIncrement(value) {
        this._sizeIncrement = value;
        this.render();
    }

    /**
     * User settings to set the axis label color
     */
    set axisLabelColor(value) {
        this._axisLabelColor = value;
        this.render();
    }
}

customElements.define('viz-plotarea', ChartOverlayComponent);
