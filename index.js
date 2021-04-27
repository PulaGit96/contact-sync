import { getContacts } from "./services/mixPanelService"

const contacts = await getContacts()

console.log(contacts)
