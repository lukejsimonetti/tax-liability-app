import React, { Component } from 'react'
import { scroller, Element } from 'react-scroll';
import ReportBreakdown from './ReportBreakdown'
import Form from './Form'
import Check from './Check'
import _ from 'lodash'

class TaxCalcWrapper extends Component {
	constructor(props) {
		super(props)

		this.state = {
			formHasError: false,
			stateSelectHasError: false,
			incomeHasError: false,
			housingAllowanceHasError: false,

			showResults: false,

			isMinister: 1,
			payFrequency: 1,
			filingStatus: 2,
			filingStatusSelectVal: 2,
			withholdings: 1,
			annualIncome: '',
			isHousingAllowance: 0,
			housingAllowance: '',
			isExempt: 0,
			isUsesPayroll: 0,
			stateName: "",

			requiresUpdate: true,
			//calculated static totals
			_payFrequency: 4150,
			_withholdings: 0.00,
			_annualIncome: 0.00,
			_housingAllowance: 0.00,
			_state: 0.00,
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			this.recalculateStaticTotals()
		}
	}

	validateStateName = () => {
		return new Promise(resolve => {
			this.state.stateName === '' ?
				this.setState({ stateSelectHasError: true, formHasError: true }, resolve(true)) :
				this.setState({ stateSelectHasError: false }, resolve(true))
		})
	}

	validateAnnualIncome = () => {
		return new Promise(resolve => {
			isNaN(this.state.annualIncome) || this.state.annualIncome === '' ?
				this.setState({ incomeHasError: true, formHasError: true }, resolve(true)) :
				this.setState({ incomeHasError: false }, resolve(true))
		})
	}

	validateHousingAllowance = () => {
		return new Promise(resolve => {
			this.state.isHousingAllowance === 1 && this.state.isMinister === 1 && (isNaN(this.state.housingAllowance) || this.state.housingAllowance === '') ?
				this.setState({ housingAllowanceHasError: true, formHasError: true }, resolve(true)) :
				this.setState({ housingAllowanceHasError: false }, resolve(true))
		})
	}

	validateForm = () => {
		return new Promise(resolve => {
			Promise.all([
				this.validateStateName(),
				this.validateAnnualIncome(),
				this.validateHousingAllowance()
			]).then(res => {
				resolve(true)
			})
		})
	}

	calculateButton = () => {
		this.setState({ formHasError: false }, () => {
			this.validateForm().then(res => {
				if (!this.state.formHasError) {
					this.setState({ requiresUpdate: true, showResults: true }, this.recalculateStaticTotals)
					scroller.scrollTo('report-breakdown', {
						duration: 1000,
						delay: 300,
						smooth: true,
						offset: -70
					})
				} else {
					scroller.scrollTo('form', {
						duration: 1000,
						delay: 300,
						smooth: true,
						offset: -70
					})
				}
			})
		})
	}

	handleChange = (name, value) => {
		if(name === 'isHousingAllowance' && value === 0){
			this.setState({housingAllowance: 0.00})
		}
		this.setState({
			[name]: value,
			requiresUpdate: true,
			showResults: false
		})
	}

	recalculateStaticTotals = () => {
		if (!this.state.requiresUpdate) {
			return
		}

		const s = this.state

		let _withholdings = _.round((s.withholdings * s._payFrequency), 2)

		let _annualIncome = _.round((s.annualIncome / s.payFrequency), 2)

		let _housingAllowance = _.round((s.housingAllowance / s.payFrequency), 2)

		let _state = s.annualIncome
		if (s.isMinister) {
			_state = (s.annualIncome - s.housingAllowance)
		}

		this.setState({
			_state: _state,
			_withholdings: _withholdings,
			_annualIncome: _annualIncome,
			_housingAllowance: _housingAllowance,
			requiresUpdate: false,
		})
	}

	render() {
		return (
			<Element name="form">
				<Form
					state={this.state}
					handleChange={this.handleChange}
					calculateButton={this.calculateButton}
				/>
				<br/>
				<ReportBreakdown
					state={this.state}
					showResults={this.state.showResults}
					annualIncome={this.state.annualIncome}
					payFrequency={this.state.payFrequency}
				/>
				<br/>
				<Check
					state={this.state}
					showResults={this.state.showResults}
					annualIncome={this.state.annualIncome}
					isUsesPayroll={this.state.isUsesPayroll}
					payFrequency={this.state.payFrequency}
				/>
			</Element>
		);
	}
}

export default TaxCalcWrapper;
