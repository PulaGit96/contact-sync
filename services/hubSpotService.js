const fetch = require("node-fetch")
const { hubSpotApiUrl, hubSpotApiKey } = require("../constants")
const { handleFetch } = require("../helpers/fetchHelper")

exports.createContacts = async (contactsGroup) => {
  if (!contactsGroup || 
    !contactsGroup.name || !contactsGroup.contacts ||
      !contactsGroup.contacts.length
    ) {
      return null
  }

  const groupName = contactsGroup.name

  console.log("Creating contacts for " + groupName)

  for (const contact of contactsGroup.contacts) {
      if (!contact.$email) {
        console.log("No email for the contact. skipping", JSON.stringify(contact, null, 2))
        continue
      }

      let split =  !contact.$name ? ["", ""] : contact.$name.split(" ")

      if (split.length > 2) {
        split[1] = split[1] + " " + split[2]
      }

      const model = {
        email: contact.$email,
        firstname: split[0],
        lastname: split[1],
        mixpanelcohort: groupName
      }


      const headers =  {
        "content-type": "application/json"
      }

      try {
        console.log(`Trying to update ${contact.$name}`)
        await handleFetch(fetch(`${hubSpotApiUrl}/objects/contacts/${contact.$email}?hapikey=${hubSpotApiKey}&idProperty=email`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ properties: model })
        }))
        console.log(`Contact updated`, JSON.stringify(model, null, 2))
      } catch(e) {
        if (e.status === 404) {
          console.log(`Contact doesn't exist. creating ${contact.$name}`)
          try {
            await handleFetch(fetch(`${hubSpotApiUrl}/objects/contacts/?hapikey=${hubSpotApiKey}`, {
              method: "POST",
              headers,
              body: JSON.stringify({ properties: model })
            }))
            console.log(`Contact created ${contact.$email}`)
          } catch (ex) {
            console.error(`Could not create contact ${contact.$email}`)
          }
        } else {
          console.log(JSON.stringify(e, null, 2))
          console.error(`Failed to update contact with email ${contact.$email}`)
        }
      }
  }
}