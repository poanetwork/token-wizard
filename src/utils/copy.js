import Clipboard from 'clipboard'
import logdown from 'logdown'
import { toast } from './utils'

const logger = logdown('TW:utils:copy')

export const copy = cls => {
  let clipboard = new Clipboard(cls)

  clipboard.on('success', function(e) {
    logger.info('Action:', e.action)
    logger.info('Text:', e.text)
    logger.info('Trigger:', e.trigger)

    e.clearSelection()
  })

  clipboard.on('error', function(e) {
    logger.error('Action:', e.action)
    logger.error('Trigger:', e.trigger)
  })

  return clipboard
}

export const showClipboardCopyToast = title => {
  let copyMessage = title ? `"${title}" copied to clipboard.` : 'Copied to clipboard'

  toast.showToaster({ message: copyMessage, options: { time: 3000 } })
}
