import React, { Component } from 'react'

import { federalTaxBrackets } from '../Data/federalTaxBrackets.js'
import { stateTaxBrackets } from '../Data/stateTaxBrackets'
import misc from '../Data/misc.json'
import _ from 'lodash'

export const CalculatorEngine = (WrappedForm) => {
    return class CalculatorEngine extends Component {
        constructor(props) {
            super(props)
            this.state = {
                totalFederalTaxes: 0.00,
                totalStateTaxes: 0.00,
                netPay: 0.00,
                federalTaxRate: 0,
                stateTaxRate: 0,

                w4AdditionalWithholding: 0.00,
                quarterlyFederalPayments: 0.00,
                quarterlyStatePayments: 0.00,

                FITPerPeriod: 0.00,
                socialSecurityPerPeriod: 0.00,
                medicarePerPeriod: 0.00,
                additionalMedicarePerPeriod: 0.00,
                statePerPeriod: 0.00,

                //calculated static totals
                _FITWages: 0.00,
                _socialSecurityWages: 0.00,
                _medicareWages: 0.00,
                _additionalMedicareWages: 0.00,
                _stateWages: 0.00,
            }

        }

        componentDidUpdate(prevProps, prevState) {
            if (prevProps !== this.props) {
                if (this.props.showResults) {
                    Promise.all([
                        this.calculateStateTaxPerPeriod(),
                        this.calculateStateWages(),
                        this.calculateAdditionalMedicare(),
                        this.calculateMedicare(),
                        this.calculateSocialSecurity()
                    ]).then((res) => {
                        this.calculateFIT().then((res) => {
                            this.calculateTotals()
                        })
                    })
                }
            }
        }

        calculateTotals = () => {
            const s = this.props.state

            let totalFederalTaxes = _.round((
                this.state.FITPerPeriod
                + this.state.socialSecurityPerPeriod
                + this.state.medicarePerPeriod
                + this.state.additionalMedicarePerPeriod
            ), 2)
            let totalStateTaxes = _.round(this.state.statePerPeriod, 2)
            let netPay = _.round(s._annualIncome - (totalFederalTaxes + totalStateTaxes), 2)
            let federalTaxRate = _.round(totalFederalTaxes / s._annualIncome * 100, 2)
            let stateTaxRate = _.round(totalStateTaxes / s._annualIncome * 100, 2)

            let quarterlyFederalPayments = 0.00
            let quarterlyStatePayments = 0.00
            if (!s.isUsesPayroll && s.isMinister) {
                quarterlyFederalPayments = _.round(totalFederalTaxes * (s.payFrequency / 4), 2)
                quarterlyStatePayments = _.round(totalStateTaxes * (s.payFrequency / 4), 2)
            }

            let w4AdditionalWithholding = 0.00
            if (s.isUsesPayroll && s.isMinister && !s.isExempt) {
                w4AdditionalWithholding = _.round((
                    this.state.socialSecurityPerPeriod
                    + this.state.medicarePerPeriod
                    + this.state.additionalMedicarePerPeriod), 2)
            }

            this.setState({
                totalFederalTaxes,
                totalStateTaxes,
                netPay,
                federalTaxRate,
                stateTaxRate,
                quarterlyFederalPayments,
                quarterlyStatePayments,
                w4AdditionalWithholding
            })
        }

        calculateFIT = () => {
            return new Promise(resolve => {
                const s = this.props.state

                if (!s.isMinister) {
                    let _FITWages = _.round(s._annualIncome - s._withholdings, 2)

                    let bracket = this.getFederalTaxBracket(_FITWages)
                    let wagesSubFloor = _FITWages - bracket.Floor
                    let multipledByRate = wagesSubFloor * bracket.Rate
                    let FITPerPeriod = _.round(multipledByRate + bracket.CumulativeTax, 2)

                    this.setState({ _FITWages, FITPerPeriod }, resolve(true))
                    return
                }

                let withholdingsAndHA = s._withholdings + s._housingAllowance
                let taxesPerPeriod = this.state.socialSecurityPerPeriod + this.state.medicarePerPeriod
                let divByTwo = (taxesPerPeriod / 2)
                let addedTotals = withholdingsAndHA + divByTwo
                let _FITWages = _.round(s._annualIncome - addedTotals, 2)

                let bracket = this.getFederalTaxBracket(_FITWages)
                let wagesSubFloor = _FITWages - bracket.Floor
                let multipledByRate = wagesSubFloor * bracket.Rate
                let FITPerPeriod = _.round(multipledByRate + bracket.CumulativeTax, 2)

                this.setState({ _FITWages, FITPerPeriod }, resolve(true))
            })
        }

        calculateSocialSecurity = () => {
            return new Promise(resolve => {
                const s = this.props.state
                if (s.isMinister && s.isExempt) {
                    let _socialSecurityWages = 0.00
                    let socialSecurityPerPeriod = 0.00
                    this.setState({ _socialSecurityWages, socialSecurityPerPeriod }, resolve(true))
                    return true
                } else {
                    const socialSecurityMax = misc.socialSecurityMax

                    let _socialSecurityWages = _.round(Math.min(s._annualIncome, (socialSecurityMax / s.payFrequency)), 2)
                    this.getSocialSecurityRatePerPeriod(_socialSecurityWages)
                        .then((socialSecurityPerPeriod) => {
                            this.setState({ _socialSecurityWages, socialSecurityPerPeriod }, resolve(true))
                        })
                    return true
                }
            })
        }

        calculateMedicare = () => {
            const s = this.props.state
            return new Promise(resolve => {
                if (s.isMinister && s.isExempt) {
                    let _medicareWages = 0.00
                    let medicarePerPeriod = 0.00
                    this.setState({ _medicareWages, medicarePerPeriod }, resolve(true))
                    return true
                }

                let _medicareWages = s._annualIncome
                this.getMedicareRatePerPeriod(_medicareWages).then((medicarePerPeriod) => {
                    this.setState({ _medicareWages, medicarePerPeriod }, resolve(true))
                })
                return true
            })
        }

        calculateAdditionalMedicare = () => {
            const s = this.props.state
            return new Promise(resolve => {
                if (s.isMinister && s.isExempt) {
                    let _additionalMedicareWages = 0.00
                    let additionalMedicarePerPeriod = 0.00
                    this.setState({ _additionalMedicareWages, additionalMedicarePerPeriod }, resolve(true))
                    return true
                }

                let additionalMedicareMin = misc.additionalMedicareMin.notMarried
                if (s.filingStatus === 2) {
                    additionalMedicareMin = misc.additionalMedicareMin.married
                }

                if (s.annualIncome > additionalMedicareMin) {
                    const additionalMedicareRate = misc.additionalMedicareRate
                    let incomeDiff = s.annualIncome - additionalMedicareMin
                    let _additionalMedicareWages = _.round((incomeDiff / s.payFrequency), 2)

                    let additionalMedicarePerPeriod = _.round(((_additionalMedicareWages * additionalMedicareRate * 2) / 100), 2)
                    this.setState({ _additionalMedicareWages, additionalMedicarePerPeriod }, resolve(true))
                    return true
                }
                let _additionalMedicareWages = 0.00
                let additionalMedicarePerPeriod = 0.00
                this.setState({ _additionalMedicareWages, additionalMedicarePerPeriod }, resolve(true))
                return true
            })
        }

        calculateStateWages = () => {
            const s = this.props.state
            return new Promise(resolve => {
                if (s.isMinister) {
                    let _stateWages = (s._annualIncome - s._housingAllowance)
                    this.setState({ _stateWages }, resolve(true))
                    return true
                }
                let _stateWages = s._annualIncome
                this.setState({ _stateWages }, resolve(true))
                return true
            })
        }

        calculateStateTaxPerPeriod() {
            const s = this.props.state

            return new Promise(resolve => {
                let bracket = this.getStateTaxBracket()
                let subFloor = s._state - bracket.Floor
                let mulRate = subFloor * bracket.Rate
                let rateAddCumulativeTax = mulRate + bracket.CumulativeTax

                let statePerPeriod = _.round((rateAddCumulativeTax / s.payFrequency), 2)
                this.setState({ statePerPeriod }, resolve(true))
            })
        }

        getSocialSecurityRatePerPeriod = (_socialSecurityWages) => {
            const s = this.props.state
            const minister = _.round(((_socialSecurityWages * misc.socialSecurityRate.minister) / 100), 2)
            const nonMinister = _.round(((_socialSecurityWages * misc.socialSecurityRate.nonMinister) / 100), 2)
            return new Promise(resolve => {
                if (s.isMinister) {
                    resolve(minister)
                }
                resolve(nonMinister)
            })
        }

        getMedicareRatePerPeriod = (_medicareWages) => {
            const s = this.props.state
            const ministerMedicareRate = _.round(((_medicareWages * misc.medicareRate.minister) / 100), 2)
            const nonMinisterMedicareRate = _.round(((_medicareWages * misc.medicareRate.nonMinister) / 100), 2)

            return new Promise(resolve => {
                if (s.isMinister) {
                    resolve(ministerMedicareRate)
                    return
                }
                resolve(nonMinisterMedicareRate)
            })

        }

        getStateTaxBracket() {
            const s = this.props.state
            const status = s.filingStatus
            const stateName = s.stateName
            let calculatedStateVal = s._state

            if(calculatedStateVal <= 0){
                calculatedStateVal = 1
            }
            // eslint-disable-next-line
            let result = stateTaxBrackets.filter((v, i) => {
                if (v.Status === status && v.State === stateName) {
                    if (calculatedStateVal > v.Floor && calculatedStateVal <= v.Ceiling) {
                        return v
                    }
                }
            })
            return result[0]
        }

        getFederalTaxBracket = (_FITWages) => {
            const s = this.props.state
            const status = s.filingStatus
            const period = s.payFrequency

            if(_FITWages <= 0){
                _FITWages = 1
            }
            // eslint-disable-next-line
            let result = federalTaxBrackets.filter((v, i) => {
                if (v.Status === status && v.Period === period) {
                    if (_FITWages > v.Floor && _FITWages <= v.Ceiling) {
                        return v
                    }
                }
            })
            return result[0]
        }

        render() {
            return (
                <WrappedForm
                    state={this.state}
                    annualIncome={this.props.annualIncome}
                    showResults={this.props.showResults}
                    isUsesPayroll={this.props.state.isUsesPayroll}
                    isMinister={this.props.state.isMinister}
                    payFrequency={this.props.payFrequency}
                />
            )
        }
    }
}
