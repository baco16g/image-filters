import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import KuwaharaFilter from './Kuwahara-Filter'

const GlobalStyle = createGlobalStyle`
  ${reset}
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  line-height: 1.5;
  padding: 24px 0;
`

export default function App() {
  return (
    <>
      <Title>Kuwahara Filter</Title>
      <KuwaharaFilter />
    </>
  )
}
