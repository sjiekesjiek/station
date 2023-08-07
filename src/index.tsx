import { StrictMode } from "react"
import { render } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { ReactQueryDevtools } from "react-query/devtools"
import { RecoilRoot } from "recoil"
import { getChainOptions } from "@terraclassic-community/wallet-controller"
import { WalletProvider } from "@terraclassic-community/wallet-provider"
import "tippy.js/dist/tippy.css"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { initSentry } from "utils/sentry/setupSentry"

import "config/lang"
import { BRIDGE } from "config/constants"
import { debug } from "utils/env"

import "index.scss"
import ScrollToTop from "app/ScrollToTop"
import InitNetworks from "app/InitNetworks"
import InitWallet from "app/InitWallet"
import InitTheme from "app/InitTheme"
import ElectronVersion from "app/ElectronVersion"
import App from "app/App"
import InitChains from "app/InitChains"
import WithNodeInfo from "app/WithNodeInfo"
import InitQueryClient from "app/InitQueryClient"

const connectorOpts = { bridge: BRIDGE }
initSentry()

getChainOptions().then((chainOptions) =>
  render(
    <StrictMode>
      <RecoilRoot>
        <BrowserRouter>
          <ScrollToTop />
          <WalletProvider {...chainOptions} connectorOpts={connectorOpts}>
            <InitQueryClient>
              <InitNetworks>
                <WithNodeInfo>
                  <InitChains>
                    <InitWallet>
                      <InitTheme />
                      <ElectronVersion />
                      <App />
                    </InitWallet>
                  </InitChains>
                </WithNodeInfo>
              </InitNetworks>
              {debug.query && <ReactQueryDevtools position="bottom-right" />}
            </InitQueryClient>
          </WalletProvider>
        </BrowserRouter>
      </RecoilRoot>
    </StrictMode>,
    document.getElementById("station")
  )
)

serviceWorkerRegistration.register()
