import { useTranslation } from "react-i18next"
import UsbIcon from "@mui/icons-material/Usb"
import { useWallet } from "@terraclassic-community/wallet-provider"
import { STATION } from "config/constants"
import { RenderButton } from "types/components"
import { useAddress } from "data/wallet"
import { Button, ExternalLink } from "components/general"
import { Grid } from "components/layout"
import { List } from "components/display"
import { ModalButton } from "components/feedback"
import { FormHelp } from "components/form"
import SwitchWallet from "auth/modules/select/SwitchWallet"
import Connected from "./Connected"
import useAuth from "../../auth/hooks/useAuth"

interface Props {
  renderButton?: RenderButton
}

const ConnectWallet = ({ renderButton }: Props) => {
  const { t } = useTranslation()

  const { connect, availableConnections, availableInstallations } = useWallet()

  const { available } = useAuth()

  const address = useAddress()
  if (address) return <Connected />

  const defaultRenderButton: Props["renderButton"] = (open) => (
    <Button onClick={open} size="small" outline>
      {t("Connect")}
    </Button>
  )

  const list = [
    ...availableConnections
      .filter(({ type }) => type !== "READONLY")
      .map(({ type, identifier, name, icon }) => ({
        src: icon,
        children: name,
        onClick: () => connect(type, identifier),
      })),
    {
      icon: <UsbIcon />,
      to: "/auth/ledger",
      children: t("Access with ledger"),
    },
    ...availableInstallations.map(({ name, icon, url }) => ({
      src: icon,
      children: t(`Install ${name}`),
      href: url,
    })),
  ]

  return (
    <ModalButton
      title={t("Connect wallet")}
      renderButton={renderButton ?? defaultRenderButton}
      maxHeight
    >
      <Grid gap={20}>
        <SwitchWallet />
        <List list={available.length ? available : list} />
        {!!available.length && (
          <FormHelp>
            Use <ExternalLink href={STATION}>Station</ExternalLink> on the
            browser to access with Ledger device
          </FormHelp>
        )}
      </Grid>
    </ModalButton>
  )
}

export default ConnectWallet
