import React from 'react'
import { Button, ButtonGroup } from 'react-bootstrap'

const YesNoGroup = props => (
    <div>
        <ButtonGroup>
            <Button
                bsStyle={props.value === 1 ? 'success' : 'default'}
                style={{ margin: 0, paddingTop: 6, paddingBottom: 8 }}
                onClick={() => props.onChange(1)} >
                Yes
            </Button>
            <Button
                bsStyle={props.value === 0 ? 'danger' : 'default'}
                style={{ margin: 0, paddingTop: 6, paddingBottom: 8 }}
                onClick={() => props.onChange(0)} >
                No
            </Button>
        </ButtonGroup>
    </div>
)

export default YesNoGroup