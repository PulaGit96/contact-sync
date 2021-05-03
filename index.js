const { getContacts } = require("./services/mixPanelService")
const { createContacts } = require("./services/hubSpotService");
const _ = require("lodash");

(async () => {
  const groups = await getContacts()

  const allContacts = _.uniq(_.flatMap(groups
    .map(g => g.contacts))
    .filter(a => a.$email), a => a.$email)

  allContacts.map(c => {
    c.cohorts = groups.filter(g =>  g.contacts.some(cc => c.$email === cc.$email))
        .map(c => c.name)
  })
  
  const finalGroups = {}

  allContacts.forEach(c => {
    c.cohorts.forEach(ch => {
      if (finalGroups[ch]) {
        finalGroups[ch].contacts.push(c)
      } else {
        finalGroups[ch] = {
          name: ch,
          contacts: [c]
        }
      }
    })
  })

  console.log(JSON.stringify(finalGroups, null, 2))
  
  
  for (const group of groups) {
    await createContacts(group)
  }
})()
