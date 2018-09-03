import React from 'react'
import { Panel, Row, Col, Table } from 'react-bootstrap'
import { Element } from 'react-scroll'
import _ from 'lodash'

import { CalculatorEngine } from './CalculatorEngine'

const formatToCurrency = (number) => {
    if (!number || number === undefined) return '0.00'
    if (isNaN(number)) return 'NaN'
    return Number(number).toFixed(2).replace(/./g, (c, i, a) => {
        return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c
    })
}

const formatToDecimal = (number) => {
    if(isNaN(number)) return "0.0"
    else return _.round(number, 2)
}

const ReportBreakdown = props => {
    return (
        <Element name="report-breakdown">
            <Panel id="report-breakdown" style={{ display: props.showResults ? 'block' : 'none' }} className="visible-print-block" >
                <Panel.Body>
                    <h2 className="text-center">Your estimated results at a glance:</h2>
                    <Row>
                        <Col md={6} mdOffset={0} sm={8} smOffset={2} className="inner-right-xs inner-left-xs">
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <th>Gross pay per period</th>
                                        <td className="text-right">${formatToCurrency(props.annualIncome / props.payFrequency)}</td>
                                    </tr>
                                    <tr>
                                        <th>Federal Income Taxes</th>
                                        <td className="text-right">${formatToCurrency(props.state.FITPerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <th>Social Security</th>
                                        <td className="text-right">${formatToCurrency(props.state.socialSecurityPerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <th>Medicare</th>
                                        <td className="text-right">${formatToCurrency(props.state.medicarePerPeriod)}</td>
                                    </tr>
                                    {props.state.additionalMedicarePerPeriod > 0 &&
                                        <tr>
                                            <th>Additional Medicare</th>
                                            <td className="text-right">${formatToCurrency(props.state.additionalMedicarePerPeriod)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <th>State taxes</th>
                                        <td className="text-right">${formatToCurrency(props.state.statePerPeriod)}</td>
                                    </tr>
                                    <tr>
                                        <th>Net pay per period</th>
                                        <td className="text-right">${formatToCurrency(props.state.netPay)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={6} mdOffset={0} sm={8} smOffset={2} className="inner-right-xs inner-left-xs outer-top-xs">
                            <h3 className="text-center">Effective Tax Rates (based on Total Income)</h3>
                            <Row>
                                <Col sm={6}>
                                    <h3 className="text-right">Federal</h3>
                                </Col>
                                <Col sm={6} >
                                    <h3 className="green">{formatToDecimal(props.state.federalTaxRate)}%</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={6}>
                                    <h3 className="text-right">State</h3>
                                </Col>
                                <Col sm={6} >
                                    <h3 className="green">{formatToDecimal(props.state.stateTaxRate)}%</h3>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Panel.Body>
            </Panel>
        </Element>
    )
}
export default CalculatorEngine(ReportBreakdown);
