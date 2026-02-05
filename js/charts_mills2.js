// Import Faulkner chart styles
import { faulknerChartStyles, faulknerBaseLayout, defaultConfig } from './config/faulkner-chart-styles.js';

// Chart 1: Character Appearances Alone
const compsonSingleData = [
    { Gender: 'Female', CharacterName: 'Dilsey Gibson', n: 7 },
    { Gender: 'Male', CharacterName: 'Benjy Compson', n: 5 },
    { Gender: 'Male', CharacterName: 'Jason Compson', n: 11 },
    { Gender: 'Male', CharacterName: 'Luster', n: 1 },
    { Gender: 'Male', CharacterName: 'Quentin Compson', n: 50 }
];

// Chart 2: Narrative Status
const narrativeStatusData = [
    { CharacterName: 'Quentin Compson', NarrativeStatus: 'Hypothesized', n: 10, percent: 4 },
    { CharacterName: 'Quentin Compson', NarrativeStatus: 'Narrated', n: 104, percent: 45 },
    { CharacterName: 'Quentin Compson', NarrativeStatus: 'Narrated+Consciousness', n: 5, percent: 2 },
    { CharacterName: 'Quentin Compson', NarrativeStatus: 'Remembered', n: 111, percent: 48 },
    { CharacterName: 'Quentin Compson', NarrativeStatus: 'Told', n: 2, percent: 1 },
    { CharacterName: 'Benjy Compson', NarrativeStatus: 'Narrated', n: 64, percent: 41 },
    { CharacterName: 'Benjy Compson', NarrativeStatus: 'Remembered', n: 94, percent: 59 },
    { CharacterName: 'Jason Compson', NarrativeStatus: 'Hypothesized', n: 1, percent: 1 },
    { CharacterName: 'Jason Compson', NarrativeStatus: 'Narrated', n: 75, percent: 61 },
    { CharacterName: 'Jason Compson', NarrativeStatus: 'Narrated+Consciousness', n: 1, percent: 1 },
    { CharacterName: 'Jason Compson', NarrativeStatus: 'Remembered', n: 45, percent: 37 },
    { CharacterName: 'Caddy Compson', NarrativeStatus: 'Hypothesized', n: 3, percent: 3 },
    { CharacterName: 'Caddy Compson', NarrativeStatus: 'Narrated', n: 1, percent: 1 },
    { CharacterName: 'Caddy Compson', NarrativeStatus: 'Narrated+Consciousness', n: 3, percent: 3 },
    { CharacterName: 'Caddy Compson', NarrativeStatus: 'Remembered', n: 104, percent: 91 },
    { CharacterName: 'Caddy Compson', NarrativeStatus: 'Told', n: 2, percent: 2 },
    { CharacterName: 'Mrs. Caroline Compson', NarrativeStatus: 'Narrated', n: 14, percent: 33 },
    { CharacterName: 'Mrs. Caroline Compson', NarrativeStatus: 'Remembered', n: 29, percent: 67 },
    { CharacterName: 'Mr. Jason Compson', NarrativeStatus: 'Hypothesized', n: 2, percent: 5 },
    { CharacterName: 'Mr. Jason Compson', NarrativeStatus: 'Remembered', n: 40, percent: 95 },
    { CharacterName: '(Miss) Quentin', NarrativeStatus: 'Narrated', n: 24, percent: 80 },
    { CharacterName: '(Miss) Quentin', NarrativeStatus: 'Remembered', n: 6, percent: 20 }
];

function createCharacterAloneChart() {
    // Remove " Compson" from character names and sort by n
    const processedData = compsonSingleData.map(d => ({
        ...d,
        CharacterName: d.CharacterName.replace(' Compson', '')
    })).sort((a, b) => a.n - b.n);

    // Separate data by character for different opacities
    const dilseyData = processedData.filter(d => d.CharacterName === 'Dilsey Gibson');
    const maleData = processedData.filter(d => d.Gender === 'Male');
    const otherFemaleData = processedData.filter(d => d.Gender === 'Female' && d.CharacterName !== 'Dilsey Gibson');

    const traces = [
        {
            x: maleData.map(d => d.CharacterName),
            y: maleData.map(d => d.n),
            type: 'bar',
            name: 'Male',
            marker: { 
                color: faulknerChartStyles.colorway[0], // Deep Blue
                opacity: 0.7
            },
            text: maleData.map(d => d.n),
            textposition: 'auto',
            hovertemplate: '<b>%{x}</b><br>Frequency: %{y}<extra></extra>'
        },
        {
            x: dilseyData.map(d => d.CharacterName),
            y: dilseyData.map(d => d.n),
            type: 'bar',
            name: 'Female',
            marker: { 
                color: faulknerChartStyles.colorway[1], // Warm Orange
                opacity: 1.0
            },
            text: dilseyData.map(d => d.n),
            textposition: 'auto',
            hovertemplate: '<b>%{x}</b><br>Frequency: %{y}<extra></extra>',
            showlegend: true
        }
    ];

    const layout = {
        ...faulknerBaseLayout,
        title: {
            text: 'Number of Times Character Appears Alone',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Character',
            categoryorder: 'total ascending'
        },
        yaxis: {
            title: 'Frequency',
            showgrid: true,
            gridcolor: '#e0e0e0'
        },
        barmode: 'stack',
        showlegend: true,
        legend: {
            x: 1.02,
            xanchor: 'left',
            y: 1,
            yanchor: 'top'
        },
        margin: { l: 75, r: 150, t: 60, b: 100 }
    };

    const config = {
        ...defaultConfig,
        toImageButtonOptions: {
            format: 'png',
            filename: 'character-appearances-alone'
        }
    };

    Plotly.newPlot('chart-character-alone', traces, layout, config);
}

function createNarrativeStatusChart() {
    // Get unique characters
    const characters = [...new Set(narrativeStatusData.map(d => d.CharacterName))];
    
    // Consolidate narrative statuses into three categories
    const consolidatedData = {};
    
    characters.forEach(char => {
        const charData = narrativeStatusData.filter(d => d.CharacterName === char);
        
        consolidatedData[char] = {
            'Narrated': charData.find(d => d.NarrativeStatus === 'Narrated')?.percent || 0,
            'Remembered': charData.find(d => d.NarrativeStatus === 'Remembered')?.percent || 0,
            'Other': charData
                .filter(d => ['Hypothesized', 'Narrated+Consciousness', 'Told'].includes(d.NarrativeStatus))
                .reduce((sum, d) => sum + d.percent, 0)
        };
    });

    // Create traces for the three categories
    const categories = ['Narrated', 'Remembered', 'Other'];
    const traces = categories.map((category, index) => {
        const categoryData = characters.map(char => consolidatedData[char][category]);
        const opacities = characters.map(char => char === 'Caddy Compson' ? 1.0 : 0.7);

        return {
            x: categoryData,
            y: characters,
            type: 'bar',
            orientation: 'h',
            name: category === 'Other' ? 'Other:' : category,
            legendgroup: category === 'Other' ? 'other-group' : category,
            marker: { 
                color: faulknerChartStyles.colorway[index],
                opacity: opacities,
                line: { color: 'black', width: 1 }
            },
            text: categoryData.map(val => val > 0 ? val + '%' : ''),
            textposition: 'inside',
            textfont: {
                color: 'white',
                size: 12
            },
            hovertemplate: '<b>%{y}</b><br>' + category + ': %{x}<extra></extra>'
        };
    });

    // Add invisible traces for "Other" subcategories
    const subcategories = [
        '-Hypothesized',
        '-Told',
        '-Narrated+Consciousness'
    ];
    
    subcategories.forEach(subcat => {
        traces.push({
            x: characters.map(() => 0),
            y: characters,
            type: 'bar',
            orientation: 'h',
            name: subcat,
            legendgroup: 'other-group',
            marker: {
                color: 'rgba(0,0,0,0)',
                opacity: 0,
                line: { width: 0 }
            },
            showlegend: true,
            hoverinfo: 'skip'
        });
    });

    const layout = {
        ...faulknerBaseLayout,
        title: {
            text: 'Percent Narrative Status Compson Family',
            font: { size: 18 }
        },
        xaxis: {
            title: 'Percent',
            showgrid: true,
            gridcolor: '#e0e0e0',
            ticksuffix: '%'
        },
        yaxis: {
            title: {
                text: 'Character',
                standoff: 20
            }
        },
        barmode: 'stack',
        showlegend: true,
        legend: {
            x: 1.02,
            xanchor: 'left',
            y: 1,
            yanchor: 'top',
            traceorder: 'normal'
        },
        margin: { l: 180, r: 250, t: 60, b: 50 }
    };

    const config = {
        ...defaultConfig,
        toImageButtonOptions: {
            format: 'png',
            filename: 'narrative-status-per-character'
        }
    };

    Plotly.newPlot('chart-narrative-status', traces, layout, config);
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createCharacterAloneChart();
    createNarrativeStatusChart();
});
