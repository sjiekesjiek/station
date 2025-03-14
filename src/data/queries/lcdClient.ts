import { useMemo } from "react"
import { LCDClient as InterchainLCDClient } from "@terraclassic-community/feather.js"
import { LCDClient } from "@terraclassic-community/terra.js"
import { useChainID, useNetwork } from "data/wallet"

export const useInterchainLCDClient = () => {
  const network = useNetwork()

  const lcdClient = useMemo(() => new InterchainLCDClient(network), [network])

  return lcdClient
}

export const useLCDClient = () => {
  const network = useNetwork()
  const chainID = useChainID()

  const lcdClient = useMemo(
    () =>
      new LCDClient({
        ...network[chainID],
        URL: "https://lcd.terraclassic.community",
      }),
    [network, chainID]
  )

  return lcdClient
}
