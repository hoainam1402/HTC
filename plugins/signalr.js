import * as SignalR from '@microsoft/signalr'

export default ({ $auth, $config, store }, inject) => {
  function generateHub() {
    let token = ''
    if ($auth.loggedIn) {
      token = $auth.strategy.token.get().split(' ')[1]
    }
    const hub = new SignalR.HubConnectionBuilder()
      .withUrl(`${$config.apiURL}/signalr`, {
        transports: SignalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token
      })
      .build()

    hub.onclose((error) => {
      console.error('signalr error', error)
    })

    return hub
  }

  const hub = generateHub()

  inject('hub', hub)
  inject('startHub', async () => await hub.start())
  inject('stopHub', async () => await hub.stop())
}
