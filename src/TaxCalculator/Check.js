import React from 'react'
import { Panel, Row, Col, Table } from 'react-bootstrap'
import FA from 'react-fontawesome'
import { round } from 'lodash'

import { CalculatorEngine } from './CalculatorEngine'

const Check = props => {

    const formatToCurrency = number => {
        if (!number || number === undefined) return '0.00'
        return Number(number).toFixed(2).replace(/./g, (c, i, a) => {
            return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
        })
    }

    const formatToWords = number => {
        if (number === 0) return 'Zero'
        const num = parseInt(number, 10)
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen ']
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

        if ((num.toString()).length > 9) return '---overflow---'
        let n = ('000000000' + num).substr(-9).match(/^(\d{3})(\d{3})(\d{3})$/)
        let str = ''
        if (!n) return str

        const renderPeriod = (period, periodName) => {
            let str = ''
            let n = ('000' + period).substr(-3).match(/^(\d{1})(\d{1})(\d{1})$/)
            if (Number(period) === 0) return str
            str += (Number(n[1]) !== 0) ? a[Number(n[1])] + 'Hundred ' : ''
            if ((Number(n[2]) === 1)) {
                str += a[Number(n[2] + n[3])]
                return str + periodName
            }
            str += (Number(n[2]) !== 0) ? b[Number(n[2])] : ''
            str += (Number(n[2]) !== 0 && Number(n[3]) !== 0) ? '-' : ' '
            str += (Number(n[3]) !== 0) ? a[Number(n[3])] : ''
            return str + periodName
        }

        str += renderPeriod(n[1], 'Million ')
        str += renderPeriod(n[2], 'Thousand ')
        str += renderPeriod(n[3], '')
        return str
    }

    const formatToDecimal = (number) => {
        if (isNaN(number)) return "0.0"
        else return round(number, 2)
    }

    const getCents = number => {
        if (isNaN(number)) return "Zero"
        return round((number % 1) * 100)
    }

    return (
        <Panel className="panel-check hidden-print" style={{ display: props.showResults ? 'block' : 'none' }} >
            <Panel.Body>
                <div className="check hidden-xs">
                    <div className="check-stack-1">
                        <div className="water-mark"><span>Sample Check</span></div>
                    </div>
                    <div className="check-stack-2">
                        <div className="address">
                            <p><strong>Your Employer</strong></p>
                            <p>123 Main St.</p>
                            <p>Anywhere, USA</p>
                        </div>
                        <div className="line">
                            <div className="flex-grow border-bottom">
                                <span>Pay to:</span>
                                <strong style={{ marginLeft: 20 }}>John Doe</strong>
                            </div>
                            <FA name="usd" fixedWidth style={{ alignSelf: 'center' }} />
                            <div className="amount-box"><strong style={{ fontSize: 27 }}>{formatToCurrency(props.state.netPay)}</strong></div>
                        </div>
                        <div className="line">
                            <div className="flex-grow border-bottom">
                                <span style={{ marginLeft: 20 }}><strong>{(formatToWords(props.state.netPay))} and {getCents(props.state.netPay)} Cents</strong></span>
                            </div>
                            <span>Dollars</span>
                        </div>
                        <div className="line">
                            <div className="flex-grow" style={{ marginRight: '5vw' }}>
                            </div>
                            <div className="flex-grow border-bottom" style={{ marginLeft: '5vw' }}>
                                <span className="signature text-center">Church Treasurer.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="check-margin">
                    <Row>
                        <Col sm={6}>
                            <Table>
                                <tbody>
                                    <tr>
                                        <th colSpan={2}><h3>GROSS PAY</h3></th>
                                    </tr>
                                    <tr>
                                        <td>Regular</td>
                                        <td>${formatToCurrency(props.annualIncome / props.payFrequency)}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={2}><h3>TAXES {props.isMinister ? 'DUE' : 'WITHHELD'}</h3></th>
                                    </tr>
                                    <tr>
                                        <td>Federal Income Tax</td>
                                        <td>${formatToCurrency(props.state.FITPerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <td>Social Security</td>
                                        <td>${formatToCurrency(props.state.socialSecurityPerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <td>Medicare</td>
                                        <td>${formatToCurrency(props.state.medicarePerPeriod)}</td>
                                    </tr>
                                    {props.state.additionalMedicarePerPeriod > 0 &&
                                        <tr>
                                            <td>Additional Medicare</td>
                                            <td>${formatToCurrency(props.state.additionalMedicarePerPeriod)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td>State</td>
                                        <td>${formatToCurrency(props.state.statePerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={2}><h3>SUMMARY</h3></th>
                                    </tr>
                                    <tr>
                                        <td>Total Pay</td>
                                        <td>${formatToCurrency(props.annualIncome / props.payFrequency)}</td>
                                    </tr>
                                    <tr>
                                        <td>Federal Taxes</td>
                                        <td>${formatToCurrency(props.state.totalFederalTaxes)}</td>
                                    </tr>
                                    <tr>
                                        <td>State Taxes</td>
                                        <td>${formatToCurrency(props.state.totalStateTaxes)}</td>
                                    </tr>
                                    <tr>
                                        <th><h3>NET PAY THIS CHECK</h3></th>
                                        <td>${formatToCurrency(props.state.netPay)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col sm={6}>
                            <div className="quarterly-payments">
                                <h2 className="text-center" style={{ marginBottom: 0 }}>Effective Tax Rates</h2>
                                <p className="text-center small">(based on total income)</p>
                                <Row>
                                    <Col xs={6}>
                                        <h3 className="text-right" style={{ marginTop: 0 }}>Federal</h3>
                                    </Col>
                                    <Col xs={6} >
                                        <h3 className="green" style={{ marginTop: 0 }}>{formatToDecimal(props.state.federalTaxRate)}%</h3>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <h3 className="text-right" style={{ marginTop: 0 }}>State</h3>
                                    </Col>
                                    <Col xs={6} >
                                        <h3 className="green" style={{ marginTop: 0 }}>{formatToDecimal(props.state.stateTaxRate)}%</h3>
                                    </Col>
                                </Row>
                            </div>
                            {(props.isUsesPayroll === 0 && props.isMinister === 1) &&
                                <div className="quarterly-payments">
                                    <h2 className="text-center">Quarterly Tax Payments</h2>
                                    <h3>
                                        <div className="pull-right">${formatToCurrency(props.state.quarterlyFederalPayments)}</div>
                                        Quarterly Federal Payment
                                    </h3>
                                    <small>* Submit this amount to the IRS with Form 1040-ES</small>
                                    <h3>
                                        <div className="pull-right">${formatToCurrency(props.state.quarterlyStatePayments)}</div>
                                        Quarterly State Payment
                                    </h3>
                                    <small>* Submit this amount to your state Department of Revenue</small>
                                    <div className="flex" style={{ marginTop: 30 }}>
                                        <div>
                                            <small>Quarterly payments should be submitted by:</small>
                                        </div>
                                        <div className="payment-dates flex-grow">
                                            <p><small>April 15</small></p>
                                            <p><small>June 15</small></p>
                                            <p><small>September 15</small></p>
                                            <p><small>January 15</small></p>
                                        </div>
                                    </div>
                                </div>
                            }
                            {props.isUsesPayroll === 1 &&
                                <div className="quarterly-payments">
                                    <h2 className="text-center">Additional Withholding</h2>
                                    <div className="h3">
                                        <div className="pull-right">${formatToCurrency(props.state.w4AdditionalWithholding)}</div>
                                        W-4 Additional Withholding
                                    </div>
                                    <small>*Enter this value on Form W-4, Line 6</small>
                                </div>
                            }

                        </Col>
                    </Row>
                </div>
            </Panel.Body>
        </Panel>
    )
}

export default CalculatorEngine(Check)