import React from 'react';
import ReactDOM from 'react-dom';
import TaxCalcWrapper from './TaxCalculator/Wrapper';
// import registerServiceWorker from './registerServiceWorker';

import './styles.css'
import 'react-select/dist/react-select.css'

ReactDOM.render(<TaxCalcWrapper />, document.getElementById('tax-calculator'));
// registerServiceWorker();
