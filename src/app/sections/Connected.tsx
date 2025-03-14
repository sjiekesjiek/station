import { useState } from "react"
import { useTranslation } from "react-i18next"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import GroupsIcon from "@mui/icons-material/Groups"
import UsbIcon from "@mui/icons-material/Usb"
import BluetoothIcon from "@mui/icons-material/Bluetooth"
import { truncate } from "@terra-money/terra-utils"
import { useAddress } from "data/wallet"
import { useTnsName } from "data/external/tns"
import { Button } from "components/general"
import { Grid } from "components/layout"
import { List, Popover } from "components/display"
import useAuth from "auth/hooks/useAuth"
import SwitchWallet from "auth/modules/select/SwitchWallet"
import PopoverNone from "../components/PopoverNone"
import styles from "./Connected.module.scss"
import { useRecoilState } from "recoil"
import { isWalletBarOpen, Path, walletBarRoute } from "pages/wallet/Wallet"
import { useNavigate } from "react-router-dom"
import { useWallet } from "@terraclassic-community/use-wallet"
import {
  Contacts as ContactsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import isWallet from "../../auth/scripts/isWallet"

const Connected = () => {
  const { t } = useTranslation()
  const address = useAddress()
  const navigate = useNavigate()
  const { wallet, getLedgerKey, disconnect: disconnectLedger } = useAuth()
  const { disconnect } = useWallet()
  const { data: name } = useTnsName(address ?? "")
  const [, setWalletIsOpen] = useRecoilState(isWalletBarOpen)
  const [, setWalletRoute] = useRecoilState(walletBarRoute)

  /* hack to close popover */
  const [key, setKey] = useState(0)
  const closePopover = () => setKey((key) => key + 1)

  if (!address) return null

  const footer = {
    to: "/auth",
    onClick: closePopover,
    children: t("Manage wallets"),
  }

  const list = [
    {
      onClick: () => {
        isWallet.ledger(wallet) ? disconnectLedger() : disconnect()
        navigate("/", { replace: true })
        closePopover()
      },
      children: t("Disconnect"),
      icon: <LogoutIcon style={{ fontSize: 16 }} />,
    },
    {
      onClick: () => {
        setWalletIsOpen(true)
        setWalletRoute({
          path: Path.receive,
          previousPage: { path: Path.wallet },
        })
        closePopover()
      },
      children: t("View wallet addresses"),
      icon: <ContactsIcon style={{ fontSize: 16 }} />,
    },
  ]

  if (isWallet.ledger(wallet)) {
    list.push({
      onClick: async () => {
        const lk = await getLedgerKey("330")
        lk.showAddressAndPubKey("terra")
      },
      children: t("Show address in Ledger"),
      icon: <UsbIcon style={{ fontSize: 16 }} />,
    })
  }

  return (
    <Popover
      key={key}
      content={
        <PopoverNone
          className={styles.popover}
          footer={isWallet.local(wallet) ? footer : undefined}
        >
          <Grid gap={40}>
            <SwitchWallet />
            <List list={list} />
          </Grid>
        </PopoverNone>
      }
      placement="bottom-end"
      theme="none"
    >
      <Button
        icon={
          isWallet.ledger(wallet) ? (
            wallet.bluetooth ? (
              <BluetoothIcon style={{ fontSize: 16 }} />
            ) : (
              <UsbIcon style={{ fontSize: 16 }} />
            )
          ) : isWallet.multisig(wallet) ? (
            <GroupsIcon style={{ fontSize: 16 }} />
          ) : (
            <AccountBalanceWalletIcon style={{ fontSize: 16 }} />
          )
        }
        size="small"
        outline
        className={styles.button}
      >
        <span className={styles.button__text}>
          {isWallet.local(wallet) ? wallet.name : truncate(name ?? address)}
        </span>
      </Button>
    </Popover>
  )
}

export default Connected
