const { getContacts } =  require("./services/mixPanelService")
const  { createContacts } = require("./services/hubSpotService");

(async () => {
  const groups = await getContacts()
  for (const group of groups) {
    await createContacts(group)
  }
})()
  // .then(list => {
  //     list.map(item => {
  //       item.contacts.then(contacts => {
  //         if (contacts.length) {
  //           createContacts({ contacts: [contacts[0]], name: item.cohortName})
  //         }
  //       })
  //     })
  // })