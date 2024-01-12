const API_URL = 'http://localhost:8000/v1'

async function httpGetPlanets() {
  const res = await fetch(`${API_URL}/planets`)
  return await res.json()
}

async function httpGetLaunches() {
  const res = await fetch(`${API_URL}/launches`)
  const fetchedLaunches = await res.json()
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
  
    })
  } catch(err) {
    return {
      ok: false
    }
  }
  
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete"
    })
  } catch(err) {
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};