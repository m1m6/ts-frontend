import { createBrowserHistory } from 'history'

export const browserHistory = createBrowserHistory()

browserHistory.listen(e => {
    console.log("browser history", e);
})