import { utils, Wallet } from 'ethers'
import { solidity } from 'ethereum-waffle'
import { expect, use } from 'chai'

import { trueCurrency } from 'fixtures/trueCurrency'
import { toAddress, WalletOrAddress } from 'utils'
import { loadFixture } from 'fixtures/beforeEachWithFixture'

import { TrueCurrency } from 'contracts'
import {
  MockErc20Token__factory,
  ForceEther__factory,
  MockErc20Token,
} from 'contracts'

use(solidity)

describe('TrueCurrency - Reclaimable', () => {
  const tokenEthBalance = utils.parseEther('1')

  let owner: Wallet
  let otherAccount: Wallet

  let token: TrueCurrency
  let otherToken: MockErc20Token

  beforeEach(async () => {
    ({ wallets: [owner, otherAccount], token } = await loadFixture(trueCurrency))
    const forceEther = await new ForceEther__factory(owner).deploy({ value: utils.parseEther('1') })
    await forceEther.destroyAndSend(token.address)

    otherToken = await new MockErc20Token__factory(owner).deploy()
    await otherToken.mint(token.address, 1000)
  })

  describe('reclaimEther', () => {
    function reclaimEther (caller: Wallet, to: WalletOrAddress) {
      return token.connect(caller).reclaimEther(toAddress(to))
    }

    describe('when the caller is the contract owner', () => {
      it('transfers all Ether balance in the contract to the requested address', async () => {
        const initialBalance = await otherAccount.getBalance()
        await reclaimEther(owner, otherAccount)
        expect(await otherAccount.getBalance()).to.eq(initialBalance.add(tokenEthBalance))
      })
    })

    describe('when the caller is not the contract owner', () => {
      it('reverts', async () => {
        await expect(reclaimEther(otherAccount, otherAccount))
          .to.be.revertedWith('only Owner')
      })
    })
  })

  describe('reclaimToken', () => {
    function reclaimToken (caller: Wallet, tokenToReclaim: WalletOrAddress, to: WalletOrAddress) {
      return token.connect(caller).reclaimToken(toAddress(tokenToReclaim), toAddress(to))
    }

    describe('when the caller is the contract owner', () => {
      it('transfer all requested token balance in the contract to the requested address', async () => {
        await reclaimToken(owner, otherToken.address, otherAccount)
        expect(await otherToken.balanceOf(otherAccount.address)).to.eq(1000)
      })
    })

    describe('when the caller is not the contract owner', () => {
      it('reverts', async () => {
        await expect(reclaimToken(otherAccount, otherToken.address, otherAccount))
          .to.be.revertedWith('only Owner')
      })
    })
  })
})
