exports.handleFetch = async function handleFetch(res) {
  const result = await res

  if (result.ok) {
    return result.json()
  } else {
    throw {
      status: result.status,
      statusText: result.statusText,
      res: result
    }
  }
}