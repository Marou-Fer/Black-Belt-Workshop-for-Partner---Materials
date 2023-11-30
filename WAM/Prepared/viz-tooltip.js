const rowTemplate = document.createElement('template');
rowTemplate.innerHTML = `
    <div class="tooltip-row">
        <img class="entry-icon"
            width="22"
            height="22"
        >
        <div class="tooltip-row-label">
            <span class="entry-label"></span>
        </div>
    </div>
`;

const containerTemplate = document.createElement('template');
containerTemplate.innerHTML = `
    <style>
        :host {
            display: block;
            min-width: 80px;
            max-width: 250px;
            min-height: 24px;
        }

        .tooltip-container {
            padding: 12px;
            display: flex;
            min-width: 80px;
            min-height: 24px;
            flex-flow: column nowrap;
        }

        .price::before {
            font-family: SAP-icons;
            content: "\\E026";
        }

        .manager::before {
            font-family: SAP-icons;
            content: "\\E036";
        }

        .product::before {
            font-family: SAP-icons;
            content "\\E16D";
        }

        .location::before {
            font-family: SAP-icons;
            content "\\E021\";
        }

        .store::before {
            font-family: SAP-icons;
            content "\\E00F";
        }

        .tooltip-row {
            display: flex;
            min-height: 30px;
            flex-flow: row nowrap;
            align-items: center;
        }

        .tooltip-row-label {
            display: flex;
            flex-flow: column nowrap;
            flex: auto;
        }

        .tooltip-row-label progress {
            height: 6px;
            width: 100%;
            border-radius: 0;
        }

        .tooltip-row-label progress::-webkit-progress-bar {
            color: lightblue;
            background-color: #eee;
        }

        .tooltip-row-label progress::-webkit-progress-value {
            background-color: red;
        }

        .tooltip-row:not(:last-of-type) {
            border-bottom: solid 1px #e6e7e8;
        }

        .entry-icon {
            display: inline-block;
            padding-right: 12px;
        }

        .entry-label {
            display: inline-block;
            flex: auto;
            vertical-align: middle;
        }
    </style>
    <div class="tooltip-container">
    </div>

`;

const tooltipIconMap = {
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

/**
 * Convert a tooltip extension data entry to a row on tooltip UI
 * @param {*} entry
 * @param {*} withPercentageBar
 * @param {*} max
 * @returns
 */
const tooltipEntryToRow = (
    entry,
    withPercentageBar = false,
    max = 100,
) => {
    const rowElement = rowTemplate.content.cloneNode(true);
    const iconEl = (rowElement).querySelector('.entry-icon');
    const labelEl = (rowElement).querySelector('.entry-label');
    iconEl.setAttribute('src', tooltipIconMap[entry.value] || tooltipIconMap[entry.title] || tooltipIconMap['Info']);
    iconEl.setAttribute('title', entry.title);
    labelEl.textContent = entry.value;

    // Draw a thresh hold percentage bar for a measure if needed
    if (withPercentageBar) {
        const numberRegexp = /[.0-9]+/;
        if (!numberRegexp.test(entry.value)) {
            return;
        }
        const percentageBar = document.createElement('progress');
        percentageBar.value = Number(/[.0-9]+/.exec(entry.value)[0]);
        percentageBar.max = max;
        const rowLabelDiv = (rowElement).querySelector('.tooltip-row-label');
        rowLabelDiv.appendChild(percentageBar);
    }

    return rowElement;
}

class VizTooltip extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(containerTemplate.content.cloneNode(true));

        this._tooltipContainer = this._shadowRoot.querySelector('.tooltip-container');

        // Set default values for user settings

    }

    /**
     * Render the custom tooltip
     */
    render() {
        
    }

    setExtensionData (value) {
        this._props = value;
        this.render();
    }


}

customElements.define('viz-tooltip', VizTooltip);
