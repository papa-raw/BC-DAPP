import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import ActiveButton from '../common/ActiveButton'
import InactiveButton from '../common/InactiveButton'
import store from '../../stores/Root'

const FormWrapper = styled.div`
  height: 200px;
  padding: 6px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 24px;
  color: var(--dark-text-gray);
  margin-bottom: 12px;
`

const FormInfoText = styled.div`
  color: var(--light-text-gray);
`

const SignTransaction = styled.div`
  // font-family: SF Pro Text;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  letter-spacing: 0.4px;
  color: var(--panel-pending);
  margin-top: 8px;
  margin-bottom: 23px;
`

const PendingCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 10px;
  border: 1px solid var(--panel-icon-2);
`

@observer
class BuySign extends React.Component {

  constructor(props) {
      super(props)
  }

	render() {

    const { infotext } = this.props
    const price = store.tradingStore.price
    const buyAmount = store.tradingStore.buyAmount
    const priceToBuy = store.tradingStore.priceToBuy

    const Button = ({active, children, onClick}) => {
      if (active === true) {
        return (
          <ActiveButton onClick={onClick}>{children}</ActiveButton>
        ) 
      } else {
        return (
          <InactiveButton onClick={onClick}>{children}</InactiveButton> 
        )
      }
    }

	  return (
      <FormWrapper>
        <InfoRow>
          <FormInfoText>Price</FormInfoText>
          <div>{price} TKN</div>
        </InfoRow>
        <InfoRow>
          <FormInfoText>{infotext}</FormInfoText>
          <div>{priceToBuy} TKN</div>
        </InfoRow>
        <InfoRow>
          <FormInfoText>Receive</FormInfoText>
          <div>{buyAmount} DXD</div>
        </InfoRow>
        <SignTransaction>
          Sign Transaction...
          <PendingCircle />
        </SignTransaction>
        <Button active={false}>Buy DXD</Button>
      </FormWrapper>
	  )
	}
}

export default BuySign
