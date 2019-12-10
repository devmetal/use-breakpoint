import React from 'react'
import { storiesOf } from '@storybook/react'

import useBreakpoint from './useBreakpoint'

import './story.css'

const opts = {
    notes: { markdown: "" }
}

storiesOf('Hooks|useBreakpoint', module).add(
    'Default',
    () => {
        const value = useBreakpoint('none', [
            ['micro', 'is micro'],
            ['mobile', 'is mobile'],
            ['tablet', 'is tablet'],
            ['small', 'is small'],
            ['medium', 'is medium'],
            ['large', 'is large']
        ])

        return <div>
            Example code
            <pre>{`const value = useBreakpoint('none', [
    ['micro', 'is micro'],
    ['mobile', 'is mobile'],
    ['tablet', 'is tablet'],
    ['small', 'is small'],
    ['medium', 'is medium'],
    ['large', 'is large']
])`}
            </pre>
            <div>`{value}` is the current value. Resize to change.</div>
            <div><br />For more info please see <strong>Notes</strong> tab.</div>
        </div>
    },
    opts
)
