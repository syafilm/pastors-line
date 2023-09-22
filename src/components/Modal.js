import React, {useEffect} from 'react'
import styled from '@emotion/styled'

const Modal = ({
  children,
  width,
  height,
  onClose,
  show,
  ...props
}) => {

  return(
    <Wrapper show={show} {...props}>
      <Body 
        height={height} 
        width={width}>
        <Content>
          {children}
        </Content>
      </Body>
      <Backdrop onClick={onClose} />
    </Wrapper>
  )
}

export default Modal

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: ${props => props.zIndex ? `${props.zIndex}` : `999`};
  top: 0;
  left: 0;
  bott: 0;
  right: 0;
  display: ${props => props.show ? `flex` : `none`};
  align-items: center;
  justify-content: center;
`

const Body = styled.div`
  width: ${props => props.width ? `${props.width}` : `800px`};
  min-height: ${props => props.height ? `${props.height}` : `800px`};
  background: #fff;
  border-radius: 5px;
  z-index: 122;
  position: absolute;
`

const Content = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  position: sticky;
  background: rgba(0,0,0, 0.5);
  z-index: 111;
`