import { mixPanelApiUrl, mixPanelApiSecret, mixPanelProjectId } from "../constants"


async function getContactsForCohort(id) {
  await fetch({
    url: `${mixPanelApiUrl}/engage?project_id=${mixPanelProjectId}`,
    headers: {
      "Authorization": `Basic ${mixPanelApiSecret}`,
      "ContentType": "application/json"
    },
    body: JSON.stringify({
      filter_by_cohort: { id },
      output_properties: ["$email", "$city", "$name"]
    })
  }).then(r => r.json())
}

export async function getContacts()  {
  const result = await fetch({
    url: `${mixPanelApiUrl}/cohorts/list?project_id=${mixPanelProjectId}`,
    headers: {
      "Authorization": `Basic ${mixPanelApiSecret}`
    }
  }).then(r => r.json())

  return Promise.all(result
    .map(async cohort =>  ({
        contacts: await getContactsForCohort(cohort.id),
        cohortName: cohort.name,
        cohortId: cohort.id
    })))
}
