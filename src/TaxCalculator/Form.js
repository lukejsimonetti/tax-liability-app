import React from 'react'
import {
	Button,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	FormControl,
	InputGroup,
	Panel,
	HelpBlock
} from 'react-bootstrap'
import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';

import YesNoGroup from './YesNoGroup'

import { payFrequency } from '../Data/payFrequency'
import { filingStatus } from '../Data/filingStatus'
import { states } from '../Data/states'
import { dependents } from '../Data/dependents'


const Form = props => {

	const handlePayFrequencyChange = (e) => {
		props.handleChange("payFrequency", e.value)
		props.handleChange("_payFrequency", e.amount)
	}

	const handleFilingStatusChange = e => {
		props.handleChange('filingStatusSelectVal', e.value)
		props.handleChange('filingStatus', e.filingStatus)
	}

	return (
		<Panel id="calculator-form" className="inner-top-xs">
			<Panel.Body>
				<form>
					<Row>
						<Col sm={10} md={12} className="center-block" >
							<Row>
								<Col sm={12}>
								<br/>
								<br/>
								<h1 className="text-center">
									Tax Liability Calculator
								</h1>
								<h4 className="text-center">
									Input your annual income below to calculate your estimated 2018 tax liability.
								</h4>
								<br/>
								<br/>
								<br/>
								</Col>
							</Row>
							<Row>
								<Col md={6} className="inner-right inner-left outer-bottom-xs" style={{ zIndex: 1 }} >

									<h2 className="text-center"><span>About You</span></h2>
									<br/>
									<FormGroup controlId="minister">
										<ControlLabel>Are you an ordained Minister?</ControlLabel>
										<YesNoGroup
											value={props.state.isMinister}
											onChange={val => props.handleChange('isMinister', val)}
										/>
									</FormGroup>

									<FormGroup controlId="state" validationState={props.state.stateSelectHasError ? 'error' : null} >
										<ControlLabel>What's your state?</ControlLabel>
										<ReactSelect
											placeholder="Select one"
											clearable={false}
											label="State"
											value={props.state.stateName}
											options={states}
											onChange={e => props.handleChange('stateName', e.value)}
										/>
										{props.state.stateSelectHasError && <HelpBlock>Please select a state</HelpBlock>}
									</FormGroup>

									<FormGroup controlId="annualIncome" validationState={props.state.incomeHasError ? 'error' : null} >
										<ControlLabel>What's your annual Income?</ControlLabel>
										<InputGroup>
											<InputGroup.Addon>$</InputGroup.Addon>
											<FormControl
												value={props.state.annualIncome}
												onChange={e => props.handleChange('annualIncome', e.target.value)}
											/>
										</InputGroup>
										{props.state.incomeHasError && <HelpBlock>Please enter a valid number amount with no commas.</HelpBlock>}
									</FormGroup>

									<FormGroup controlId="payFrequency" >
										<ControlLabel>How often do you get paid?</ControlLabel>
										<ReactSelect
											clearable={false}
											label="Pay Frequency"
											value={props.state.payFrequency}
											options={payFrequency}
											onChange={handlePayFrequencyChange}
										/>
									</FormGroup>

								</Col>

								<Col md={6} className="inner-right inner-left outer-bottom-xs border-left">

									<h2 className="text-center"><span>About Your Taxes</span></h2>
									<br/>
									<FormGroup controlId="filingStatus">
										<ControlLabel>What's your filing status?</ControlLabel>
										<ReactSelect
											clearable={false}
											label="Filing Status"
											value={props.state.filingStatusSelectVal}
											options={filingStatus}
											onChange={handleFilingStatusChange}
										/>
									</FormGroup>

									<FormGroup controlId="dependents">
										<ControlLabel>How many dependents do you claim?</ControlLabel>
										<ReactSelect
											clearable={false}
											value={props.state.withholdings}
											options={dependents}
											onChange={e => props.handleChange('withholdings', e.value)}
										/>
									</FormGroup>

									{props.state.isMinister === 1 &&
										<FormGroup controlId="isHousingAllowance">
											<ControlLabel>Do you have an approved Housing Allowance amount?</ControlLabel>
											<YesNoGroup
												value={props.state.isHousingAllowance}
												onChange={val => props.handleChange('isHousingAllowance', val)}
											/>
										</FormGroup>
									}

									{(props.state.isHousingAllowance === 1 && props.state.isMinister === 1) &&
										<FormGroup controlId="housingAllowance" validationState={props.state.housingAllowanceHasError ? 'error' : null} >
											<ControlLabel>How much is your annual Housing Allowance?</ControlLabel>
											<InputGroup>
												<InputGroup.Addon>$</InputGroup.Addon>
												<FormControl
													value={props.state.housingAllowance}
													onChange={e => props.handleChange('housingAllowance', e.target.value)}
												/>
											</InputGroup>
											{props.state.housingAllowanceHasError && <HelpBlock>Please enter a valid number amount with no commas.</HelpBlock>}
										</FormGroup>
									}

									{props.state.isMinister === 1 &&
										<FormGroup controlId="isExempt">
											<ControlLabel>Are you exempt from Self-Employment taxes?</ControlLabel>
											<YesNoGroup
												value={props.state.isExempt}
												onChange={val => props.handleChange('isExempt', val)}
											/>
										</FormGroup>
									}

									<FormGroup controlId="isUsesPayroll">
										<ControlLabel>Do you use a payroll company to withhold your taxes?</ControlLabel>
										<YesNoGroup
											value={props.state.isUsesPayroll}
											onChange={val => props.handleChange('isUsesPayroll', val)}
										/>
									</FormGroup>

								</Col>
								<Col sm={12} className="text-center" style={{marginTop: 20}}>
									<Button className="btn-large" bsStyle="success" onClick={props.calculateButton} style={{ whiteSpace: 'pre-wrap' }} >Calculate now</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</form>
			</Panel.Body>
		</Panel>
	)
}

export default Form