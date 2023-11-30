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
    
};


class ChartOverlayComponent extends HTMLElement {

    constructor() {
        super();
        // Set default values for user settings
        

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
        

    }

    /**
     * Render a single series
     **/
    renderASeries(singleSeries, options) {
        
    }
    /**
     * Render the data marker with given data marker info
     **/
    renderData(dataInfo, options) {
       
    }

    /**
     * Render the data label with given data label info
     **/
    renderLabel(labelInfo, options) {
        
    }

    /**
     * Render a single axis label
     **/
    _renderAxisLabel(label) {
        
    };

    /**
     * Render axis labels with given axis label array
     **/
    renderAxisLabels(axisLabels) {
        
    }

    /**
     * Render a stacked label with given stackedLabelInfo
     **/
    renderAxisStackLabel(stackLabelInfo) {
        
    }

    /**
     * Render stacked labels with given stack label array
     **/
    renderAxisStackLabels(axisStackLabels) {
       
    }

     /**
     * Set the extensionData to this web component.
     * Called by SAP Analytics Cloud widget add-on extension framework to pass the formatted
     * widget extension data to this web component.
     **/
    setExtensionData(extensionData) {
        
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
