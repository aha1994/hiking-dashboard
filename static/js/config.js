// API key
const API_KEY = "pk.eyJ1IjoiYWhhMTk5NCIsImEiOiJjazQ5N2gzdm4wMmR0M21vN256OWJmcmc3In0.e4kUXML8_OLi4xX1ATdpXA";

const MAP_ZOOMS = {
    'All': [[39.5, -98.35], 4],
    'Alabama': [[32.78, -86.83], 6],
    'Alaska': [[64.07, -152.28], 6],
    'Arizona': [[34.27, -111.66], 6],
    'Arkansas': [[34.89, -92.44], 6],
    'California': [[37.18, -119.47], 5],
    'Colorado': [[39.00, -105.55], 6],
    'Connecticut': [[41.62, -72.73], 6],
    'Delaware': [[38.99, -75.51], 6],
    'District of Columbia': [[38.91, -77.01], 6],
    'Florida': [[28.63, -82.45], 6],
    'Georgia': [[32.64, -83.44], 6],
    'Hawaii': [[20.29, -156.37], 6],
    'Iceland':[[64.90, -18.50], 5] ,
    'Idaho': [[44.35, -114.61], 6],
    'Illinois': [[40.04, -89.20], 6],
    'Indiana': [[39.89, -86.28], 6],
    'Iowa': [[42.08, -93.50], 6],
    'Kansas': [[38.49, -98.38], 6],
    'Kentucky': [[37.53, -85.30], 6],
    'Louisiana': [[31.07, -92.00], 6],
    'Maine': [[45.37, -69.24], 6],
    'Maryland': [[39.06, -76.80], 6],
    'Massachusetts': [[42.26, -71.80], 6],
    'Michigan': [[44.34, -85.41], 6],
    'Minnesota': [[46.28, -94.31], 6],
    'Mississippi': [[32.74, -89.67], 6],
    'Missouri': [[38.36, -92.46], 6],
    'Montana': [[47.05, -109.63], 6],
    'Nebraska': [[41.54, -99.80], 6],
    'Nevada': [[39.33, -116.63], 6],
    'New Hampshire': [[43.68, -71.58], 6],
    'New Jersey': [[40.19, -74.67], 6],
    'New Mexico': [[34.41, -106.11], 6],
    'New York': [[42.95, -75.52], 6],
    'North Carolina': [[35.56, -79.39], 6],
    'North Dakota': [[47.45, -100.47], 6],
    'Ohio': [[40.28, -82.79], 6],
    'Oklahoma': [[35.59, -97.49], 6],
    'Oregon': [[43.93, -120.55], 6],
    'Pennsylvania': [[40.88, -77.80], 6],
    'Rhode Island': [[41.68, -71.56], 6],
    'South Carolina': [[33.92, -80.90], 6],
    'South Dakota': [[44.44, -100.22], 6],
    'Tennessee': [[35.86, -86.35], 6],
    'Texas': [[31.48, -99.33], 6],
    'Utah': [[39.31, -111.67], 6],
    'Vermont': [[44.07, -72.67], 6],
    'Virginia': [[37.52, -78.85], 6],
    'Washington': [[47.38, -120.44], 6],
    'West Virginia': [[38.64, -80.62], 6],
    'Wisconsin': [[44.62, -90.00], 6],
    'Wyoming': [[43.00, -107.55], 6],
    'American Samoa': [[-13.85, -169.06], 6],
    'Guam': [[12.98, 143.58], 6],
    'Northern Mariana Islands': [[18.32, 146.03], 6],
    'Puerto Rico': [[18.22, -66.43], 8],
    'U.S. Virgin Islands': [[18.05, -64.80], 6],
}

const STATE_ABBREVIATIONS = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Iceland': 'IS',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
    'Puerto Rico': 'PR'
}
