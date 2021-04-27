const { mixPanelApiUrl, mixPanelApiSecret, mixPanelProjectId } = require("../constants")
const fetch = require("node-fetch")
const { handleFetch } = require("../helpers/fetchHelper")

function getContactsForCohort(id) {
  return handleFetch(fetch(`${mixPanelApiUrl}/engage?project_id=${mixPanelProjectId}`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${mixPanelApiSecret}`,
      "ContentType": "application/json"
    },
    body: JSON.stringify({
      filter_by_cohort: { id },
      output_properties: ["$email", "$name"]
    })
  }))
}

exports.getContacts = async function getContacts()  {
  try {
    console.log("Getting cohorts")
    const result = await handleFetch(fetch(`${mixPanelApiUrl}/cohorts/list?project_id=${mixPanelProjectId}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${mixPanelApiSecret}`
      }
    }))

    console.log(`Found ${result.length} cohorts`)

    const groups = []
    for (const cohort of result) {
      console.log(`Getting contacts for ${cohort.name}`)
      try {
        const contacts = await getContactsForCohort(cohort.id)
        if (contacts.results && contacts.results.length) {
          console.log(`Found ${contacts.results.length} contacts`)
          groups.push({ contacts: contacts.results.map(r => r.$properties), name: cohort.name })
        }
      } catch (e) {
        console.log(`cannot get contacts for cohort ${cohort.name} (${e.statusText})`)
      }
    } 

    return groups

  } catch (e) {
    console.log(`cannot get cohorts.(${e.statusText})`)
  }
}


