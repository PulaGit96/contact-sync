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
  
  
  
  console.log(allContacts.map(c => c.cohorts));

  const groups = 
  
  
  /*for (const group of groups) {
    await createContacts(group)
  }*/
})()
