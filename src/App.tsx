import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import Filters from './Filters'

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
      <Title>Image Filters</Title>
      <Filters />
    </>
  )
}
